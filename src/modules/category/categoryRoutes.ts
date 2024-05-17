import express from "express";
import { CategoryController } from "./categoryController";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { ADMIN_ROLE } from "../../shared/constants/roles";
import { deleteAllFilesFromCloudinary, validateCategoryBody, validateIsExistCategory } from "./categoryMiddleware";

const router = express.Router();

const categoryController = new CategoryController();

const { createCategory, getAllCategories, getOneCategory, removeCategory, updateCategory } = categoryController;

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operaciones relacionadas con las categorías
 */

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Crear una nueva categoría
 *     description: Crea una nueva categoría.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "image"
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Error al intentar crear la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/create", validateCategoryBody, validateFields, validateToken, validateRole([ADMIN_ROLE]), createCategory);

/**
 * @swagger
 * /categories/getAll:
 *   get:
 *     summary: Obtener todas las categorías
 *     description: Obtiene todas las categorías existentes.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categorías obtenidas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al intentar obtener las categorías.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getAll", getAllCategories);

/**
 * @swagger
 * /categories/getOne/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     description: Obtiene una categoría existente por su ID.
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID de la categoría a obtener.
 *     responses:
 *       200:
 *         description: Categoría obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al intentar obtener la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getOne/:id", validateObjectId("id"), getOneCategory);

/**
 * @swagger
 * /categories/updateOne/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     description: Actualiza una categoría existente por su ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID de la categoría a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "video"
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error al intentar actualizar la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/updateOne/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), updateCategory);

/**
 * @swagger
 * /categories/removeOne/{id}:
 *   post:
 *     summary: Eliminar una categoría
 *     description: Elimina una categoría existente por su ID.
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID de la categoría a eliminar.
 *     responses:
 *       200:
 *         description: Categoría eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error al intentar eliminar la categoría.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post(
  "/removeOne/:id",
  validateObjectId("id"),
  validateToken,
  validateRole([ADMIN_ROLE]),
  validateIsExistCategory,
  deleteAllFilesFromCloudinary,
  removeCategory
);

export default router;
