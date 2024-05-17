import { Request, Response } from "express";
import { CREATED_STATUS, INTERNAL_SERVER_ERROR_STATUS, OK_STATUS } from "../../shared/constants/statusHTTP";
import { topicService } from "./topicService";
import { TopicSchema } from "./topicModel";

export class TopicController {
  private page: number;
  private size: number;

  constructor() {
    this.page = 1;
    this.size = 10;
  }

  async createTopic(req: Request, res: Response) {
    const { title, newCategories, allowedContentdata } = req.body;
    try {
      const result = await topicService.createTopic({
        title,
        categories: newCategories,
        ...allowedContentdata,
      } as TopicSchema);

      res.status(CREATED_STATUS).json({ message: "Topic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while creating the topic" });
    }
  }
  async getOneTopic(req: Request, res: Response) {
    try {
      const result = await topicService.getOneTopic(req.params.id);
      res.status(OK_STATUS).json({ message: "Temática encontrada", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Un error ha ocurrido al buscar la tematica, intente nuevamente" });
    }
  }

  async findTopicsByCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const topics = await topicService.findTopicsByCategory(id);
      if (!topics) return res.status(OK_STATUS).json({ message: "No se encontraron temas", result: { data: [] } });
      res.status(OK_STATUS).json({ message: "Temáticas encontradas exitosamente", result: { data: topics } });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Un error ha ocurrido al buscar las tematicas, intente nuevamente" });
    }
  }
  async getAllTopics(req: Request, res: Response) {
    try {
      const { page, size, category, term } = req.query;
      const currentTerm = !term ? "" : term;
      const currentPage = !page ? this.page : Number(page);
      const currentSize = !size ? this.size : Number(size);
      const currentCategory = !category ? "" : category;

      const result = await topicService.getAllTopics({
        page: currentPage,
        size: currentSize,
        category: currentCategory as string,
        term: currentTerm as string,
      });
      res.status(OK_STATUS).json({ message: "Temáticas encontradas exitosamente", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "Ha ocurrido un error en la busqueda de temáticas" });
    }
  }

  async updateCategoriesInTopic(req: Request, res: Response) {
    const { newCategories, dataToSend, dataToRemove } = req.body;

    const { _id, __v, categories, ...rest } = dataToSend;

    const { id } = req.params;
    try {
      const result = await topicService.updateCategoriesInTopic(id, { categories: newCategories, ...rest }, dataToRemove);
      res.status(CREATED_STATUS).json({ message: "updateCategoriesInTopic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the topic" });
    }
  }

  async updateTopic(req: Request, res: Response) {
    try {
      const { tokenRole, user, categories, newCategories, ...rest } = req.body;

      const pdf = rest.pdfCreated ? rest.pdfCreated : rest.pdf;
      const image = rest.imageCreated ? rest.imageCreated : rest.image;

      const result = await topicService.updateTopic(req.params.id, { ...rest, pdf, image } as TopicSchema);

      res.status(CREATED_STATUS).json({ message: "getAllTopic created successfully", result });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR_STATUS).json({ message: "An error occurred while updating the topic" });
    }
  }

  async removeTopic(req: Request, res: Response) {
    const { id } = req.params;
    const result = await topicService.removeTopic(id);
    res.status(CREATED_STATUS).json({ message: "removeTopic created successfully", result });
  }
}
