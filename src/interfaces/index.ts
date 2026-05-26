import type { name } from "../types/index";
export interface IRegisterInput {
  name: name;
  placeholder: string;
  type: string;
  validation: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
}
