const bcrypt = require("bcrypt");
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";

import { LETTER_PATTERN, NUMBER_PATTERN, SPECIAL_CHARACTERS_PATTERN } from "../../shared/constants/regex";
import RoleModel from "../role/roleModel";
import UserModel from "./userModel";
import { BAD_REQUEST_STATUS, INTERNAL_SERVER_ERROR_STATUS, NOT_FOUND } from "../../shared/constants/statusHTTP";
import { ADMIN_ROLE } from "../../shared/constants/roles";

export const validatePasswordData = [
  body("password", "El password es requerido")
    .optional()
    .custom((value) => validatePasswordConditions(value)),
  body("newPassword", "El password es requerido como string")
    .optional()
    .custom((value) => validatePasswordConditions(value)),
];

const validatePasswordConditions = (value: string) => {
  if (!value) throw new Error("El password es requerido");
  const errors: string[] = [];

  checkLength(value, 6, 10, "El password debe ser entre 6 y 10 caracteres", errors);
  checkPattern(value, LETTER_PATTERN, "El password debe contener al menos una letra", errors);
  checkPattern(value, SPECIAL_CHARACTERS_PATTERN, "EL password debe contener al menos un caracter especial", errors);
  checkPattern(value, NUMBER_PATTERN, "El password debe contener al menos un numero", errors);

  if (errors.length > 0) throw new Error(errors.join(", "));

  return true;
};

export const validateRoleUser = async (value: string, avoidRole?: string) => {
  if (value === avoidRole) throw new Error(`No puedes crear un usuario con el rol ${avoidRole}`);
  if (!value) throw new Error("El rol es requerido");

  const existModel = await RoleModel.findOne({ role: value });

  if (!existModel) throw new Error("El rol no existe en la base de datos");

  return true;
};

export const validateExistUserFromIdParams = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await UserModel.findById(id);

  if (!user || !!user.deleted) {
    return res.status(NOT_FOUND).json({ message: "El usuario no existe" });
  }

  req.body.userFromParamsId = user;

  next();
};

export const hashPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    next();
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR_STATUS)
      .json({ message: "Ha ocurrido un error al crear la cuenta, intente nuevamente | password not hashed" });
  }
};

export const validateIsDiferentPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { password, newPassword } = req.body;

  if (password === newPassword) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "El nuevo password debe ser diferente del password actual" });
  }

  next();
};

export const validateEmailWithDataBase = async (req: Request, res: Response, next: NextFunction) => {
  const { email, userFromParamsId, userName } = req.body;

  if (userFromParamsId && email !== userFromParamsId?.email) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "El email es diferente del email de la base de datos" });
  }

  const existEmail = await compareEmailAndUserNameWithDB(email, userName);
  if (existEmail) return res.status(BAD_REQUEST_STATUS).json({ message: "El email o el userName ya existen en la base de datos" });

  next();
};

export const validateNewEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email, newEmail, user, userName } = req.body;

  if (user.email !== email) return res.status(BAD_REQUEST_STATUS).json({ message: "El email es diferente del email de la base de datos" });

  if (email === newEmail) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "El nuevo email debe ser diferente del email de la base de datos" });
  }

  const existEmail = await compareEmailAndUserNameWithDB(newEmail, userName);

  if (existEmail) return res.status(BAD_REQUEST_STATUS).json({ message: "El nuevo email ya existe en la base de datos" });

  next();
};

const compareEmailAndUserNameWithDB = async (email: string, userName: string) => {
  const user = await UserModel.findOne({ $or: [{ email: email }, { userName: userName }] }).exec();

  return user;
};

//=================================
//======Functions to password======
//=================================

const checkLength = (value: string, min: number, max: number, errorMessage: string, errors: string[]) => {
  if (value.length < min || value.length > max) {
    errors.push(errorMessage);
  }
};

const checkPattern = (value: string, pattern: RegExp, errorMessage: string, errors: string[]) => {
  if (!pattern.test(value)) {
    errors.push(errorMessage);
  }
};

export const validateUserBody = [
  body("userName", "El campo userName es requerido").not().isEmpty().isString(),
  body("email", "El email es requerido y debe ser un formato de correo").not().isEmpty().isEmail(),
  body("password", "El password es requerido como string").custom((value) => validatePasswordConditions(value)),
  body("role").custom((value) => validateRoleUser(value, ADMIN_ROLE)),
];

export const validateDataToUpdate = [
  body("userName", "El nombre es requerido").optional().isString(),
  body("role")
    .optional()
    .custom((value) => validateRoleUser(value)),
];

export const validateEmailData = [
  body("email", "El email es requerido y debe ser un formato de correo").not().isEmpty().isEmail(),
  body("newEmail", "El nuevo email es requerido y debe ser un formato de correo").not().isEmpty().isEmail(),
];
