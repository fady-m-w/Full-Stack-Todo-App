import Button from "./ui/Button";
import type { ITodo } from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { useState } from "react";
import Input from "./ui/Input";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todos"],
    url: "/users/me?populate=todos&status=published",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // **Handlers
  const onToggleEditModal = () => {
    setIsEditModalOpen((prev) => !prev);
  };

  if (isLoading) return <h3>Loading...</h3>;

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">1 - {todo.title}</p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button size={"sm"} onClick={onToggleEditModal}>
                  Edit
                </Button>
                <Button variant={"danger"} size={"sm"}>
                  Remove
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h3>No Todos Yet!</h3>
      )}
      {/* Edit Todo Modal */}
      <Modal
        isOpen={isEditModalOpen}
        closeModel={onToggleEditModal}
        title="Edit This Todo"
      >
        <Input value="EDIT TODO" />
        <div className="flex items-center space-x-3 mt-4">
          <Button className="bg-indigo-700 hover:bg-indigo-800">Update</Button>
          <Button variant={"cancel"} onClick={onToggleEditModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
