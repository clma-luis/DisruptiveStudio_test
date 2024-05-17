import { Request, Response } from "express";
import { TopicController } from "../../modules/topic/topicController";
import { topicService } from "../../modules/topic/topicService";

jest.mock("../../modules/topic/topicService");

describe("Topic Controller", () => {
  let topicController: TopicController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    topicController = new TopicController();
    req = {
      params: { id: "testId" },
      body: { title: "Test Topic", newCategories: ["Category1", "Category2"], allowedContentdata: {} },
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTopic", () => {
    it("should create a new topic", async () => {
      const mockResult = { _id: "testId", title: "Test Topic", categories: ["Category1", "Category2"] };
      (topicService.createTopic as jest.Mock).mockResolvedValue(mockResult);

      await topicController.createTopic(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "Topic created successfully", result: mockResult });
    });

    it("should handle internal server error", async () => {
      (topicService.createTopic as jest.Mock).mockRejectedValue(new Error("Database connection error"));

      await topicController.createTopic(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "An error occurred while creating the topic" });
    });
  });

  // Similar tests for other methods in TopicController...
});
