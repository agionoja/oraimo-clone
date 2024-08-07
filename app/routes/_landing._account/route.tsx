import { Outlet } from "@remix-run/react";

export default function Account() {
  return (
    <div>
      <h1>This is the User account</h1>
      <Outlet />
    </div>
  );
}
