import { Request, Response } from "express";
import { CategoryController } from "../../modules/category/categoryController";
import { categoryService } from "../../modules/category/categoryService";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";

jest.mock("../../modules/category/categoryService");

describe("CategoryController", () => {
  let categoryController: CategoryController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    categoryController = new CategoryController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create a new category", async () => {
      const mockResult = {
        name: "Test Category",
        id: "1",
      };
      req.body = { name: "Test Category" };

      (categoryService.createCategory as jest.Mock).mockResolvedValue(mockResult);

      await categoryController.createCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(CREATED_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "Categoria creada correctamente", result: mockResult });
    });

    it("should handle internal server error during category creation", async () => {
      req.body = { name: "Test Category" };

      (categoryService.createCategory as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await categoryController.createCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ha ocurrido un error al crear la categoria, intente nuevamente",
      });
    });
  });

  describe("getOneCategory", () => {
    it("should get one category", async () => {
      const mockCategory = {
        name: "Test Category",
        id: "1",
      };
      req.params = { id: "1" };

      (categoryService.getOneCategory as jest.Mock).mockResolvedValue(mockCategory);

      await categoryController.getOneCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(OK_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "Categoria encontrada", result: mockCategory });
    });

    it("should handle internal server error when getting one category", async () => {
      req.params = { id: "1" };

      (categoryService.getOneCategory as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await categoryController.getOneCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Un error ha ocurrido al buscar la categoria, intente nuevamente",
      });
    });
  });

  describe("getAllCategories", () => {
    it("should get all categories", async () => {
      const mockCategories = [
        {
          name: "Category 1",
          id: "1",
        },
        {
          name: "Category 2",
          id: "2",
        },
      ];

      (categoryService.getAllCategories as jest.Mock).mockResolvedValue(mockCategories);

      await categoryController.getAllCategories(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(OK_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "Categorias encontradas correctamente", result: mockCategories });
    });

    it("should handle internal server error when getting all categories", async () => {
      (categoryService.getAllCategories as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await categoryController.getAllCategories(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Un error ha ocurrido al buscar las categorias, intente nuevamente",
      });
    });
  });

  describe("updateCategory", () => {
    it("should update a category", async () => {
      const mockResult = {
        name: "Updated Category",
        id: "1",
      };
      req.params = { id: "1" };
      req.body = { name: "Updated Category" };

      (categoryService.updateCategory as jest.Mock).mockResolvedValue(mockResult);

      await categoryController.updateCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(OK_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "Categoria actualizada correctamente", result: mockResult });
    });

    it("should handle internal server error when updating a category", async () => {
      req.params = { id: "1" };
      req.body = { name: "Updated Category" };

      (categoryService.updateCategory as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await categoryController.updateCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ha ocurrido un error al actualizar la categoria, intente nuevamente",
      });
    });
  });

  describe("removeCategory", () => {
    it("should remove a category", async () => {
      const mockCategory = {
        name: "Category to remove",
        id: "1",
      };
      req.params = { id: "1" };

      (categoryService.getOneCategory as jest.Mock).mockResolvedValue(mockCategory);
      (categoryService.removeCategory as jest.Mock).mockResolvedValue("Categoria eliminada exitosamente");

      await categoryController.removeCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(OK_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "Categoria eliminada exitosamente" });
    });

    it("should handle internal server error when category to remove is not found", async () => {
      req.params = { id: "1" };

      (categoryService.getOneCategory as jest.Mock).mockResolvedValue(null);

      await categoryController.removeCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({ message: "La categoria no fue encontrada" });
    });

    it("should handle internal server error when removing a category", async () => {
      const mockCategory = {
        name: "Category to remove",
        id: "1",
      };
      req.params = { id: "1" };

      (categoryService.getOneCategory as jest.Mock).mockResolvedValue(mockCategory);
      (categoryService.removeCategory as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await categoryController.removeCategory(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR_STATUS);
      expect(res.json).toHaveBeenCalledWith({
        message: "Ha ocurrido un error al eliminar la categoria, intente nuevamente",
      });
    });
  });
});
