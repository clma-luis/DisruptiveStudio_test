import CategoryModel from "../../modules/category/categoryModel";
import { CategoryService } from "../../modules/category/categoryService";

jest.mock("../../modules/category/categoryModel");

describe("CategoryService", () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get one category by id", async () => {
    const categoryId = "123";
    const mockedCategory = {
      name: "Test Category",
    };

    (CategoryModel.findOne as jest.Mock).mockResolvedValue(mockedCategory);

    const result = await categoryService.getOneCategory(categoryId);

    expect(result).toEqual(mockedCategory);
    expect(CategoryModel.findOne).toHaveBeenCalledWith({ _id: categoryId });
  });
});
