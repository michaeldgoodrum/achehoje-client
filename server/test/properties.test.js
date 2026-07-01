import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import { connect, disconnect, clear } from "./helpers/db.js";
import { createApp } from "../src/app.js";
import { Property } from "../src/models/Property.js";
import { properties } from "../src/data/seedData.js";

const app = createApp();

before(async () => {
  await connect();
  await clear();
  // .create() (not insertMany) so the pre-save hook fills searchText.
  await Property.create(properties);
});

after(disconnect);

describe("GET /health", () => {
  it("reports ok", async () => {
    const res = await request(app).get("/health");
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: "ok" });
  });
});

describe("GET /api/properties/sale", () => {
  it("returns all sale listings", async () => {
    const res = await request(app).get("/api/properties/sale");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 8);
  });

  it("sorts featured listings first", async () => {
    const res = await request(app).get("/api/properties/sale");
    assert.equal(res.body[0].isFeatured, true);
  });

  it("does not leak internal Mongo fields", async () => {
    const res = await request(app).get("/api/properties/sale");
    const doc = res.body[0];
    assert.ok(!("_id" in doc));
    assert.ok(!("__v" in doc));
    assert.ok(!("searchText" in doc));
    assert.ok(typeof doc.id === "number");
  });

  it("filters by city (accent/case-insensitive fuzzy match)", async () => {
    const res = await request(app)
      .get("/api/properties/sale")
      .query({ city: "sao paulo" });
    assert.ok(res.body.length > 0);
    assert.ok(res.body.every((p) => p.city === "São Paulo"));
  });

  it("filters by min/max price (inclusive)", async () => {
    const res = await request(app)
      .get("/api/properties/sale")
      .query({ minPrice: 900000, maxPrice: 1300000 });
    assert.ok(res.body.length > 0);
    assert.ok(res.body.every((p) => p.price >= 900000 && p.price <= 1300000));
  });

  it("filters by bedrooms as a minimum", async () => {
    const res = await request(app)
      .get("/api/properties/sale")
      .query({ bedrooms: 4 });
    assert.ok(res.body.length > 0);
    assert.ok(res.body.every((p) => p.bedrooms >= 4));
  });

  it("filters by type (case-insensitive exact)", async () => {
    const res = await request(app)
      .get("/api/properties/sale")
      .query({ type: "casa" });
    assert.ok(res.body.length > 0);
    assert.ok(res.body.every((p) => p.type === "Casa"));
  });

  it("combines filters", async () => {
    const res = await request(app)
      .get("/api/properties/sale")
      .query({ type: "casa", bedrooms: 3, minPrice: 900000 });
    assert.ok(res.body.every((p) => p.type === "Casa" && p.bedrooms >= 3 && p.price >= 900000));
  });
});

describe("GET /api/properties/rent", () => {
  it("returns only rent listings", async () => {
    const res = await request(app).get("/api/properties/rent");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 8);
  });

  it("does not return sale listings when filtering rent by city", async () => {
    const res = await request(app)
      .get("/api/properties/rent")
      .query({ city: "sao paulo" });
    assert.equal(res.body.length, 4);
    assert.ok(res.body.every((p) => p.city === "São Paulo"));
  });
});

describe("GET /api/properties/:id", () => {
  it("returns a sale property by id", async () => {
    const res = await request(app).get("/api/properties/2").query({ type: "sale" });
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 2);
    assert.equal(res.body.type, "Casa");
  });

  it("returns a rent property by id", async () => {
    const res = await request(app).get("/api/properties/101").query({ type: "rent" });
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 101);
  });

  it("404s when the id exists but under a different listing type", async () => {
    const res = await request(app).get("/api/properties/101").query({ type: "sale" });
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Imóvel não encontrado");
  });

  it("404s for an unknown id", async () => {
    const res = await request(app).get("/api/properties/9999").query({ type: "sale" });
    assert.equal(res.status, 404);
  });
});

describe("unknown API routes", () => {
  it("404s with a JSON error", async () => {
    const res = await request(app).get("/api/nope");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Rota não encontrada");
  });
});
