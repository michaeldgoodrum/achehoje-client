import { Router } from "express";
import { Agent } from "../models/Agent.js";
import { escapeRegex } from "../utils/normalize.js";

const router = Router();

// GET /api/agents?city=&state=
router.get("/", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.city) {
      // Case-insensitive substring, matching the client's placeholder logic.
      filter.city = new RegExp(escapeRegex(req.query.city), "i");
    }
    if (req.query.state) {
      filter.state = new RegExp(`^${escapeRegex(req.query.state)}$`, "i");
    }

    const agents = await Agent.find(filter).sort({ rating: -1 });
    res.json(agents);
  } catch (err) {
    next(err);
  }
});

// GET /api/agents/:id
router.get("/:id", async (req, res, next) => {
  try {
    const agent = await Agent.findOne({ id: Number(req.params.id) });
    if (!agent) {
      return res.status(404).json({ error: "Corretor não encontrado" });
    }
    res.json(agent);
  } catch (err) {
    next(err);
  }
});

export default router;
