import { Router } from "express";
import { Property } from "../models/Property.js";
import { normalize, escapeRegex } from "../utils/normalize.js";

const router = Router();

// Translate the client's query params (city, minPrice, maxPrice, bedrooms,
// type) into a Mongo filter. Mirrors the placeholder filtering in the client's
// api/index.js so results are identical whether the backend is live or not.
const buildFilter = (listingType, query) => {
  const filter = { listingType };

  if (query.city) {
    // Every normalized token from the query must appear in searchText —
    // reproduces the client's fuzzyMatchCity behavior.
    const tokens = normalize(query.city).split(/[\s,]+/).filter(Boolean);
    if (tokens.length) {
      filter.$and = tokens.map((token) => ({
        searchText: new RegExp(escapeRegex(token)),
      }));
    }
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.bedrooms) {
    filter.bedrooms = { $gte: Number(query.bedrooms) };
  }

  if (query.type) {
    filter.type = new RegExp(`^${escapeRegex(query.type)}$`, "i");
  }

  return filter;
};

const listByType = (listingType) => async (req, res, next) => {
  try {
    const properties = await Property.find(buildFilter(listingType, req.query))
      .sort({ isFeatured: -1, listedDays: 1 })
      .lean({ virtuals: false });
    // .lean() skips the toJSON transform, so strip internal fields here.
    res.json(properties.map(stripInternal));
  } catch (err) {
    next(err);
  }
};

const stripInternal = ({ _id, __v, searchText, createdAt, updatedAt, ...rest }) =>
  rest;

router.get("/sale", listByType("sale"));
router.get("/rent", listByType("rent"));

// GET /api/properties/:id?type=sale|rent
router.get("/:id", async (req, res, next) => {
  try {
    const listingType = req.query.type === "rent" ? "rent" : "sale";
    const property = await Property.findOne({
      id: Number(req.params.id),
      listingType,
    });
    if (!property) {
      return res.status(404).json({ error: "Imóvel não encontrado" });
    }
    res.json(property);
  } catch (err) {
    next(err);
  }
});

export default router;
