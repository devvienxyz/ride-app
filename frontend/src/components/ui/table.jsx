
export default function Table({ resourceName, headers, data, rowRenderer }) {
  const isValidArray = Array.isArray(data);

  return (
    <table className="table-auto xl:table-fixed">
      <thead>
        <tr>
          {headers.map((label, labelIdx) => (
            <td key={`${resourceName}-table-label-${labelIdx}`} className="font-bold whitespace-nowrap">{label}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {isValidArray && data.map((rowData, rowIdx) => rowRenderer(rowData, rowIdx))}

        {!isValidArray || !data.length && (
          // TODO: spin when fetching
          // <tr><td colSpan="4"><Spinner /></td></tr>
          <tr>
            <td colSpan={headers.length}>Empty</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
