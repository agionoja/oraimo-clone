import { ActionFunctionArgs, json } from "@remix-run/node";
import * as factory from "~/services/factory";
import Review from "~/models/review.model";

export async function loader() {
  const result = await factory.findById("66bd53a785326e6f4ec3d5ae", Review);

  console.log(result);

  return result.error
    ? json(
        { users: null, error: result.error },
        { status: result.error.statusCode },
      )
    : json({ users: result.data, error: null });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = request.formData();
  // const result = await factory.createOne(formData, Review);

  const review = await Review.findByIdAndUpdate(
    "66bd53a785326e6f4ec3d5ae",
    Object.fromEntries(await formData),
  );
  return json({ review, formData: Object.fromEntries(await formData) });

  // console.log(result);
  //
  // return result.error
  //   ? json(
  //       { user: null, error: result.error },
  //       { status: result.error.statusCode },
  //     )
  //   : json({ data: result.data, error: null });
}

// export default function Test() {
//   const actionData = useActionData<typeof action>();
//   const loaderData = useLoaderData<typeof loader>();
//
//   return (
//     <Form method="POST">
//       <label>
//         <span title={"tesing"}>First Name</span>
//         <Input name="rating" type="number" />
//       </label>
//       <label>
//         <span>Last Name</span>
//         <Input name="review" type="text" />
//       </label>
//       <label>
//         <span>Email</span>
//         <Input name="user" type="text" />
//       </label>
//       <label>
//         <span>Password</span>
//         <Input name="product" type="text" />
//       </label>
//       <label>
//         <span>Password Confirmation</span>
//         <Input name="passwordConfirm" type="password" />
//       </label>
//       <label>
//         <span>Password Confirmation</span>
//         <Input name="file" type="file" />
//       </label>
//       <button type="submit">Submit</button>
//     </Form>
//   );
// }

// function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
//   return <input {...props} className={"border-2 border-blue-600"} />;
// }
