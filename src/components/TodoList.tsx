import Button from "./ui/Button";
import type { ITodo } from "../interfaces";
import useCustomQuery from "../hooks/useCustomQuery";
import Modal from "./ui/Modal";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import api from "../config/axios.config";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import TodoSkeleton from "./TodoSkeleton";
import { faker } from "@faker-js/faker";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList"],
    url: "/users/me?populate=todos&status=published",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });
  const queryClient = useQueryClient();
  // ** STATES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const todoEditObj = {
    id: 0,
    documentId: "",
    title: "",
    Description: "",
  };
  const todoAddObj = {
    title: "",
    Description: "",
  };
  const [todoToAdd, setTodoToAdd] = useState(todoAddObj);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>(todoEditObj);
  const [originalTodo, setOriginalTodo] = useState<ITodo>(todoEditObj);

  // **HANDLERS
  const onCloseAddModal = () => {
    setTodoToAdd(todoAddObj);
    setIsAddModalOpen(false);
  };
  const onOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const onCloseEditModal = () => {
    setTodoToEdit(todoEditObj);
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
    setTodoToEdit(todoEditObj);
    setIsDeleteModalOpen(false);
  };

  const onChangeAddHandler = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = evt.target;

    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
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

  const onGenerateTodo = async () => {
    for (let i = 0; i < 100; i++) {
      try {
        await api.post(
          `/todos`,
          {
            data: {
              title: faker.word.words(5),
              Description: faker.lorem.paragraph(),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${userData.jwt}`,
            },
          },
        );
      } catch (error) {
        console.log(error);
      }
    }
    queryClient.invalidateQueries({ queryKey: ["todoList"] });
  };

  const onSubmitRemoveTodo = async () => {
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

  const onSubmitAddTodo = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setIsUpdating(true);

    const { title, Description } = todoToAdd;

    try {
      const { status } = await api.post(
        `/todos`,
        { data: { title, Description, user: [userData.user.id] } },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        },
      );

      if (status === 200 || status === 201) {
        onCloseAddModal();
        queryClient.invalidateQueries({ queryKey: ["todoList"] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitUpdataTodo = async (evt: SubmitEvent<HTMLFormElement>) => {
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
      <div className="w-fit mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={onOpenAddModal}>
              Post A New Todo
            </Button>
            <Button onClick={onGenerateTodo} size={"sm"} variant={"outline"}>
              Generate Todos
            </Button>
          </div>
        )}
      </div>

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

      {/* ADD TODO MODAl */}
      <Modal
        isOpen={isAddModalOpen}
        closeModel={onCloseAddModal}
        title="Edit This Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitAddTodo}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddHandler}
          />
          <Textarea
            name="Description"
            value={todoToAdd.Description}
            onChange={onChangeAddHandler}
          />
          <div className="flex items-center space-x-3">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Done
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModal}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT TODO MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        closeModel={onCloseEditModal}
        title="Edit This Todo"
      >
        <form className="space-y-3" onSubmit={onSubmitUpdataTodo}>
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
          <Button variant={"danger"} onClick={onSubmitRemoveTodo}>
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
