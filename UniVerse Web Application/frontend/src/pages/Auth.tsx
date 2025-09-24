import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Input from "../components/Input";
import AnimatedButton from "../components/AnimatedButton";
import { fetchLogin, fetchRegister } from "../http/auth/auth";
import { AuthHandler } from "../util/auth/auth";
import { HTTPResponse } from "../http/http";
import { useNavigate, useRevalidator, useRouteLoaderData } from "react-router";
import StarCanvas from "../components/StarCanvas";

interface formDataI {
  [key: string]: formElementI;
  username: formElementI;
  email: formElementI;
  password: formElementI;
}

interface formElementI {
  value: string;
  error?: string;
}

export default function Auth() {
  const [form, setForm] = useState<formDataI>({
    username: { value: "" },
    email: { value: "" },
    password: { value: "" },
  });
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const accessToken = useRouteLoaderData("root");
  const revalidator = useRevalidator();

  useEffect(() => {
    try {
      if (accessToken) {
        navigate("/");
      }
    } catch (error) {}
  }, []);

  function validate() {
    let valid = true;
    let emailError = undefined;
    let passwordError = undefined;
    let usernameError = undefined;
    if (form.username.value == "" && !isLogin) {
      usernameError = "Invalid username";
      valid = false;
    }
    if (form.email.value == "") {
      emailError = "Invalid email";
      valid = false;
    }
    if (form.password.value == "") {
      passwordError = "Invalid password";
      valid = false;
    }
    if (form.password.error != passwordError) {
      setForm((prev) => {
        return {
          ...prev,
          password: { value: prev.password.value, error: passwordError },
        };
      });
    }
    if (form.email.error != emailError) {
      setForm((prev) => {
        return {
          ...prev,
          email: { value: prev.email.value, error: emailError },
        };
      });
    }
    if (form.username.error != usernameError && !isLogin) {
      setForm((prev) => {
        return {
          ...prev,
          username: { value: prev.username.value, error: usernameError },
        };
      });
    }
    return valid;
  }

  function handleChangeForm(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name;
    const value = event.target.value ?? "";
    setForm((prev) => {
      return {
        ...prev,
        [fieldName]: { value: value, error: prev[fieldName].error },
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      setLoading(true);
      if (isLogin) {
        const response = await fetchLogin({
          email: form.email.value,
          password: form.password.value,
        });
        AuthHandler.saveTokens(response.accessToken, response.refreshToken);
        console.log("b4", response.accessToken);
        console.log("update", new AuthHandler().getAccessToken());
      } else {
        const response = await fetchRegister({
          username: form.username.value,
          email: form.email.value,
          password: form.password.value,
        });
        AuthHandler.saveTokens(response.accessToken, response.refreshToken);
      }
    } catch (error) {
      if (error instanceof HTTPResponse) {
        if (error.getCode() == 404) {
          alert("User does not exist");
        } else if (error.getCode() == 409) {
          alert("User already exists");
        } else if (error.getCode() == 401 && isLogin) {
          alert("Incorrect password");
        }
      } else {
        alert("Whoops! Something went wrong");
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    revalidator.revalidate();
    navigate("/");
  }

  function handleToggleType() {
    setIsLogin((prev) => !prev);
  }

  return (
    <div>
      <StarCanvas className="w-screen h-full primary flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="secondary rounded-2xl p-8 w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] xl:w-[30%] shadow-2xl"
        >
          {/* Form Title */}
          <label className="tertiary text-4xl font-bold secondary w-full text-center block mb-8">
            UNIVerse
          </label>

          {/* Form Fields */}
          <div className="flex flex-col gap-10">
            {!isLogin && (
              <Input
                name="username"
                label="Username"
                value={form.username.value}
                onChange={handleChangeForm}
                error={form.username.error}
              />
            )}

            <Input
              name="email"
              label="Email"
              value={form.email.value}
              onChange={handleChangeForm}
              error={form.email.error}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              value={form.password.value}
              onChange={handleChangeForm}
              error={form.password.error}
            />

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <AnimatedButton
                border
                className="py-1"
                type="submit"
                loading={loading}
              >
                {isLogin ? "Login" : "Register"}
              </AnimatedButton>

              <AnimatedButton
                className="text-xs ml-auto"
                type="button"
                onClick={handleToggleType}
              >
                {isLogin ? "Sign-Up?" : "Already Have an Account?"}
              </AnimatedButton>
            </div>
          </div>
        </form>
      </StarCanvas>
    </div>
  );
}
