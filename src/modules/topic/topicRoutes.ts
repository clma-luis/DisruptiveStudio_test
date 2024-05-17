import express from "express";
import { ADMIN_ROLE, CREADOR_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { TopicController } from "./topicController";
import {
  cleanDocument,
  dataAdapter,
  validateCategoriesInTopic,
  validateIfExistTopic,
  validateTopicToUpdate,
  validateTopicItems,
} from "./topicMiddlewares";

const router = express.Router();

const topicController = new TopicController();

const { createTopic, getAllTopics, getOneTopic, findTopicsByCategory, removeTopic, updateCategoriesInTopic, updateTopic } = topicController;

/**
 * @swagger
 * /topics/create:
 *   post:
 *     summary: Crear un nuevo tema
 *     description: Permite crear un nuevo tema.
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del tema.
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                 description: Array de categorías (IDs de categorías).
 *               videoYoutube:
 *                 type: string
 *                 description: Enlace de video de YouTube (opcional).
 *               image:
 *                 type: string
 *                 description: URL de la imagen (opcional).
 *               pdf:
 *                 type: string
 *                 description: URL del PDF (opcional).
 *     responses:
 *       201:
 *         description: Tema creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Error al intentar crear el tema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post(
  "/create",
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateCategoriesInTopic,
  validateTopicItems,
  validateFields,
  dataAdapter,
  createTopic
);

/**
 * @swagger
 * /topics/getAll:
 *   get:
 *     summary: Obtener todos los temas
 *     description: Obtiene todos los temas paginados.
 *     tags: [Topics]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Tamaño de la página.
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Categoría a filtrar (opcional).
 *       - in: query
 *         name: term
 *         schema:
 *           type: string
 *         description: Término de búsqueda (opcional).
 *     responses:
 *       200:
 *         description: Temas encontrados exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Topic'
 *                     page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Error al intentar obtener los temas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get("/getAll", getAllTopics);

/**
 * @swagger
 * /topics/getOne/{id}:
 *   get:
 *     summary: Obtener un tema por ID
 *     description: Obtiene un tema específico por su ID.
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del tema a obtener.
 *     responses:
 *       200:
 *         description: Tema encontrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Error al intentar obtener el tema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/getOne/:id", getOneTopic);

/**
 * @swagger
 * /topics/updateCategoriesInTopic/{id}:
 *   put:
 *     summary: Actualizar categorías de un tema
 *     description: Actualiza las categorías de un tema existente por su ID.
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del tema a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: objectId
 *                 description: Array de nuevas categorías (IDs de categorías).
 *               image:
 *                 type: string
 *                 description: URL de la nueva imagen (opcional).
 *               pdf:
 *                 type: string
 *                 description: URL del nuevo PDF (opcional).
 *     responses:
 *       201:
 *         description: Categorías actualizadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Error al intentar actualizar las categorías del tema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put(
  "/updateCategoriesInTopic/:id",
  validateObjectId("id"),
  validateIfExistTopic,
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateCategoriesInTopic,
  cleanDocument,
  updateCategoriesInTopic
);

/**
 * @swagger
 * /topics/updateOne/{id}:
 *   put:
 *     summary: Actualizar un tema
 *     description: Actualiza un tema existente por su ID.
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del tema a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Nuevo título del tema.
 *               videoYoutube:
 *                 type: string
 *                 description: Nuevo enlace de video de YouTube (opcional).
 *               image:
 *                 type: string
 *                 description: URL de la nueva imagen (opcional).
 *               pdf:
 *                 type: string
 *                 description: URL del nuevo PDF (opcional).
 *     responses:
 *       201:
 *         description: Tema actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Error al intentar actualizar el tema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put(
  "/updateOne/:id",
  validateObjectId("id"),
  validateIfExistTopic,
  validateToken,
  validateRole([ADMIN_ROLE, CREADOR_ROLE]),
  validateTopicToUpdate,
  validateFields,
  updateTopic
);

/**
 * @swagger
 * /topics/removeOne/{id}:
 *   post:
 *     summary: Eliminar un tema
 *     description: Elimina un tema existente por su ID.
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del tema a eliminar.
 *     responses:
 *       201:
 *         description: Tema eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Error al intentar eliminar el tema.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/removeOne/:id", validateObjectId("id"), validateIfExistTopic, validateToken, validateRole([ADMIN_ROLE]), removeTopic);

router.get("/findCategoryById/:id", validateObjectId("id"), findTopicsByCategory);

export default router;
