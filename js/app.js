/**
 * Dashboard render, filter, and sort.
 */
(function () {
  const RISK_ORDER = { High: 0, Medium: 1, Low: 2 };
  const PLAN_ORDER = { Starter: 0, Pro: 1, Enterprise: 2 };

  let merchants = [];
  let activeFilter = "All";
  let sortKey = "risk";
  let sortDir = "asc";

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function compareValues(a, b, key) {
    if (key === "risk") {
      const diff = RISK_ORDER[a.risk] - RISK_ORDER[b.risk];
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    }
    if (key === "plan") {
      const diff = PLAN_ORDER[a.plan] - PLAN_ORDER[b.plan];
      return diff !== 0 ? diff : a.name.localeCompare(b.name);
    }
    return String(a[key]).localeCompare(String(b[key]), undefined, { sensitivity: "base" });
  }

  function getFilteredMerchants() {
    if (activeFilter === "All") return [...merchants];
    return merchants.filter((m) => m.risk === activeFilter);
  }

  function getSortedMerchants(list) {
    const sorted = [...list].sort((a, b) => compareValues(a, b, sortKey));
    return sortDir === "desc" ? sorted.reverse() : sorted;
  }

  function renderFilterButtons() {
    const filters = ["All", "High", "Medium", "Low"];
    return filters
      .map((filter) => {
        const count =
          filter === "All"
            ? merchants.length
            : merchants.filter((m) => m.risk === filter).length;
        const active = filter === activeFilter ? " is-active" : "";
        const riskClass = filter !== "All" ? ` filter-${filter.toLowerCase()}` : "";
        return `<button type="button" class="filter-btn${active}${riskClass}" data-filter="${filter}">
          ${filter} <span class="filter-count">${count}</span>
        </button>`;
      })
      .join("");
  }

  function renderSortIndicator(key) {
    if (sortKey !== key) return `<span class="sort-icon" aria-hidden="true">↕</span>`;
    return `<span class="sort-icon is-active" aria-hidden="true">${sortDir === "asc" ? "↑" : "↓"}</span>`;
  }

  function renderTableRows(rows) {
    if (rows.length === 0) {
      return `<tr><td colspan="5" class="empty-state">No merchants match this filter.</td></tr>`;
    }

    return rows
      .map(
        (m) => `
        <tr>
          <td class="col-name">${escapeHtml(m.name)}</td>
          <td class="col-plan">${escapeHtml(m.plan)}</td>
          <td class="col-risk">
            <span class="risk-badge risk-${m.risk.toLowerCase()}">${escapeHtml(m.risk)}</span>
          </td>
          <td class="col-signal">${escapeHtml(m.keySignal)}</td>
          <td class="col-recommendation">${escapeHtml(m.recommendation)}</td>
        </tr>`
      )
      .join("");
  }

  function render() {
    const app = document.getElementById("app");
    if (!app) return;

    const filtered = getFilteredMerchants();
    const sorted = getSortedMerchants(filtered);

    app.innerHTML = `
      <section class="dashboard">
        <div class="dashboard-toolbar">
          <div class="filter-group" role="group" aria-label="Filter by risk level">
            ${renderFilterButtons()}
          </div>
          <p class="results-meta">${sorted.length} merchant${sorted.length === 1 ? "" : "s"} shown</p>
        </div>

        <div class="table-wrap">
          <table class="merchant-table">
            <thead>
              <tr>
                <th scope="col">
                  <button type="button" class="sort-btn" data-sort="name">
                    Merchant name ${renderSortIndicator("name")}
                  </button>
                </th>
                <th scope="col">
                  <button type="button" class="sort-btn" data-sort="plan">
                    Plan ${renderSortIndicator("plan")}
                  </button>
                </th>
                <th scope="col">
                  <button type="button" class="sort-btn" data-sort="risk">
                    Risk level ${renderSortIndicator("risk")}
                  </button>
                </th>
                <th scope="col">Key signal</th>
                <th scope="col">Recommendation</th>
              </tr>
            </thead>
            <tbody>${renderTableRows(sorted)}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function bindEvents() {
    const app = document.getElementById("app");
    if (!app) return;

    app.addEventListener("click", (event) => {
      const filterBtn = event.target.closest("[data-filter]");
      if (filterBtn) {
        activeFilter = filterBtn.dataset.filter;
        render();
        return;
      }

      const sortBtn = event.target.closest("[data-sort]");
      if (sortBtn) {
        const key = sortBtn.dataset.sort;
        if (sortKey === key) {
          sortDir = sortDir === "asc" ? "desc" : "asc";
        } else {
          sortKey = key;
          sortDir = "asc";
        }
        render();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    merchants = evaluateAllMerchants(MERCHANTS);
    bindEvents();
    render();
  });
})();
