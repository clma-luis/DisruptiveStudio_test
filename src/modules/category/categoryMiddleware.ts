import { body } from "express-validator";
import CategoryModel, { CategorySchema } from "./categoryModel";
import { Request } from "express";
import { TYPE_CATEGORIES } from "../../shared/constants/typeCategories";

export const validateCategoryBody = [
  body("name", "Field name is required and string")
    .not()
    .isEmpty()
    .isString()
    .custom((value, { req }) => validateCategoryName(value, req as Request)),
];

const validateCategoryName = async (value: string, req: Request) => {
  if (!value) throw new Error("Field name is required and string");

  if (!TYPE_CATEGORIES.includes(value)) {
    throw new Error("The category must be one of the following: image, video, document.txt");
  }

  const response = (await CategoryModel.findOne({ name: value })) as CategorySchema;

  const valueAdapter = value.trim().toLowerCase();

  if (!!response) {
    if (!!response.deleted) {
      req.body.isAlreadyDeleted = true;
      req.body.id = response._id;
    }

    if (response.name === valueAdapter && response.deleted === 0) {
      throw new Error("Category already exists");
    }
  }

  return true;
};
