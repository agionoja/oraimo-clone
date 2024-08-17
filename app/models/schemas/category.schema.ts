import { Query, Schema } from "mongoose";

const subcategoryMap = {
  power: [
    "power banks",
    "power station",
    "wall chargers",
    "solar generators",
    "power strips",
    "car chargers",
    "cables",
  ] as const,
  audio: [
    "wireless stereo earbuds",
    "wireless over-Ear headphones",
    "wireless neckband headphones",
    "open-Ear headphones",
    "wireless speakers",
    "wired earphones",
  ] as const,
  "smart & office": [
    "smart watches",
    "smart scales",
    "smart lighting",
    "mouse & keyboards",
    "camera accessories",
    "backpacks",
  ] as const,
  "personal care": [
    "grooming series",
    "oral care",
    "mirrors",
    "hair dryers",
    "hair styling tools",
  ] as const,
  "home appliances": [
    "vacuum & scrubbers",
    "blenders",
    "handheld fans",
    "humidifiers",
    "electric kettles",
    "air fryers",
  ] as const,
} as const;

export type Categories = keyof typeof subcategoryMap;
export type Subcategories = (typeof subcategoryMap)[Categories][number];

export interface ICategory {
  category: Categories;
  subcategory: Subcategories;
}

const categorySchema = new Schema<ICategory>({
  category: {
    type: String,
    required: [true, "Category is required. Please select a valid category."],
    enum: Object.keys(subcategoryMap),
  },
  subcategory: {
    type: String,
    required: [
      true,
      "Subcategory is required. Please select a valid subcategory for the selected category.",
    ],
    validate: {
      validator: function (value) {
        let cat: Categories;
        const self = this as ICategory & Query<ICategory, never>;

        if (self.get && self.get("")) {
          cat = self.get("category") as Categories;
        } else {
          cat = self.category;
        }

        const validSubcategories = subcategoryMap[cat];
        return [...validSubcategories].includes(value);
      },
      message:
        "The subcategory({VALUE}) does not match the selected category. Please choose an appropriate subcategory.",
    },
  },
});

export default categorySchema;
