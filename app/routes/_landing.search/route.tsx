import { json, LoaderFunctionArgs } from "@remix-run/node";
import User from "~/models/user.model.server";
import { getAll } from "~/models/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  console.log(Object.fromEntries(searchParams));
  const query = Object.fromEntries(searchParams);
  const { key, value } = await getAll(query, User);

  return json({ [key]: value });
}
