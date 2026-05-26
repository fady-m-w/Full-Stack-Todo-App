import type { TextareaHTMLAttributes } from "react";

type IProps = TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = ({ ...rest }: IProps) => {
  return (
    <textarea
      className="border border-gray-300 shadow-md focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-3 py-3 text-md w-full bg-transparent"
      rows={6}
      {...rest}
    />
  );
};

export default Textarea;
