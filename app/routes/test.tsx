import { Form, useActionData } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { createUser } from "~/services/user.server";
import React from "react";

export async function action({ request }: ActionFunctionArgs) {
  const res = await createUser(request);

  if ("user" in res) {
    const user = res.user;

    return json({ user });
  } else {
    return json(
      { message: res.error.message },
      { status: res.error.statusCode },
    );
  }
}

export default function Test() {
  const actionData = useActionData<typeof action>();
  return (
    <Form method="POST">
      <label>
        <span title={"tesing"}>First Name</span>
        <Input name="firstname" type="text" />
      </label>
      <label>
        <span>Last Name</span>
        <Input name="lastname" type="text" />
      </label>
      <label>
        <span>Email</span>
        <Input name="email" type="email" />
      </label>
      <label>
        <span>Password</span>
        <Input name="password" type="password" />
      </label>
      <label>
        <span>Password Confirmation</span>
        <Input name="passwordConfirm" type="password" />
      </label>
      <button type="submit">Submit</button>
      {actionData ? (
        <span className={"text-xs text-red-400"}>
          {"user" in actionData
            ? actionData.user.firstname
            : actionData.message}
        </span>
      ) : (
        ""
      )}
    </Form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"border-2 border-blue-600"} />;
}
