import React from "react";

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
      <thead className="bg-black">
        <tr>
          {columns.map((c) => (
            <th
              key={String(c.key)}
              className="px-3 py-2 text-yellow-500 text-left"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="bg-gray-900">
        {data.map((row, i) => (
          <tr key={i} className="border-t border-gray-800">
            {columns.map((col) => (
              <td
                key={String(col.key)}
                className="px-3 py-2 text-gray-300"
              >
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
