import User, { IUser } from "~/models/user.model.server";
import globalError from "~/utils/globalError";
import AppQueries from "~/utils/appQueries";

type ErrorResponse = { message: string; statusCode: number };

export async function createUser(
  request: Request,
): Promise<{ user: IUser } | { error: ErrorResponse }> {
  try {
    const { password, passwordConfirm, firstname, lastname, email } =
      Object.fromEntries(await request.formData());

    return {
      user: await User.create({
        password,
        passwordConfirm,
        firstname,
        lastname,
        email,
      }),
    };
  } catch (err) {
    const error = globalError(err as Error);
    return { error: { message: error.message, statusCode: error.statusCode } };
  }
}

export async function getUsers(request: Request): Promise<IUser[]> {
  const { searchParams } = new URL(request.url);
  const users = await new AppQueries(
    Object.fromEntries(searchParams),
    User.find(),
  )
    .filter()
    .sort()
    .limitFields()
    .paginate().mongooseQuery;

  return users ? users : [];
}
