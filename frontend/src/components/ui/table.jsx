import { useState } from "react"
import { ChevronLeft, ChevronRight, MagnifyingGlass } from "@icons"
import { MultiSelectOnDropdown } from "./inputs"

function TableCell({ children, firstCell = false, addlClasses = "", ...props }) {
  const firstCellAddlClasses = "block font-semibold"

  return (
    <td className={`p-4 border-b border-slate-200 py-5 ${addlClasses}`} {...props}>
      <p className={`text-sm text-slate-800 ${firstCell ? firstCellAddlClasses : ""}`}>{children}</p>
    </td>
  )
}

function TableRow({ children, addlClasses = "", ...props }) {
  return (
    <tr className={`hover:bg-slate-50 ${addlClasses}`} {...props}>
      {children}
    </tr>
  )
}

function TableSearchBar({
  filterLabel,
  filterOptions,
  onMultiselectChange,
  onFilter,
  onSearchInputChange,
  searchBarCtx,
  ...props
}) {
  const { title, subTitle, searchPlaceholder } = searchBarCtx;

  const handleOnKeyUp = (e) => {
    if (e.key == "Enter") {
      onFilter()
    }
  }

  const handleOnChange = (e) => {
    onSearchInputChange(e.target.value || "")
  }

  const SearchBar = (
    <div className="ml-3 pr-3">
      <div className="w-full max-w-sm min-w-[200px] relative">
        <div className="relative">
          <input
            className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-blue-700 shadow-sm focus:shadow-md"
            placeholder={searchPlaceholder}
            onChange={handleOnChange}
            onKeyUp={handleOnKeyUp}
          />
          <button
            className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded"
            type="button"
            onClick={onFilter}
          >
            <MagnifyingGlass />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-center mb-3 mt-1 pl-3 gap-2">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm wrap">{subTitle}</p>
      </div>

      <div className="flex flex-col justify-center gap-2 align-center sm:flex-row">
        {/* dropdown for filter */}
        <div className="flex justify-center md:justify-end">
          <MultiSelectOnDropdown
            filterLabel={filterLabel}
            filterOptions={filterOptions}
            onMultiselectChange={onMultiselectChange} />
        </div>

        <div className="">
          {SearchBar}
        </div>
      </div>

    </div>
  )
}

function TableFooter({ count, next, previous, onPageChange }) {
  const limit = 10, offset = 0;
  const totalPages = Math.ceil(count / limit) || 1;
  const [currentPage, setCurrentPage] = useState(1)

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-t border-blue-50 bg-slate-50">
      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-950">
        Page {currentPage} of {totalPages}
      </p>

      {!(next === null && previous === null) && (
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="select-none rounded-lg border border-blue-950 py-2 px-4 text-xs font-bold uppercase transition-all hover:bg-blue-100 focus:ring focus:ring-gray-300 disabled:opacity-50"
            type="button">
            <ChevronLeft />
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="select-none rounded-lg border border-blue-950 py-2 px-4 text-xs font-bold uppercase transition-all hover:bg-blue-100 focus:ring focus:ring-gray-300 disabled:opacity-50"
            type="button">
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  )
}

function TableHeader({ children }) {
  return (
    <th className="p-4 border-b border-slate-300 bg-slate-50">
      <p className="block text-sm font-normal leading-none text-slate-500">
        {children}
      </p>
    </th>
  )
}

export default function Table({
  filterLabel,
  filterOptions,
  onMultiselectChange,
  onFilter,
  onSearchInputChange,
  onPageChange,
  searchBarCtx,
  resourceName,
  headers,
  paginationCtx,
  rowRenderer,
  emptyMsg = "Empty"
}) {
  const { count, previous, next, results } = paginationCtx;
  const isValidArray = Array.isArray(results);

  return (
    <div className="shadow-md bg-slate-50 border rounded-lg border-transparent pt-4">
      <TableSearchBar
        filterLabel={filterLabel}
        filterOptions={filterOptions}
        onMultiselectChange={onMultiselectChange}
        onFilter={onFilter}
        onSearchInputChange={onSearchInputChange}
        searchBarCtx={searchBarCtx}
      />

      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {headers.map((label, labelIdx) => (
                <TableHeader
                  key={`${resourceName}-table-label-${labelIdx}`}>
                  {label}
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>

            {isValidArray && results.map((rowData, rowIdx) => rowRenderer(rowData, rowIdx))}

            {!isValidArray || !count && (
              // TODO: spin when fetching
              // <tr><td colSpan="4"><Spinner /></td></tr>
              <TableRow>
                <TableCell addlClasses="text-center" colSpan={headers.length}>
                  {emptyMsg}
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </table>
      </div>

      <TableFooter
        count={count}
        previous={previous}
        next={next}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export { TableCell, TableRow }