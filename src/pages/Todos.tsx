import Button from "../components/ui/Button";

// Handlers
const TodosPage = () => {
  return (
    <section className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <p className="text-lg">title</p>
        <div className="flex gap-2">
          <Button> Edit </Button>
          <Button> Cancel </Button>
        </div>
      </div>
    </section>
  );
};

export default TodosPage;
