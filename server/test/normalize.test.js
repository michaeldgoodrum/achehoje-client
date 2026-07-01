import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalize, escapeRegex } from "../src/utils/normalize.js";

describe("normalize", () => {
  it("strips accents", () => {
    assert.equal(normalize("São Paulo"), "sao paulo");
    assert.equal(normalize("Armação dos Búzios"), "armacao dos buzios");
    assert.equal(normalize("Florianópolis"), "florianopolis");
  });

  it("lowercases and trims", () => {
    assert.equal(normalize("  RIO  "), "rio");
  });

  it("handles empty / missing input", () => {
    assert.equal(normalize(""), "");
    assert.equal(normalize(), "");
  });
});

describe("escapeRegex", () => {
  it("escapes regex metacharacters", () => {
    assert.equal(escapeRegex("a.b*c"), "a\\.b\\*c");
    assert.equal(escapeRegex("(x)[y]"), "\\(x\\)\\[y\\]");
  });

  it("leaves plain text untouched", () => {
    assert.equal(escapeRegex("sao paulo"), "sao paulo");
  });

  it("produces a pattern that matches the literal string", () => {
    const re = new RegExp(escapeRegex("R$ 1.000 (à vista)"));
    assert.ok(re.test("preço: R$ 1.000 (à vista) hoje"));
  });
});
