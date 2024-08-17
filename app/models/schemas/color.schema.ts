import { Query, Schema } from "mongoose";
import { isObject } from "~/utils/typeValidators";

export const isIColor = <T>(item: T) =>
  isObject(item) && "name" in item && "code" in item;

const colorMap = {
  black: "#000000",
  blue: "#0000ff",
  white: "#ffffff",
  silver: "#c0c0c0",
  green: "#18473a",
  gold: "#fbf1a3",
  "dark grey": "#404040",
  Mystblue: "#12417a",
  grey: "#808080",
  nebulablue: "#515985",
} as const;

export type ColorName = keyof typeof colorMap;
export type ColorCode = (typeof colorMap)[ColorName];
interface IColorWithQuery extends IColor, Query<IColor, never> {}

export interface IColor {
  name: ColorName;
  code: ColorCode;
}

const colorSchema = new Schema<IColor>({
  name: {
    type: String,
    required: [
      true,
      "Color name is required. Please select a color from the available options.",
    ],
    enum: Object.keys(colorMap),
  },
  code: {
    type: String,
    required: [
      true,
      "Color code is required. Please provide the correct code for the selected color.",
    ],
    validate: {
      validator: function (value) {
        const self = this as IColorWithQuery;

        if (self.get("name")) {
          const name = self.get("name") as ColorName;
          return colorMap[name] === value;
        } else {
          return colorMap[this.name] === value;
        }
      },
      message:
        "The color code({VALUE}) provided does not match the expected code for the selected color. Please correct it.",
    },
  },
});

export default colorSchema;
