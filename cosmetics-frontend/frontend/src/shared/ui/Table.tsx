export default function Table({ columns, rows }: any) {
  return (
    <table className="w-full border-collapse bg-black/30 border border-gray-700">
      <thead>
        <tr>
          {columns.map((c: string, i: number) => (
            <th key={i} className="border border-gray-700 px-3 py-2 text-left">
              {c}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row: any[], i: number) => (
          <tr key={i} className="border border-gray-700">
            {row.map((cell: any, j: number) => (
              <td key={j} className="px-3 py-2 border border-gray-700">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
