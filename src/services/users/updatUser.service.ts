import { IUser, IUserUpdate } from "../../interfaces/users/index";
import { User } from "../../entities/user.entity";
import { userUpdate, userWithoutPassword } from "../../serializers/user.serializer";
import { AppError } from "../../errors/AppError";
import { AppDataSource } from "../../data-source";

const updateUserService = async (
  userData: IUserUpdate,
  userId: number
): Promise<IUser> => {
  if (Object.keys(userData).includes("id")) {
    throw new AppError("id field cannot be changed", 403);
  }
  const userRepository = AppDataSource.getRepository(User);
  const findUser = await userRepository.findOneBy({ id: userId });

  if (findUser === null) {
    throw new AppError("Invalid id", 404);
  }

  try {
    await userUpdate.validate(userData, {
      stripUnknown: true,
      abortEarly: false,
    });
  } catch (err) {
    throw new AppError(err.errors);
  }

  const updatedUser = userRepository.create({
    ...findUser,
    ...userData,
  });
  await userRepository.save(updatedUser);

  const updatedUserWithoutPassword = await userWithoutPassword.validate(
    updatedUser,
    {
      stripUnknown: true,
    }
  );

  return updatedUserWithoutPassword;
};

export default updateUserService;
