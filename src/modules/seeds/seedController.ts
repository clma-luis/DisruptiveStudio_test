const bcrypt = require("bcrypt");
import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS } from "../../shared/constants/statusHTTP";
import RoleModel from "../role/roleModel";
import UserModel from "../user/userModel";
import { roleSeedData } from "./seedData/roleSeedData";
import { usersSeedData } from "./seedData/userSeedData";

export class SeedController {
  constructor() {}

  public executeRoleSeed = async (req: Request, res: Response): Promise<void> => {
    try {
      await RoleModel.insertMany(roleSeedData);

      res.status(CREATED_STATUS).json({ message: "Roles seeded successfully" });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error" });
    }
  };

  public executeUserSeed = async (_: Request, res: Response) => {
    try {
      const users = await Promise.all(
        usersSeedData.map(async (user) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          user.password = hashedPassword;

          return user;
        })
      );
      await UserModel.insertMany(users);
      res.status(CREATED_STATUS).json({ message: "Users seeded successfully" });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ error: "Internal server error" });
    }
  };
}
