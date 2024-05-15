import express from "express";
import { CategoryController } from "./categoryController";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { ADMIN_ROLE } from "../../shared/constants/roles";
import { validateCategoryBody } from "./categoryMiddleware";

const router = express.Router();

const categoryController = new CategoryController();

const { createCategory, getAllCategories, getOneCategory, removeCategory, updateCategory } = categoryController;

router.post("/create", validateCategoryBody, validateFields, validateToken, validateRole([ADMIN_ROLE]), createCategory);

router.get("/getAll", getAllCategories);

router.get("/getOne/:id", validateObjectId("id"), getOneCategory);

router.put("/updateOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), updateCategory);

router.post("/removeOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), removeCategory);

export default router;
