import { Request, Response } from "express";
import { validateCategoryBody } from "../../modules/category/categoryMiddleware";
import CategoryModel from "../../modules/category/categoryModel";

jest.mock("../../modules/category/categoryModel");

describe("Category Validator Middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {
        name: "image",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate category body successfully", async () => {
    const mockCategory = {
      name: "image",
    };

    (CategoryModel.findOne as jest.Mock).mockResolvedValue(mockCategory);

    await Promise.all(validateCategoryBody.map((middleware) => middleware(req as Request, res as Response, next)));

    expect(next).toHaveBeenCalled();
  });
});
