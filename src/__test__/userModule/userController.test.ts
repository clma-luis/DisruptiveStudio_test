import { Request, Response } from "express";
import { usersSeedData } from "../../modules/seeds/seedData/userSeedData";
import { UserController } from "../../modules/user/userController";
import { userService } from "../../modules/user/userService";
import { CREATED_STATUS } from "../../shared/constants/statusHTTP";

jest.mock("../../modules/user/userService");

const userExample = usersSeedData[0];

describe("UserController", () => {
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    userController = new UserController();
    req = {
      body: userExample,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const mockResult = {
        message: "User created successfully",
        result: {
          userName: "PedroSuarez",
          email: "tedst@test.com",
          role: "CREADOR_ROLE",
          id: "66469e51cd8aea2978e37af4",
        },
      };
      (userService.createUser as jest.Mock).mockResolvedValue(mockResult);

      await userController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(CREATED_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "User created successfully", result: mockResult });
    });
  });
});
