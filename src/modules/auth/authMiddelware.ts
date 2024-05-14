import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import UserModel, { UserSchema } from "../user/userModel";
import { BAD_REQUEST_STATUS } from "../../shared/constants/statusHTTP";

export const validateLoginBody = [
  body("email", "El campo de correo electrónico es obligatorio y en formato de correo").notEmpty().isEmail(),
  body("password", "La contraseña es obligatoria").notEmpty(),
];

export const validateLoginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email }).exec();
  const passwordMatch = await comparePasswords(req.body.password, user?.password as string);

  if (!user) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "El email no existe" });
  } else if (user?.deleted) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "usuario eliminado" });
  } else if (!passwordMatch) {
    return res.status(BAD_REQUEST_STATUS).json({ message: "La contraseña es incorrecta" });
  }

  const userAdapter = userDataAdapter(user);
  req.body.user = userAdapter;
  next();
};

const comparePasswords = async (password: string, passwordHash: string) => {
  if (!passwordHash || !password) return false;
  return bcrypt.compareSync(password, passwordHash);
};

const userDataAdapter = (user: UserSchema) => {
  const { _id, image, name, email, role } = user;

  const result = {
    id: _id.toString(),
    image,
    name,
    email,
    role,
  };

  return result;
};
