/**
 * Phase 4 end-to-end verification script.
 * Run: node verify-phase4.js
 */
const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "js");
const code =
  fs.readFileSync(path.join(base, "data.js"), "utf8") +
  fs.readFileSync(path.join(base, "risk.js"), "utf8");

const api = new Function(
  code +
    "; return { MERCHANTS, evaluateAllMerchants, evaluateRisk, getPrimaryTrigger, RECOMMENDATIONS };"
)();

const RISK_ORDER = { High: 0, Medium: 1, Low: 2 };
const PLAN_ORDER = { Starter: 0, Pro: 1, Enterprise: 2 };

const expectedRisk = {
  m001: "High",
  m002: "High",
  m003: "High",
  m004: "High",
  m005: "High",
  m006: "Medium",
  m007: "Medium",
  m008: "Medium",
  m009: "Low",
};

const expectedRecommendations = {
  m001: api.RECOMMENDATIONS.billing,
  m002: api.RECOMMENDATIONS.billing,
  m003: api.RECOMMENDATIONS.orderDecline,
  m004: api.RECOMMENDATIONS.loginGap,
  m005: api.RECOMMENDATIONS.inactiveStore,
  m006: api.RECOMMENDATIONS.orderDecline,
  m007: api.RECOMMENDATIONS.trial,
  m008: api.RECOMMENDATIONS.support,
  m009: api.RECOMMENDATIONS.healthy,
};

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

function filterMerchants(merchants, activeFilter) {
  if (activeFilter === "All") return [...merchants];
  return merchants.filter((m) => m.risk === activeFilter);
}

function sortMerchants(list, sortKey, sortDir) {
  const sorted = [...list].sort((a, b) => compareValues(a, b, sortKey));
  return sortDir === "desc" ? sorted.reverse() : sorted;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isSorted(list, key, dir) {
  for (let i = 1; i < list.length; i += 1) {
    const cmp = compareValues(list[i - 1], list[i], key);
    if (dir === "asc" && cmp > 0) return false;
    if (dir === "desc" && cmp < 0) return false;
  }
  return true;
}

const merchants = api.evaluateAllMerchants(api.MERCHANTS);
let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed += 1;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err.message}`);
    failed += 1;
  }
}

console.log("Phase 4 verification\n");

console.log("4.1 Risk tiers");
for (const m of merchants) {
  check(`${m.id} ${m.name} → ${expectedRisk[m.id]}`, () => {
    assert(m.risk === expectedRisk[m.id], `got ${m.risk}`);
  });
}

console.log("\n4.2 Recommendations");
for (const m of merchants) {
  check(`${m.id} recommendation`, () => {
    assert(
      m.recommendation === expectedRecommendations[m.id],
      `got "${m.recommendation}"`
    );
  });
}

console.log("\n4.3 Filter subsets");
check("All filter returns 9 merchants", () => {
  assert(filterMerchants(merchants, "All").length === 9, "wrong count");
});
check("High filter returns 5 merchants", () => {
  const high = filterMerchants(merchants, "High");
  assert(high.length === 5, `got ${high.length}`);
  assert(high.every((m) => m.risk === "High"), "non-high merchant included");
});
check("Medium filter returns 3 merchants", () => {
  const medium = filterMerchants(merchants, "Medium");
  assert(medium.length === 3, `got ${medium.length}`);
  assert(medium.every((m) => m.risk === "Medium"), "non-medium merchant included");
});
check("Low filter returns 1 merchant", () => {
  const low = filterMerchants(merchants, "Low");
  assert(low.length === 1, `got ${low.length}`);
  assert(low[0].id === "m009", `got ${low[0].id}`);
});

console.log("\n4.4 Sort asc/desc");
for (const key of ["name", "plan", "risk"]) {
  for (const dir of ["asc", "desc"]) {
    check(`sort by ${key} ${dir}`, () => {
      const sorted = sortMerchants(merchants, key, dir);
      assert(isSorted(sorted, key, dir), "order incorrect");
    });
  }
}

console.log("\n4.5 Data coverage");
check("mock data count within spec (5–10)", () => {
  assert(merchants.length >= 5 && merchants.length <= 10, `got ${merchants.length}`);
});
check("all three risk tiers represented", () => {
  const tiers = new Set(merchants.map((m) => m.risk));
  assert(tiers.has("High") && tiers.has("Medium") && tiers.has("Low"), "missing tier");
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
