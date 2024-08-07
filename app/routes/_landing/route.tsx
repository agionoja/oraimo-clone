import { Outlet } from "@remix-run/react";

export default function Landing() {
  return (
    <div>
      <h1>This is the landing</h1>
      <Outlet />
    </div>
  );
}
