import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
    photo: String,
    creci: String, // Brazilian real estate license (CRECI)
    specialty: String,
    city: { type: String, required: true, index: true },
    state: { type: String, required: true, index: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    activeListings: { type: Number, default: 0 },
    soldLastYear: { type: Number, default: 0 },
    languages: [String],
    phone: String,
    agency: String,
    yearsExperience: { type: Number, default: 0 },
  },
  { timestamps: true }
);

agentSchema.set("toJSON", {
  virtuals: false,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

export const Agent = mongoose.model("Agent", agentSchema);
