import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { DOCUMENT_PDF_EXTENSIONS, IMAGE_EXTENSIONS } from "../../shared/constants/fileExtensions";
import { CLOUDINARY_PATTERN, YOUTUBE_PATTERN } from "../../shared/constants/regex";
import { BAD_REQUEST_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";
import { removeImageFromCloud, uploadFileInCloudinary, validateFileExtension } from "../../shared/middlewares/fileMiddelwares";
import { validateObjectId } from "../../shared/middlewares/general";
import CategoryModel, { CategorySchema } from "../category/categoryModel";
import TopicModel, { TopicSchema } from "./topicModel";

export const validateTopicItems = [
  body("title", "Field name is required and string").custom((_, { req }) => validateIfUniqueTopic(req as Request)),
  body("categories", "Field categories is required and string of ObjectId").notEmpty().withMessage("Categories is required"),
  body("videoYoutube", "Field videoYoutube is string")
    .custom((_, { req }) => validateURLYoutube(req as Request))
    .optional(),
  body("image").custom(async (_, { req }) => await executeFuntionsFile(req as Request, "image", IMAGE_EXTENSIONS)),
  body("pdf").custom(async (_, { req }) => await executeFuntionsFile(req as Request, "pdf", DOCUMENT_PDF_EXTENSIONS)),
];

export const validateTopicToUpdate = [
  body("title", "Field name is required and string").optional().notEmpty().isString(),
  body("videoYoutube", "Field videoYoutube is string")
    .custom((_, { req }) => validateURLYoutube(req as Request))
    .if(body("videoYoutube").exists()),
  body("image").custom(async (_, { req }) => {
    if (!req.body.image && !req.files?.image) {
      return true;
    }
    await validatefilesToUpdate(req as Request, "image", IMAGE_EXTENSIONS);
  }),
  body("pdf").custom(async (_, { req }) => {
    if (!req.body.pdf && !req.files?.pdf) {
      return true;
    }
    await validatefilesToUpdate(req as Request, "pdf", DOCUMENT_PDF_EXTENSIONS);
  }),
];

const validatefilesToUpdate = async (req: Request, fileName: string, validExtensions: string[]) => {
  const nameImage = req.files![`${fileName}`];
  const { currentTopic } = req.body;
  let url = "";

  if (currentTopic[fileName] !== undefined || !currentTopic[fileName]) {
    url = currentTopic[fileName];
  }

  if (req.body[fileName]) {
    if (!CLOUDINARY_PATTERN.test(req.body[fileName])) {
      throw new Error("La url del campo " + fileName + " es inválida");
    }
    return true;
  }

  const result = validateFileExtension(req as Request, fileName, validExtensions);

  if (result && nameImage) {
    await uploadFileInCloudinary(req as Request, fileName);
    await removeImageFromCloud(req, req.res as Response, req.next as NextFunction, url);
  }

  return true;
};

const executeFuntionsFile = async (req: Request, fileName: string, validExtensions: string[]) => {
  const { categoriesName } = req.body;

  if (!req.files || !categoriesName.includes(fileName)) {
    return true;
  }
  validateFileExtension(req as Request, fileName, validExtensions);
  await uploadFileInCloudinary(req as Request, fileName);
};

const validateURLYoutube = (req: Request) => {
  const url = req.body.videoYoutube;
  if (!url) return true;
  if (!YOUTUBE_PATTERN.test(url)) {
    req.body.notExecuteUploadFile = true;
    throw new Error("Field videoYoutube is not valid");
  }
  return true;
};

const validateIfUniqueTopic = async (req: Request) => {
  const { title } = req.body;

  if (!title) {
    throw new Error("The title is required and string");
  }

  const response = await TopicModel.findOne({ title });

  if (response) {
    req.body.notExecuteUploadFile = true;
    throw new Error("This topic already exists");
  }

  return true;
};

export const validateCategoriesInTopic = async (req: Request, res: Response, next: NextFunction) => {
  const { categories } = req.body;
  const currentCategories = categories ? categories : "";

  if (!currentCategories) {
    res.status(BAD_REQUEST_STATUS).json({ message: "Al menos una categoría es requerida" });
  } else {
    const categoriesArray = currentCategories.replaceAll(/ /g, "").split(",");
    const validateIds = categoriesArray.some((item: string) => !validateObjectId(item));

    if (validateIds) {
      req.body.notExecuteUploadFile = true;
      res.status(BAD_REQUEST_STATUS).json({ message: "Field categories must be a valid array of ObjectId" });
    }

    const convertToObjectIds = categoriesArray.map((id: string) => {
      return mongoose.Types.ObjectId.createFromHexString(id);
    });

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
  }
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

//===================================================================
//=================== UPDATE CATEGORIES IN TOPIC ====================
//===================================================================

export const validateIfExistTopic = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const topic = await TopicModel.findById(id);
  if (!topic) {
    req.body.notExecuteUploadFile = true;
    return res.status(BAD_REQUEST_STATUS).json({ message: "La temática no existe" });
  }

  req.body.currentTopic = topic as TopicSchema;
  next();
};

export const cleanDocument = (req: Request, res: Response, next: NextFunction) => {
  const { currentTopic, categoriesName } = req.body;
  let documentToSend: Record<string, any> = { ...currentTopic };
  const avoidProperties = ["__v", "_id", "title", "categories"];

  if (!currentTopic) {
    return res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Ha ocurrido un error intenta mas tarde" });
  }

  const keys = Object.keys(currentTopic._doc);
  const filterKeys = keys.filter((item) => !avoidProperties.includes(item));

  const categoriesToRemove = filterKeys.filter((category) => !categoriesName.includes(category));

  for (const categoryToRemove of categoriesToRemove) {
    delete documentToSend[categoryToRemove];
    if (categoryToRemove === "pdf" || categoryToRemove === "image") {
      const url = currentTopic[categoryToRemove];

      removeImageFromCloud(req, res, next, url);
    }
  }

  const dataToSend = keys.reduce((acc, el) => {
    if (categoriesToRemove.includes(el)) {
      return acc;
    }

    return { ...acc, [el]: currentTopic[el] };
  }, {});

  const dataToRemove = categoriesToRemove.reduce((acc, el) => {
    return { ...acc, [el]: "" };
  }, {});

  req.body.dataToSend = dataToSend;
  req.body.dataToRemove = dataToRemove;

  next();
};
