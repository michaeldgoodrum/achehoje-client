import mongoose from "mongoose";
import { normalize } from "../utils/normalize.js";

// A single `properties` collection holds both sale and rent listings,
// discriminated by `listingType`. The numeric `id` is preserved from the
// original placeholder data so existing client links (/imovel/:type/:id) keep
// working unchanged.
const propertySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    listingType: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
      index: true,
    },
    type: { type: String, required: true }, // Apartamento, Casa, Terreno, Kitnet…
    title: { type: String, required: true },
    price: { type: Number, required: true, index: true },
    address: String,
    neighborhood: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    bedrooms: { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    area: Number,
    parkingSpots: { type: Number, default: null },
    images: [String],
    features: [String],
    isFeatured: { type: Boolean, default: false },
    listedDays: { type: Number, default: 0 },
    lat: Number,
    lng: Number,

    // Accent-stripped "city state neighborhood" for fuzzy, case/accent-
    // insensitive city search. Kept in sync via the pre-save hook below.
    searchText: { type: String, index: true },
  },
  { timestamps: true }
);

propertySchema.pre("save", function setSearchText(next) {
  this.searchText = normalize(
    `${this.city} ${this.state} ${this.neighborhood || ""}`
  );
  next();
});

// Drop Mongo internals from JSON responses so the client sees the same shape
// the placeholder data produced.
propertySchema.set("toJSON", {
  virtuals: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.searchText;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const Property = mongoose.model("Property", propertySchema);
