import { Request } from "express";
import { body } from "express-validator";
import { DOCUMENT_PDF_EXTENSIONS, IMAGE_EXTENSIONS } from "../../shared/constants/fileExtensions";
import { uploadFileInCloudinary, validateExistFile, validateFileExtension } from "../../shared/middlewares/fileMiddelwares";
import { validateObjectId } from "../../shared/middlewares/general";
import mongoose from "mongoose";

export const validateTopicItems = [
  body("title", "Field name is required and string"),
  body("categories", "Field categories is required and array").custom((_, { req }) => validateCategoriesInTopic(req as Request)),
  body("videoYoutube", "Field videoYoutube is string"),
  body("image")
    .custom((_, { req }) => validateExistFile(req as Request, "image"))
    .custom((_, { req }) => validateFileExtension(req as Request, "image", IMAGE_EXTENSIONS))
    .custom((_, { req }) => uploadFileInCloudinary(req as Request, "image")),
  body("pdf")
    .custom((_, { req }) => validateExistFile(req as Request, "pdf"))
    .custom((_, { req }) => validateFileExtension(req as Request, "pdf", DOCUMENT_PDF_EXTENSIONS))
    .custom((_, { req }) => uploadFileInCloudinary(req as Request, "pdf")),
];

export const validateCategoriesInTopic = (req: Request) => {
  const { categories } = req.body;

  const categoriesArray = categories.replaceAll(" ", "").split(",");
  const validateIds = categoriesArray.some((item: string) => !validateObjectId(item));

  if (!validateIds) {
    req.body.categoriesNotValidated = true;
    throw new Error("Field categories must be a valid array of ObjectId");
  }

  const convertToObjectIds = categoriesArray.map((id: string) => {
    mongoose.Types.ObjectId.createFromHexString(id);
  });

  if (categoriesArray.length === 0) {
    throw new Error("Field categories is required and array");
  }

  req.body.newCategories = convertToObjectIds;
  req.body.categoriesNotValidated = false;

  return true;
};
