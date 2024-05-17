import UserModel from "../../modules/user/userModel";
import { UserService } from "../../modules/user/userService";

jest.mock("../../modules/user/userModel");

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all users", async () => {
    const mockUsers = [
      {
        _id: "1",
        name: "John Doe",
        role: "USER_ROLE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: "2",
        name: "Jane Doe",
        role: "ADMIN_ROLE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const mockResponse = {
      data: mockUsers.map((user) => ({
        id: user._id,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      page: 1,
      totalUsers: 2,
      totalPages: 1,
    };

    (UserModel.aggregate as jest.Mock).mockResolvedValue([
      {
        data: mockResponse.data,
        totalCount: [{ total: mockResponse.totalUsers }],
      },
    ]);

    const page = 1;
    const size = 10;
    const role = "USER_ROLE";

    const result = await userService.getAllUsers({ page, size, role });

    expect(result).toEqual(mockResponse);

    expect(UserModel.aggregate).toHaveBeenCalledWith([
      { $match: { deleted: 0, $or: [{ role: new RegExp(role, "i") }] } },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * size },
            { $limit: size },
            {
              $project: {
                id: "$_id",
                name: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
              },
            },
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);
  });
});
