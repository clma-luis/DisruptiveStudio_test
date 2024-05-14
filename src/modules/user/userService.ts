import UserModel, { UserSchema } from "./userModel";

export class UserService {
  private userNotDeleted: number;
  constructor() {
    this.userNotDeleted = 0;
  }

  async createUser(data: any): Promise<UserSchema> {
    const menuItem = new UserModel({ ...data });
    const result = await menuItem.save();
    return result;
  }

  async getAllUsers({ page, size, role }: { page: number; size: number; role: string }) {
    const skip = (page - 1) * size;
    const roleRegex = new RegExp(role, "i");
    const response = await UserModel.aggregate([
      { $match: { deleted: this.userNotDeleted, $or: [{ role: roleRegex }] } },
      {
        $facet: {
          data: [
            { $skip: skip },
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

    const { data, totalCount } = response[0];
    const totalPages = Math.ceil(totalCount[0].total / size);

    const result = {
      data,
      page,
      totalUsers: totalCount[0].total,
      totalPages,
    };

    return result;
  }

  async getOneUser(id: string): Promise<UserSchema> {
    const result = (await UserModel.findOne({ _id: id }).exec()) as UserSchema;

    return result;
  }

  async updateUser(id: string, data: UserSchema): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, data, { new: true }).exec()) as UserSchema;
    return result;
  }

  async changeUserPassword(id: string, password: string): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, { password }, { new: true }).exec()) as UserSchema;
    return result;
  }

  async changeUserEmail(id: string, email: string): Promise<UserSchema> {
    const result = (await UserModel.findOneAndUpdate({ _id: id }, { email }, { new: true }).exec()) as UserSchema;
    return result;
  }

  async removeUser(id: string): Promise<string> {
    (await UserModel.findOneAndUpdate({ _id: id }, { deleted: 1 }, { new: true }).exec()) as UserSchema;
    return "User deleted successfully";
  }
}

export const userService = new UserService();
