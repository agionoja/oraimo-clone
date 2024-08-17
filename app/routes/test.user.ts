import User from "~/models/user.model";
import { json } from "@remix-run/node";

export async function loader() {
  const users = await User.find();

  return json({ users });
}

export function action() {}
