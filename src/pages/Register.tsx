import InputErrorMsg from "../components/InputErrorMsg";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { REGISTER_FORM } from "../data";

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

  // ** Handlers
  const onSubmit: SubmitHandler<IFormInput> = (data) =>
    console.log("DATA", data);

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

        <Button fullWidth>Register</Button>
      </form>
    </div>
  );
};

export default RegisterPage;
