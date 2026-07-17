import type { PrototypeSchema } from "@/types/prototype-schema";

export function ListView({ schema }: { schema: PrototypeSchema }) {
  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b px-4 py-3 text-sm font-semibold">{schema.table.title}</div>
      <table className="w-full border-collapse text-xs">
        <thead className="bg-neutral-50 text-neutral-500">
          <tr>
            {schema.table.columns.map((column) => (
              <th key={column.key} className="border-b px-4 py-3 text-left font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schema.table.rows.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-50">
              {schema.table.columns.map((column) => (
                <td key={column.key} className="border-b px-4 py-3">
                  {String(row[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
