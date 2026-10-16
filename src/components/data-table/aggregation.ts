import type { Table } from "@tanstack/react-table";

export function getColumnAggregate<Row>(
  table: Table<Row>,
  columnId: string,
): unknown {
  const column = table.getColumn(columnId);
  const aggregate = column?.getAggregationFn();
  if (!aggregate) return undefined;
  const rows = table
    .getFilteredRowModel()
    .flatRows.filter((row) => !row.subRows.length);
  return aggregate(columnId, rows, rows);
}
