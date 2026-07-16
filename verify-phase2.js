const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "js");
const code =
  fs.readFileSync(path.join(base, "data.js"), "utf8") +
  fs.readFileSync(path.join(base, "risk.js"), "utf8");

const sandbox = {};
const wrapper = new Function(
  code +
    "; return { MERCHANTS, evaluateAllMerchants, evaluateRisk, getPrimaryTrigger };"
);
const api = wrapper();

const results = api.evaluateAllMerchants(api.MERCHANTS);
const expected = {
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

let ok = true;
for (const m of results) {
  if (m.risk !== expected[m.id]) {
    ok = false;
    console.error(`FAIL ${m.id} ${m.name}: got ${m.risk}, expected ${expected[m.id]}`);
  }
}

console.log(`Merchants evaluated: ${results.length}`);
console.log(`All risk tiers match spec: ${ok}`);
console.log("");
for (const m of results) {
  console.log(`${m.id} | ${m.risk.padEnd(6)} | ${m.keySignal} | ${m.recommendation}`);
}

process.exit(ok ? 0 : 1);
