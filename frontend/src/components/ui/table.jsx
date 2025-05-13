export default function Table({ headers, data }) {
  return (
    <table className="table-auto xl:table-fixed">
      <thead>
        <tr>
          {headers.map((label) => (
            <td className="font-bold">{label}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
          <td>Malcolm Lockyer</td>
          <td>1961</td>
        </tr>
        <tr>
          <td>Witchy Woman</td>
          <td>The Eagles</td>
          <td>1972</td>
        </tr>
        <tr>
          <td>Shining Star</td>
          <td>Earth, Wind, and Fire</td>
          <td>1975</td>
        </tr>


        {!data.length && (
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