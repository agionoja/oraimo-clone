import { json, LoaderFunctionArgs } from "@remix-run/node";
import AppQueries from "~/utils/appQueries";
import User, { IUser } from "~/models/user.model";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams);

  const users = await new AppQueries<IUser>(query, User.find())
    .search("firstname lastname username")
    ?.query.lean()
    .exec();

  return json({ searchResult: users });
}

export default function Search() {
  const { searchResult } = useLoaderData<typeof loader>();

  return (
    <div>
      {searchResult ? (
        searchResult.length ? (
          <ul>
            {searchResult.map((el, i) => (
              <li key={i}>{el.email}</li>
            ))}
          </ul>
        ) : (
          "No result match your search"
        )
      ) : (
        <p>No Search Made</p>
      )}
    </div>
  );
}
