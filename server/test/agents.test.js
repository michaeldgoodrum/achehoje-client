import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import { connect, disconnect, clear } from "./helpers/db.js";
import { createApp } from "../src/app.js";
import { Agent } from "../src/models/Agent.js";
import { agents } from "../src/data/seedData.js";

const app = createApp();

before(async () => {
  await connect();
  await clear();
  await Agent.create(agents);
});

after(disconnect);

describe("GET /api/agents", () => {
  it("returns all agents", async () => {
    const res = await request(app).get("/api/agents");
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 6);
  });

  it("sorts by rating descending", async () => {
    const res = await request(app).get("/api/agents");
    const ratings = res.body.map((a) => a.rating);
    assert.deepEqual(ratings, [...ratings].sort((a, b) => b - a));
  });

  it("filters by state (case-insensitive exact)", async () => {
    const res = await request(app).get("/api/agents").query({ state: "sp" });
    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].state, "SP");
  });

  it("filters by city (case-insensitive substring)", async () => {
    const res = await request(app).get("/api/agents").query({ city: "rio" });
    assert.ok(res.body.length > 0);
    assert.ok(res.body.every((a) => /rio/i.test(a.city)));
  });

  it("does not leak internal Mongo fields", async () => {
    const res = await request(app).get("/api/agents");
    const doc = res.body[0];
    assert.ok(!("_id" in doc));
    assert.ok(!("__v" in doc));
  });
});

describe("GET /api/agents/:id", () => {
  it("returns an agent by id", async () => {
    const res = await request(app).get("/api/agents/3");
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 3);
    assert.equal(res.body.city, "Florianópolis");
  });

  it("404s for an unknown id", async () => {
    const res = await request(app).get("/api/agents/9999");
    assert.equal(res.status, 404);
    assert.equal(res.body.error, "Corretor não encontrado");
  });
});
