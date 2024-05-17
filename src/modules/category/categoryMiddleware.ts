import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { BAD_REQUEST_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";
import { TYPE_CATEGORIES } from "../../shared/constants/typeCategories";
import CategoryModel, { CategorySchema } from "./categoryModel";
import { categoryService } from "./categoryService";
import TopicModel, { TopicSchema } from "../topic/topicModel";
import { removeImageFromCloud } from "../../shared/middlewares/fileMiddelwares";

export const validateCategoryBody = [
  body("name", "Field name is required and string")
    .not()
    .isEmpty()
    .isString()
    .custom((value, { req }) => validateCategoryName(value, req as Request)),
];

const validateCategoryName = async (value: string, req: Request) => {
  if (!value) throw new Error("El campo name es requerido y debe ser un string");

  if (!TYPE_CATEGORIES.includes(value)) {
    throw new Error("Las categorias permitidas son: image, video, pdf");
  }

  const response = (await CategoryModel.findOne({ name: value })) as CategorySchema;

  const valueAdapter = value.trim().toLowerCase();

  if (!!response) {
    if (!!response.deleted) {
      req.body.isAlreadyDeleted = true;
      req.body.id = response._id;
    }

    if (response.name === valueAdapter && response.deleted === 0) {
      throw new Error("La categoria ya existe");
    }
  }

  return true;
};

export const validateIsExistCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await categoryService.getOneCategory(id);
    if (!result) {
      return res.status(BAD_REQUEST_STATUS).json({ message: "La categoria no fue encontrada" });
    }
    req.body.currentCategory = result;
    next();
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error al buscar la categoria, intente nuevamente" });
  }
};

export const deleteAllFilesFromCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name } = req.body.currentCategory;
    const result = await TopicModel.find({ categories: id });

    if (result) {
      await Promise.all(
        result.map(async (item) => {
          await removeImageFromCloud(req, res, next, item[`${name}` as keyof TopicSchema]);
        })
      );
    }

    next();
  } catch (error) {
    res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error al eliminar la categoria, intente nuevamente" });
  }
};
