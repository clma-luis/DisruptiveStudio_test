import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { DOCUMENT_PDF_EXTENSIONS, IMAGE_EXTENSIONS } from "../../shared/constants/fileExtensions";
import { uploadFileInCloudinary, validateExistFile, validateFileExtension } from "../../shared/middlewares/fileMiddelwares";
import { validateObjectId } from "../../shared/middlewares/general";
import CategoryModel, { CategorySchema } from "../category/categoryModel";
import TopicModel from "./topicModel";
import { BAD_REQUEST_STATUS } from "../../shared/constants/statusHTTP";
import { YOUTUBE_PATTERN } from "../../shared/constants/regex";

export const validateTopicItems = [
  body("title", "Field name is required and string").custom((_, { req }) => validateIfUniqueTopic(req as Request)),
  body("categories", "Field categories is required and array"),
  body("videoYoutube", "Field videoYoutube is string").custom((_, { req }) => validateURLYoutube(req as Request)),
  body("image")
    /*     .custom((_, { req }) => validateExistFile(req as Request, "image")) */
    .custom((_, { req }) => validateFileExtension(req as Request, "image", IMAGE_EXTENSIONS))
    .custom((_, { req }) => uploadFileInCloudinary(req as Request, "image")),
  body("pdf")
    /*    .custom((_, { req }) => validateExistFile(req as Request, "pdf")) */
    .custom((_, { req }) => validateFileExtension(req as Request, "pdf", DOCUMENT_PDF_EXTENSIONS))
    .custom((_, { req }) => uploadFileInCloudinary(req as Request, "pdf")),
];

export const validateTipicToUpdate = [
  body("title", "Field name is required and string").isString().notEmpty(),
  body("videoYoutube", "Field videoYoutube is string").custom((_, { req }) => validateURLYoutube(req as Request)),
];

const validateURLYoutube = (req: Request) => {
  if (!YOUTUBE_PATTERN.test(req.body.videoYoutube)) {
    req.body.notExecuteUploadFile = true;
    throw new Error("Field videoYoutube is not valid");
  }
  return true;
};

const validateIfUniqueTopic = async (req: Request) => {
  const { title } = req.body;

  const response = await TopicModel.findOne({ title });

  if (response) {
    req.body.notExecuteUploadFile = true;
    throw new Error("This topic already exists");
  }

  return true;
};

export const validateCategoriesInTopic = async (req: Request, res: Response, next: NextFunction) => {
  const { categories } = req.body;

  const categoriesArray = categories.replaceAll(" ", "").split(",");
  const validateIds = categoriesArray.some((item: string) => !validateObjectId(item));

  if (validateIds) {
    req.body.notExecuteUploadFile = true;
    throw new Error("Field categories must be a valid array of ObjectId");
  }

  const convertToObjectIds = categoriesArray.map((id: string) => {
    return mongoose.Types.ObjectId.createFromHexString(id);
  });

  console.log(convertToObjectIds);

  const result = await validatePermissionsCategory(convertToObjectIds, req as Request);

  if (result) {
    req.body.notExecuteUploadFile = true;
    const categoryName = result.name;
    res.status(BAD_REQUEST_STATUS).json({ message: `La categoría "${categoryName}" no existe` });
  }

  if (categoriesArray.length === 0) {
    req.body.notExecuteUploadFile = true;
    throw new Error("Field categories is required and array");
  }

  req.body.newCategories = convertToObjectIds;
  req.body.notExecuteUploadFile = false;

  next();
};

const validatePermissionsCategory = async (data: mongoose.Types.ObjectId[], req: Request) => {
  const response = (await CategoryModel.find({ _id: { $in: data } })) as CategorySchema[];

  req.body.categoriesName = response.filter((item) => item.deleted === 0).map((item) => item.name);

  const invalidCategory = response.find((category) => category.deleted === 1) as CategorySchema;

  return invalidCategory;
};

export const dataAdapter = (req: Request, res: Response, next: NextFunction) => {
  const { categoriesName, videoYoutube, imageCreated, pdfCreated } = req.body;

  const allowedContentdata = {
    image: categoriesName.includes("image") ? imageCreated : undefined,
    videoYoutube: categoriesName.includes("videoYoutube") ? videoYoutube : undefined,
    pdf: categoriesName.includes("pdf") ? pdfCreated : undefined,
  };

  req.body.allowedContentdata = allowedContentdata;

  next();
};
