import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";
import { userService } from "./userService";

export class UserController {
  private page: number;
  private size: number;

  constructor() {
    this.page = 1;
    this.size = 10;

    this.getAllUsers = this.getAllUsers.bind(this);
  }

  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req.body);
    res.status(CREATED_STATUS).json({ message: "User created successfully", result });
  }

  async getAllUsers(req: Request, res: Response) {
    const { page, size, role } = req.query;
    const currentPage = !page ? this.page : Number(page);
    const currentSize = !size ? this.size : Number(size);
    const currentRole = !role ? "" : role;

    try {
      const result = await userService.getAllUsers({ page: currentPage, size: currentSize, role: currentRole as string });

      res.status(OK_STATUS).json({ message: "users found", ...result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error while getting users" });
    }
  }

  async getOneUser(req: Request, res: Response) {
    const { id } = req.params;
    const result = await userService.getOneUser(id);
    res.status(OK_STATUS).json({ message: "user found", result });
  }

  async updateUser(req: Request, res: Response) {
    const { _id, __v, email, password, deleted, role, tokenRole, ...rest } = req.body;
    const { id } = req.body.user;

    try {
      const result = await userService.updateUser(id, rest);
      res.status(OK_STATUS).json({ message: "updated successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the user" });
    }
  }

  async changeUserPassword(req: Request, res: Response) {
    const { id } = req.body.user;
    const { newPassword } = req.body;

    try {
      const result = await userService.changeUserPassword(id, newPassword);
      res.status(OK_STATUS).json({ message: "password updated successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating user's password " });
    }
  }

  async changeUserEmail(req: Request, res: Response) {
    const { id } = req.body.user;
    const { newEmail } = req.body;

    const result = await userService.changeUserEmail(id, newEmail);
    res.status(OK_STATUS).json({ message: "email updated successfully", result });
  }

  async removeUser(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = req.body;

    const result = await userService.removeUser(id);
    res.status(OK_STATUS).json({ message: result, user });
  }
}
