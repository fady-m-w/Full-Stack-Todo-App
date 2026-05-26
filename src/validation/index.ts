import * as yup from "yup";
export const registerSchema = yup
  .object({
    username: yup
      .string()
      .required("Username Is Required!")
      .min(5, "Username Should Be At Least 5 Charcters"),
    email: yup
      .string()
      .required("Email Is Required!")
      .matches(/^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/, "Not A Valid Email Address!"),
    password: yup
      .string()
      .required("Password Is Required!")
      .min(6, "Password Should Be At Least 6 Charcters!"),
  })
  .required();
