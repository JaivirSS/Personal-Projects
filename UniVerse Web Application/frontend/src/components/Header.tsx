import { useNavigate, useRevalidator } from "react-router";
import NavButton from "./NavButton";
import NavButtonAction from "./NavButtonAction";
import { AuthHandler } from "../util/auth/auth";
import AnimatedButton from "./AnimatedButton";

export default function Header() {
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  //
  function handleLogout() {
    AuthHandler.clearTokens();
    revalidator.revalidate();
    navigate("/auth");
  }

  return (
    <div className="w-full grid grid-cols-10 items-center secondary p-5">
      {/* Logo Button */}
      <AnimatedButton
        onClick={() => navigate("/")}
        type="button"
        className="font-bold text-3xl secondary !bg-transparent !shadow-none"
      >
        UNIverse
      </AnimatedButton>

      <div className="col-span-9 flex justify-self-end space-x-4 items-center">
        <NavButton path="/search">
          <span className="text-2xl hover:text-3xl transition-all duration-200">
            🔍
          </span>
        </NavButton>
        {/* Chat Button */}
        <NavButton path="/chat">
          <span className="text-2xl hover:text-3xl transition-all duration-200">
            💬
          </span>
        </NavButton>

        {/* Profile Button */}
        <NavButton path="/profile">
          <span className="text-2xl hover:text-3xl transition-all duration-200">
            👤
          </span>
        </NavButton>

        {/* Logout Button */}
        <NavButtonAction
          onClick={handleLogout}
          className="text-xl hover:text-2xl transition-all duration-200 !bg-transparent secondary"
        >
          Logout
        </NavButtonAction>
      </div>
    </div>
  );
}

