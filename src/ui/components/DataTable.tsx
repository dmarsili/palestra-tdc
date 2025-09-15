import React from "react";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
};

export function DataTable<T>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-zinc-900/50">
          <tr>
            {columns.map((c) => (
              <th key={c.header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-zinc-900">
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((c) => (
                <td key={c.header} className="px-4 py-2 text-sm">
                  {c.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


