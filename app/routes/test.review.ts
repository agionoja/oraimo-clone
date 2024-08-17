import { json, LoaderFunctionArgs } from "@remix-run/node";
import Review, { IReviewWithVote } from "~/models/review.model";

export async function loader() {
  const reviews = await Review.find<IReviewWithVote>();

  return json({ reviews });
}

export async function action({ request }: LoaderFunctionArgs) {
  const formObj = Object.fromEntries(await request.formData());

  const review = await Review.create(formObj);

  return json(review);
}
