import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";

import { connect, disconnect, clear } from "./helpers/db.js";
import { Property } from "../src/models/Property.js";
import { properties } from "../src/data/seedData.js";
import { londrinaProperties } from "../src/data/londrinaSeedData.js";

describe("Londrina seed data", () => {
  it("has listings, all located in Londrina, PR", () => {
    assert.ok(londrinaProperties.length >= 25);
    assert.ok(
      londrinaProperties.every((p) => p.city === "Londrina" && p.state === "PR")
    );
  });

  it("uses only valid listing types", () => {
    assert.ok(
      londrinaProperties.every(
        (p) => p.listingType === "sale" || p.listingType === "rent"
      )
    );
  });

  it("has no id collisions with the base seed data", () => {
    // seed.js does Property.create([...properties, ...londrinaProperties]); a
    // duplicate id would violate the unique index and crash the seed.
    const baseIds = new Set(properties.map((p) => p.id));
    const clashes = londrinaProperties.filter((p) => baseIds.has(p.id));
    assert.deepEqual(clashes, []);
  });
});

describe("merged seed (base + Londrina)", () => {
  const merged = [...properties, ...londrinaProperties];

  before(async () => {
    await connect();
    await clear();
  });

  after(disconnect);

  it("persists every property with a unique id (mirrors seed.js)", async () => {
    // Exercises the real seed path against the unique `id` index: any
    // duplicate id anywhere in the combined set makes .create() throw.
    await Property.create(merged);
    assert.equal(await Property.countDocuments(), merged.length);
  });
});
