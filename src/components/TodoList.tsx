import Button from "./ui/Button";

const TodoList = () => {
  return (
    <div className="flex  justify-between items-center">
      <h1 className="text-lg">title</h1>
      <h1 className="text-lg">title</h1>
      <h1 className="text-lg">title</h1>
      <h1 className="text-lg">title</h1>
      <div className="flex gap-2">
        <Button> Edit </Button>
        <Button className="bg-red-800 "> Cancel </Button>
      </div>
    </div>
  );
};

export default TodoList;
