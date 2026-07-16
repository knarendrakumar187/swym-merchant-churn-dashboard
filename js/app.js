/**
 * Phase 2 verification view — replaced with full dashboard UI in Phase 3.
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  const evaluated = evaluateAllMerchants(MERCHANTS);

  const rows = evaluated
    .map(
      (m) => `
      <tr>
        <td>${m.name}</td>
        <td><span class="risk-badge risk-${m.risk.toLowerCase()}">${m.risk}</span></td>
        <td>${m.keySignal}</td>
        <td>${m.recommendation}</td>
      </tr>`
    )
    .join("");

  app.innerHTML = `
    <section class="verify-panel">
      <h2>Phase 2 — Logic verification</h2>
      <p class="verify-note">Temporary view to verify risk scoring and recommendations. Full dashboard UI comes in Phase 3.</p>
      <table class="verify-table">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Risk</th>
            <th>Key signal</th>
            <th>Recommendation</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;

  console.table(
    evaluated.map(({ name, risk, keySignal, recommendation }) => ({
      name,
      risk,
      keySignal,
      recommendation,
    }))
  );
});
