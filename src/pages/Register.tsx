import InputErrorMsg from "../components/InputErrorMsg";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";

interface IFormInput {
  username: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) =>
    console.log("DATA", data);

  console.log(errors);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-3xl font-semibold text-center">
        Register to get access!
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            placeholder="Username"
            {...register("username", {
              required: true,
              minLength: 5,
            })}
          />

          {errors?.username && errors.username.type === "required" && (
            <InputErrorMsg msg="Username Is Required." />
          )}
          {errors?.username && errors.username.type === "minLength" && (
            <InputErrorMsg msg="Username Should Be At Least 5 Charactars." />
          )}
        </div>

        <div>
          <Input
            placeholder="Emaill address"
            {...register("email", {
              required: true,
              pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
            })}
          />

          {errors?.email && errors.email.type === "required" && (
            <InputErrorMsg msg="Email Is Required." />
          )}
          {errors?.email && errors.email.type === "pattern" && (
            <InputErrorMsg msg="Not Valid Email." />
          )}
        </div>

        <div>
          <Input
            placeholder="Password"
            {...register("password", { required: true, minLength: 6 })}
          />

          {errors?.password && errors.password.type === "required" && (
            <InputErrorMsg msg="Username Is Required." />
          )}
          {errors?.password && errors.password.type === "minLength" && (
            <InputErrorMsg msg="Password Should Be At Least 6 Charactars." />
          )}
        </div>

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
