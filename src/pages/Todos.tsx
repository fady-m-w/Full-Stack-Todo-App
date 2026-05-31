import { useState, type ChangeEvent } from "react";
import Button from "../components/ui/Button";
import Paginator from "../components/ui/Paginator";
import useCustomQuery from "../hooks/useCustomQuery";
import api from "../config/axios.config";
import { faker } from "@faker-js/faker";

const TodosPage = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;

  // **STATES
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageSortBy, setPageSortBy] = useState<string>("DESC");

  const { isLoading, data, isFetching } = useCustomQuery({
    queryKey: [`todos-page-${page}`, `${pageSize}`, `${pageSortBy}`],
    url: `/todos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:${pageSortBy}`,
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ** HANDLERS
  const onClickPrev = () => {
    setPage((prev) => prev - 1);
  };

  const onClickNext = () => {
    setPage((prev) => prev + 1);
  };

  const onChangePageSize = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(+e.target.value);
  };

  const onChangeSortBy = (e: ChangeEvent<HTMLSelectElement>) => {
    setPageSortBy(e.target.value);
  };

  const onGenerateTodos = async () => {
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
  };

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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          onClick={onGenerateTodos}
          title="Generate 100 records"
        >
          Generate todos
        </Button>
        <div className="flex items-center justify-between space-x-2 text-md">
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSortBy}
            onChange={onChangeSortBy}
          >
            <option disabled>Sort by</option>
            <option value="ASC">Oldest</option>
            <option value="DESC">Latest</option>
          </select>
          <select
            className="border-2 border-indigo-600 rounded-md p-2"
            value={pageSize}
            onChange={onChangePageSize}
          >
            <option disabled>Page Size</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      <div className="my-10 space-y-1 max-w-2xl mx-auto">
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
          <h3>No Todos Yet</h3>
        )}
        <Paginator
          isLoading={isLoading || isFetching}
          total={data.meta.pagination.total}
          page={page}
          pageCount={data.meta.pagination.pageCount}
          onClickPrev={onClickPrev}
          onClickNext={onClickNext}
        />
      </div>
    </div>
  );
};

export default TodosPage;
