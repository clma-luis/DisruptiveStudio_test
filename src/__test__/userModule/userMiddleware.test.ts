import RoleModel from "../../modules/role/roleModel";
import { validateRoleUser } from "../../modules/user/userMiddelwares";

jest.mock("../../modules/role/roleModel");

describe("validateRoleUser function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate role correctly", async () => {
    const mockRole = "USER_ROLE";
    const mockRoleModel = { role: mockRole };

    (RoleModel.findOne as jest.Mock).mockResolvedValue(mockRoleModel);

    await expect(validateRoleUser(mockRole)).resolves.toEqual(true);

    expect(RoleModel.findOne).toHaveBeenCalledWith({ role: mockRole });
  });

  it("should throw an error if role is avoided", async () => {
    const mockRole = "ADMIN_ROLE";
    const avoidRole = "ADMIN_ROLE";

    await expect(validateRoleUser(mockRole, avoidRole)).rejects.toThrow(`No puedes crear un usuario con el rol ${avoidRole}`);
  });

  it("should throw an error if role is empty", async () => {
    const mockRole = "";

    await expect(validateRoleUser(mockRole)).rejects.toThrow("El rol es requerido");
  });

  it("should throw an error if role does not exist in the database", async () => {
    const mockRole = "INVALID_ROLE";

    (RoleModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(validateRoleUser(mockRole)).rejects.toThrow("El rol no existe en la base de datos");
  });
});
