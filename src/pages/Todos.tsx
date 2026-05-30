import Button from "../components/ui/Button";
import Paginator from "../components/ui/Paginator";
import useCustomQuery from "../hooks/useCustomQuery";

// Handlers
const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const { isLoading, data } = useCustomQuery({
    queryKey: ["paginatedTodos"],
    url: "/todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  if (isLoading)
    return (
      <div role="status" className="max-w-sm animate-pulse">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-90 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-82.5 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-75 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-90"></div>
      </div>
    );

  return (
    <div className="mb-10 space-y-6">
      <div className="w-fit mx-auto my-10">
        <Button size={"sm"} onClick={() => {}}>
          Generate todos
        </Button>
      </div>
      <div className="w-3xl mx-auto space-y-1">
        {data.data.length ? (
          data.data.map(
            ({ id, title }: { id: number; title: string }, idx: number) => {
              return (
                <div
                  key={id}
                  className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
                >
                  <h3 className="w-full font-semibold">
                    {idx + 1} - {title}
                  </h3>
                </div>
              );
            },
          )
        ) : (
          <h3>No Todos Yet!</h3>
        )}
      </div>
      <Paginator />
    </div>
  );
};

export default TodosPage;
