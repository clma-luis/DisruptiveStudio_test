/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para la gestión de usuarios
 */

import express from "express";
import { ADMIN_ROLE, LECTOR_ROLE, CREADOR_ROLE } from "../../shared/constants/roles";
import { validateFields, validateObjectId, validateRole, validateToken } from "../../shared/middlewares/general";
import { UserController } from "./userController";
import {
  hashPassword,
  validateDataToUpdate,
  validateEmailData,
  validateEmailWithDataBase,
  validateExistUserFromIdParams,
  validateIsDiferentPassword,
  validateNewEmail,
  validatePasswordData,
  validateUserBody,
} from "./userMiddelwares";

const router = express.Router();

const userController = new UserController();

const { createUser, getAllUsers, getOneUser, updateUser, changeUserPassword, changeUserEmail, removeUser } = userController;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Endpoints para la gestión de usuarios
 */

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Crear usuario
 *     description: Crea un nuevo usuario en el sistema.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/UserSchema'
 *       400:
 *         description: Error de validación en los campos de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al crear usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/create", validateUserBody, validateFields, validateEmailWithDataBase, hashPassword, createUser);

/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Obtiene una lista de todos los usuarios.
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para la paginación.
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *         description: Tamaño de la página para la paginación.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtro de rol de usuario.
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserSchema'
 *                 page:
 *                   type: integer
 *                 totalUsers:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Error interno del servidor al obtener usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/getUsers", validateToken, validateRole([ADMIN_ROLE]), getAllUsers);

/**
 * @swagger
 * /user/getUser/{id}:
 *   get:
 *     summary: Obtener un usuario
 *     description: Obtiene un usuario específico por su ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/UserSchema'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al obtener usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/getUser/:id", validateObjectId("id"), validateToken, validateRole([ADMIN_ROLE]), validateExistUserFromIdParams, getOneUser);

/**
 * @swagger
 * /user/updateUser:
 *   put:
 *     summary: Actualizar un usuario
 *     description: Actualiza la información de un usuario existente.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/UserSchema'
 *       400:
 *         description: Error de validación en los campos de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al actualizar usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.put(
  "/updateUser",
  validateToken,
  validateRole([ADMIN_ROLE, LECTOR_ROLE, CREADOR_ROLE]),
  validateDataToUpdate,
  validateFields,
  updateUser
);

/**
 * @swagger
 * /user/removeUser/{id}:
 *   post:
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario específico por su ID.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al eliminar usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post(
  "/removeUser/:id",
  validateObjectId("id"),
  validateToken,
  validateExistUserFromIdParams,
  validateRole([ADMIN_ROLE]),
  removeUser
);

/**
 * @swagger
 * /user/changePassword:
 *   post:
 *     summary: Cambiar contraseña de usuario
 *     description: Cambia la contraseña de un usuario existente.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/UserSchema'
 *       400:
 *         description: Error de validación en los campos de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al cambiar la contraseña.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/changePassword", validateToken, validatePasswordData, validateFields, validateIsDiferentPassword, changeUserPassword);

/**
 * @swagger
 * /user/changeEmail:
 *   post:
 *     summary: Cambiar correo electrónico de usuario
 *     description: Cambia el correo electrónico de un usuario existente.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo electrónico cambiado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/UserSchema'
 *       400:
 *         description: Error de validación en los campos de entrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error interno del servidor al cambiar el correo electrónico.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post("/changeEmail", validateToken, validateEmailData, validateFields, validateNewEmail, changeUserEmail);

export default router;
