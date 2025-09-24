import { Navigate, Outlet, useRouteLoaderData } from "react-router";
import Header from "../components/Header";

export default function Protected() {
  const accessToken = useRouteLoaderData("root");
  console.log(accessToken);
  return accessToken ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to={"/auth"} replace />
  );
}
