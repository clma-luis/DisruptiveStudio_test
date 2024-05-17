import { Request, Response } from "express";
import { categoryService } from "./categoryService";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";

export class CategoryController {
  constructor() {}

  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const result = await categoryService.createCategory(name);
      res.status(CREATED_STATUS).json({ message: "Categoria creada correctamente", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error al crear la categoria, intente nuevamente" });
    }
  }

  async getOneCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await categoryService.getOneCategory(id);
      res.status(OK_STATUS).json({ message: "Categoria encontrada", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Un error ha ocurrido al buscar la categoria, intente nuevamente" });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const result = await categoryService.getAllCategories();
      res.status(OK_STATUS).json({ message: "Categorias encontradas correctamente", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Un error ha ocurrido al buscar las categorias, intente nuevamente" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const id = req.params.id;
      const result = await categoryService.updateCategory(id, name);
      res.status(OK_STATUS).json({ message: "Categoria actualizada correctamente", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error al actualizar la categoria, intente nuevamente" });
    }
  }

  async removeCategory(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = req.body.currentCategory;
      await categoryService.removeCategory(id, result);
      res.status(OK_STATUS).json({ message: "Categoria eliminada exitosamente" });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error al eliminar la categoria, intente nuevamente" });
    }
  }
}
