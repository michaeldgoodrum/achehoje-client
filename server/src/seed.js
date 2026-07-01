import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "./db.js";
import { Property } from "./models/Property.js";
import { Agent } from "./models/Agent.js";
import { properties, agents } from "./data/seedData.js";
import { londrinaProperties } from "./data/londrinaSeedData.js";

const allProperties = [...properties, ...londrinaProperties];

// Wipes and repopulates the database from the seed data. Run with `npm run seed`
// (or automatically on first container start via docker-compose).
const seed = async () => {
  await connectDB();

  await Promise.all([Property.deleteMany({}), Agent.deleteMany({})]);

  // Use .create() (not insertMany) so the Property pre-save hook runs and
  // populates searchText for each document.
  await Property.create(allProperties);
  await Agent.create(agents);

  console.log(
    `🌱 Seeded ${allProperties.length} properties and ${agents.length} agents.`
  );

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
