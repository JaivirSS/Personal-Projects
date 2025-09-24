import { Outlet } from "react-router";
import { AuthHandler } from "../util/auth/auth";

export default function Root() {
  return(
    <>
      <Outlet />
        
    </>
  ) 
}

export async function loader(_: any) {
  // fetch login
  try {
    const accessToken = new AuthHandler().getAccessToken();
    return accessToken;
  } catch (error) {
    return null;
  }
}
