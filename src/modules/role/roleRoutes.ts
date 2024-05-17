import { Router } from "express";
import { roleController } from "./roleController";

const router = Router();
const { createRole, getAllRoles, getOneRole, updateRole, removeRole } = roleController;

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Operaciones relacionadas con los roles
 */

/**
 * @swagger
 * /roles/create:
 *   post:
 *     summary: Crear un nuevo rol
 *     description: Crea un nuevo rol.
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       201:
 *         description: Rol creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error al intentar crear el rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/create", createRole);

/**
 * @swagger
 * /roles/getAll:
 *   get:
 *     summary: Obtener todos los roles
 *     description: Obtiene todos los roles existentes.
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Roles obtenidos exitosamente.
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
 *                     $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error al intentar obtener los roles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getAll", getAllRoles);

/**
 * @swagger
 * /roles/getOne/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     description: Obtiene un rol existente por su ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del rol a obtener.
 *     responses:
 *       200:
 *         description: Rol obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error al intentar obtener el rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/getOne/:id", getOneRole);

/**
 * @swagger
 * /roles/updateOne/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     description: Actualiza un rol existente por su ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del rol a actualizar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "moderator"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Role'
 *       500:
 *         description: Error al intentar actualizar el rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/updateOne/:id", updateRole);

/**
 * @swagger
 * /roles/removeOne/{id}:
 *   put:
 *     summary: Eliminar un rol
 *     description: Elimina un rol existente por su ID.
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: ID del rol a eliminar.
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error al intentar eliminar el rol.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put("/removeOne/:id", removeRole);

export default router;
