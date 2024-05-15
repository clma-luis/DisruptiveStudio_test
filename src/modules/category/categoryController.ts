import { Request, Response } from "express";
import { categoryService } from "./categoryService";
import { CREATED_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";

export class CategoryController {
  constructor() {}

  async createCategory(req: Request, res: Response) {
    const { name, isAlreadyDeleted, id } = req.body;
    console.log({ isAlreadyDeleted });

    if (isAlreadyDeleted) {
      const result = await categoryService.resetCategory(id);
      res.status(CREATED_STATUS).json({ message: "Category created successfully", result });
    } else {
      const result = await categoryService.createCategory(name);
      res.status(CREATED_STATUS).json({ message: "Category created successfully", result });
    }
  }

  async getOneCategory(req: Request, res: Response) {
    const result = await categoryService.getOneCategory();
    return result;
  }

  async getAllCategories(req: Request, res: Response) {
    const result = await categoryService.getAllCategories();
    return result;
  }

  async updateCategory(req: Request, res: Response) {
    const { name } = req.body;
    const id = req.params.id;
    const result = await categoryService.updateCategory(id, name);
    res.status(OK_STATUS).json({ message: "Category updated successfully", result });
  }

  async removeCategory(req: Request, res: Response) {
    const id = req.params.id;
    await categoryService.removeCategory(id);
    res.status(OK_STATUS).json({ message: "Category removed successfully" });
  }
}
