import { Request, Response } from "express";
import { INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";
import { generateJWT } from "../../shared/helpers/jwtHelper";

class AuthController {
  constructor() {}

  async loginController(req: Request, res: Response) {
    const { user } = req.body;

    try {
      const token = generateJWT(user.id, user.role);
      res.status(OK_STATUS).json({ message: "Login exitoso", user, token });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error to login - tray again or try later" });
    }
  }
}

export const authController = new AuthController();
