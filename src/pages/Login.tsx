import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { loginSchema } from "../validation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import api from "../config/axios.config";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import type { IErrorResponse } from "../interfaces";
import { LOGIN_FORM } from "../data";
import InputErrorMsg from "../components/InputErrorMsg";
import { Link } from "react-router";

interface IFormInput {
  identifier: string;
  password: string;
}

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(loginSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const { status, data: resData } = await api.post("/auth/local", data);
      if (status === 200) {
        toast.success(
          "You will be redirected to the home page in 2 seconds after logging in.",
          {
            position: "bottom-center",
            duration: 1500,
            style: {
              backgroundColor: "black",
              color: "white",
              width: "fitcontet",
            },
          },
        );

        localStorage.setItem("loggedInUser", JSON.stringify(resData));
        setTimeout(() => {
          location.replace("/");
        }, 2000);
      }
    } catch (error) {
      const errorObj = error as AxiosError<IErrorResponse>;
      console.log();
      toast.error(`${errorObj.response?.data.error.message}`, {
        position: "bottom-center",
        duration: 1500,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fitcontet",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ** Renders
  const renderLoginForm = LOGIN_FORM.map(
    ({ name, placeholder, type, validation }, idx) => {
      return (
        <div key={idx}>
          <Input
            type={type}
            placeholder={placeholder}
            {...register(name, validation)}
          />

          {errors[name] && <InputErrorMsg msg={errors[name]?.message} />}
        </div>
      );
    },
  );

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Login to get access!
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderLoginForm}
        <Button fullWidth isLoading={isLoading}>
          Login
        </Button>

        <p className="text-center text-sm space-x-2">
          <span>Don't have an account yet?</span>
          <Link
            to={"/register"}
            className="underline text-indigo-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
