import { useQuery } from "@tanstack/react-query";
import Button from "./ui/Button";
import api from "../config/axios.config";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data } = await api.get(
        "/users/me?populate=todos&status=published",
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        },
      );
      return data;
    },
  });

  if (isLoading) return <h3>Loading...</h3>;
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="space-y-1">
      {data.todos.map((todo) => {
        return (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-full font-semibold">1 - {todo.title}</p>
            <div className="flex items-center justify-end w-full space-x-3">
              <Button size={"sm"}>Edit</Button>
              <Button variant={"danger"} size={"sm"}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
