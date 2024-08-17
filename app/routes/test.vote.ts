import Vote from "~/models/votes.model";
import { ActionFunctionArgs, json } from "@remix-run/node";

export async function loader() {
  const votes = await Vote.find().exec();

  return json({ votes });
}

export async function action({ request }: ActionFunctionArgs) {
  const vote = await Vote.create(Object.fromEntries(await request.formData()));

  return json({ vote });
}
