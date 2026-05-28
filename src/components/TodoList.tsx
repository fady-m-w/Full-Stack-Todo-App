import Button from "./ui/Button";
import type { ITodo } from "../interfaces";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import Modal from "./ui/Modal";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import api from "../config/axios.config";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TodoSkeleton from "./TodoSkeleton";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // ** STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const todoObj = {
    id: 0,
    documentId: "",
    title: "",
    Description: "",
  };
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(todoObj);
  const [originalTodo, setOriginalTodo] = useState<ITodo>(todoObj);

  const { isLoading, data } = useAuthenticatedQuery({
    queryKey: ["todoList"],
    url: "/users/me?populate=todos&status=published",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  const queryClient = useQueryClient();

  // **HANDLERS
  const onCloseEditModal = () => {
    setTodoToEdit(todoObj);
    setIsEditModalOpen(false);
  };
  const onOpenEditModal = (todo: ITodo) => {
    setIsEditModalOpen(true);
    setTodoToEdit(todo);
    setOriginalTodo(todo);
  };

  const openDeleteModal = (todo: ITodo) => {
    setIsDeleteModalOpen(true);
    setTodoToEdit(todo);
  };
  const closeDeleteModal = () => {
    setTodoToEdit(todoObj);
    setIsDeleteModalOpen(false);
  };

  const onChangeHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = evt.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onRemove = async () => {
    try {
      const { status } = await api.delete(`/todos/${todoToEdit.documentId}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if ([200, 202, 204].includes(status)) {
        closeDeleteModal();
        queryClient.invalidateQueries({ queryKey: ["todoList"] });
        toast.success("Todo deleted successfully", {
          duration: 2000,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fitcontet",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const trimmedTitle = todoToEdit.title.trim();
    const trimmedDescription = todoToEdit.Description.trim();

    if (
      trimmedTitle === originalTodo.title.trim() &&
      trimmedDescription === originalTodo.Description.trim()
    ) {
      toast.error("No changes were made", {
        duration: 2000,
        style: {
          backgroundColor: "black",
          color: "white",
          width: "fitcontet",
        },
      });
      return;
    }

    setIsUpdating(true);

    const { title, Description } = todoToEdit;

    try {
      const { status } = await api.put(
        `/todos/${todoToEdit.documentId}`,
        { data: { title, Description } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        },
      );

      if (status === 200) {
        onCloseEditModal();
        queryClient.invalidateQueries({ queryKey: ["todoList"] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1 p-3">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1">
      {data.todos.length ? (
        data.todos.map((todo: ITodo, idx: number) => {
          return (
            <div
              key={todo.id}
              className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
            >
              <p className="w-full font-semibold">
                {idx + 1} - {todo.title}
              </p>
              <div className="flex items-center justify-end w-full space-x-3">
                <Button size={"sm"} onClick={() => onOpenEditModal(todo)}>
                  Edit
                </Button>
                <Button
                  variant={"danger"}
                  size={"sm"}
                  onClick={() => openDeleteModal(todo)}
                >
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
        closeModel={onCloseEditModal}
        title="Edit This Todo"
      >
        <form className="space-y-3" onSubmit={submitHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeHandler}
          />
          <Textarea
            name="Description"
            value={todoToEdit.Description}
            onChange={onChangeHandler}
          />
          <div className="flex items-center space-x-3">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE TODO CONFIRM MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        closeModel={closeDeleteModal}
        title="Are you sure you want to delete this Todo?"
        description="Deleting this Todo will permanently remove it from your list along with all related data. Please confirm if you want to proceed."
      >
        <div className="flex items-center space-x-3">
          <Button variant={"danger"} onClick={onRemove}>
            Yes, Remove
          </Button>
          <Button type="button" variant={"cancel"} onClick={closeDeleteModal}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
