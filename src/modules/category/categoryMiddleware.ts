import { body } from "express-validator";
import CategoryModel, { CategorySchema } from "./categoryModel";
import { Request } from "express";

export const validateCategoryBody = [
  body("name", "Field name is required and string")
    .not()
    .isEmpty()
    .isString()
    .custom((value, { req }) => validateCategoryName(value, req as Request)),
];

const validateCategoryName = async (value: string, req: Request) => {
  if (!value) throw new Error("Field name is required and string");
  const response = (await CategoryModel.findOne({ name: value })) as CategorySchema;
  const valueAdapter = value.trim().toLowerCase();

  if (!!response.deleted) {
    req.body.isAlreadyDeleted = true;
    req.body.id = response._id;
  }

  if (response.name === valueAdapter && response.deleted === 0) {
    throw new Error("Category already exists");
  }

  return true;
};