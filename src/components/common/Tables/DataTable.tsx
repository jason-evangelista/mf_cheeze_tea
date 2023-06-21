import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ReactNode } from 'react';
import Loading from '../Loading';

export type DataTableProps<ColumnShape> = {
  data?: ColumnShape[];
  columns: ColumnDef<ColumnShape, any>[];
  isLoading: boolean;
  actions?: ReactNode;
};

/**
 * @note create column outside
 */
function DataTable<ColumnShape>({
  data,
  columns,
  isLoading,
  actions,
}: DataTableProps<ColumnShape>) {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });
  return (
    <div>
      {actions}
      <table className="w-full border border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 border">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        {!isLoading && (
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 border-b">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {!isLoading && !data?.length && (
        <div className="text-sm font-semibold text-gray-700 flex justify-center items-center my-4">
          No product data.
        </div>
      )}
      {isLoading && <Loading label="Fetching product..." />}
    </div>
  );
}

export default DataTable;
