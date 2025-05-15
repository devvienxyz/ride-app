import { useState } from "react";

function TableCellText({ children, addlClasses = "", ...props }) {
  return (
    <p className="text-sm text-slate-800">{children}</p>
  )
}


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

function TableSearchBar({ searchBarCtx, ...props }) {
  const { title, subTitle, searchPlaceholder } = searchBarCtx;

  return (
    <div className="w-full flex justify-between items-center mb-3 mt-1 pl-3">
      <div>
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-slate-500 text-sm wrap">{subTitle}</p>
      </div>
      <div className="ml-3 pr-3">
        <div className="w-full max-w-sm min-w-[200px] relative">
          <div className="relative">
            <input
              className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-blue-700 shadow-sm focus:shadow-md"
              placeholder={searchPlaceholder}
            />
            <button
              className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-8 h-8 text-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TableFooter({ paginationCtx }) {
  const { count, next, previous, results } = paginationCtx;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePreviousPage = () => {
    console.log("prev page")
  }
  const handleNextPage = () => {
    console.log("next page")
  }

  return (
    <div className="flex items-center justify-between p-4 border-t border-blue-50 bg-slate-50">
      <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-950">
        Page {currentPage} of {totalPages}
      </p>

      {!(next === null && previous === null) && (
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            className="select-none rounded-lg border border-blue-950 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button">
            Previous
          </button>
          <button
            onClick={handleNextPage}
            className="select-none rounded-lg border border-blue-950 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button">
            Next
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

export default function Table({ searchBarCtx, resourceName, headers, paginationCtx, rowRenderer, emptyMsg = "Empty" }) {
  const { count, next, previous, results } = paginationCtx;
  const isValidArray = Array.isArray(results);


  return (
    <div className="shadow-md bg-slate-50 border rounded-lg border-transparent pt-4">
      <TableSearchBar searchBarCtx={searchBarCtx} />

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
                <TableCell>
                  {emptyMsg}
                </TableCell>
              </TableRow>
            )}
          </tbody>

        </table>
      </div>
      <TableFooter paginationCtx={paginationCtx} />
    </div>
  )
}

export { TableCell, TableRow }