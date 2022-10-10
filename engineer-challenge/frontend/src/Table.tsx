import Badge from "./Badge";
import { useCallback, useEffect, useState } from "react";
import type { TableRow } from "./types/Table";

type TableProps = {
  isLoading?: boolean;
  onFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPage?: number;
  showSearchFilter?: boolean;
  tableData: TableRow[];
};

const Table = ({
  isLoading = false,
  onFilterChange,
  rowsPerPage = 2,
  showSearchFilter = false,
  tableData = [],
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [paginatedTableData, setPaginatedTableData] = useState<TableRow[]>([]);
  const [isPaginateForward, setIsPaginateForward] = useState(true);
  const [isPaginateBackward, setIsPaginateBackward] = useState(false);
  const paginateForward = useCallback(
    () => isPaginateForward && setCurrentPage(currentPage + 1),
    [currentPage, isPaginateForward]
  );
  const paginateBackwards = useCallback(
    () => isPaginateBackward && setCurrentPage(currentPage - 1),
    [isPaginateBackward, currentPage]
  );
  useEffect(() => {
    setTotalPages(Math.ceil(tableData.length / rowsPerPage));
    const startOfPaginationRow = currentPage * rowsPerPage;
    const endOfPaginationRow = currentPage * rowsPerPage + rowsPerPage;
    setPaginatedTableData(
      tableData.slice(
        startOfPaginationRow,
        endOfPaginationRow < tableData.length
          ? endOfPaginationRow
          : tableData.length
      )
    );
    setIsPaginateForward(currentPage < totalPages - 1);
    setIsPaginateBackward(currentPage > 0);
  }, [currentPage, tableData, totalPages, rowsPerPage]);
  useEffect(() => {
    setCurrentPage(0);
  }, [totalPages]);
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg shadow-sm">
            {isLoading && (
              <div className="flex items-center justify-center p-2 absolute right-10 ">
                <div className="w-4 h-4 border-b-2 border-gray-400 rounded-full animate-spin" />
              </div>
            )}
            {showSearchFilter && (
              <input
                type="text"
                onChange={onFilterChange}
                placeholder="Search..."
                className="mb-2 w-full p-2 border-2 bg-slate-400 rounded-lg"
              />
            )}

            <table className="min-w-full">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTableData.length > 0 ? (
                  paginatedTableData.map(
                    (
                      {
                        id,
                        insuranceType,
                        provider,
                        status: policyStatus,
                        customer,
                      },
                      index
                    ) => (
                      <tr className="border-b" key={id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {currentPage * rowsPerPage + index + 1}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {`${customer.firstName} ${customer.lastName}`}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {provider}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {insuranceType}
                        </td>
                        <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          <Badge status={policyStatus} />
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr className="border-b">
                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      No results...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="my-2 flex justify-center">
            <button
              className={`text-base font-medium mx-2 ${
                isPaginateBackward
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-300"
              }`}
              onClick={paginateBackwards}
              disabled={!isPaginateBackward}
            >
              Previous
            </button>
            {totalPages > 0 ? ` ${currentPage + 1} of ${totalPages} ` : " 0 "}
            <button
              className={`text-base font-medium mx-2 ${
                isPaginateForward
                  ? "text-gray-500 hover:text-gray-900"
                  : "text-gray-300"
              }`}
              onClick={paginateForward}
              disabled={!isPaginateForward}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
