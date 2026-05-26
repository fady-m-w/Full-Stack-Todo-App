interface Iprops {
  msg?: string;
}

const ErrorMassage = ({ msg }: Iprops) => {
  return msg ? <span className="text-red-700 block ">{msg}</span> : null;
};

export default ErrorMassage;
