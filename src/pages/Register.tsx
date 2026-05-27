import InputErrorMsg from "../components/InputErrorMsg";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { REGISTER_FORM } from "../data";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation";
import api from "../config/axios.config";
import toast from "react-hot-toast";
import { useState } from "react";
import { AxiosError } from "axios";
import type { IErrorResponse } from "../interfaces";
import { Link } from "react-router";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(registerSchema),
  });

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);

    try {
      const { status } = await api.post("/auth/local/register", data);
      if (status === 200) {
        toast.success(
          "You will be redirected to the login page in 2 seconds to log in.",
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

        setTimeout(() => {
          location.replace("/login");
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
  const renderRegisterForm = REGISTER_FORM.map(
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
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {renderRegisterForm}

        <Button fullWidth isLoading={isLoading}>
          Register
        </Button>

        <p className="text-center text-sm space-x-2">
          <span>have an account?</span>
          <Link
            to={"/login"}
            className="underline text-indigo-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
