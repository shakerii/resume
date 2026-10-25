"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  type GroupingState,
  type Row as TableDataRow,
  type SortingState,
} from "@tanstack/react-table";
import { Maximize2, Minimize2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getColumnAggregate } from "./aggregation";
import { useLocale, useTranslations } from "next-intl";

export { getColumnAggregate } from "./aggregation";

export type DataTableLabels = {
  search: string;
  searchPlaceholder: string;
  filterColumn: string;
  minimum: string;
  maximum: string;
  groupBy: string;
  clearGrouping: string;
  expandAll: string;
  collapseAll: string;
  clearFilters: string;
  noResults: string;
  previous: string;
  next: string;
  firstPage: string;
  lastPage: string;
  rowsPerPage: string;
  page: string;
  of: string;
  rows: string;
  totals: string;
  sortAscending: string;
  sortDescending: string;
  unsorted: string;
  expandGroup: string;
  collapseGroup: string;
  multiSortHint: string;
  fullscreen: string;
  exitFullscreen: string;
};

export interface DataTableProps<Row> {
  title: string;
  tableId: string;
  data: Row[];
  columns: ColumnDef<Row>[];
  initialSort?: SortingState;
  initialGrouping?: GroupingState;
  initialPageSize?: number;
  labels?: Partial<DataTableLabels>;
}

function columnLabel<Row>(column: Column<Row>) {
  return typeof column.columnDef.header === "string"
    ? column.columnDef.header
    : column.id;
}

function renderAggregate(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function columnFilter<Row>(
  row: TableDataRow<Row>,
  columnId: string,
  filterValue: unknown,
) {
  const value = row.getValue<unknown>(columnId);
  if (Array.isArray(filterValue)) {
    if (typeof value !== "number") return false;
    const [minimum, maximum] = filterValue as [
      number | undefined,
      number | undefined,
    ];
    return (
      (minimum === undefined || value >= minimum) &&
      (maximum === undefined || value <= maximum)
    );
  }
  return String(value ?? "")
    .toLowerCase()
    .includes(String(filterValue ?? "").toLowerCase());
}

columnFilter.autoRemove = (value: unknown) =>
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.every((bound) => bound === undefined));

export function DataTable<Row>({
  title,
  tableId,
  data,
  columns,
  initialSort = [],
  initialGrouping = [],
  initialPageSize = 10,
  labels: overrides,
}: DataTableProps<Row>) {
  const tableTranslations = useTranslations("dataTable");
  const locale = useLocale();
  const [fullscreen, setFullscreen] = useState(false);
  const fullscreenButton = useRef<HTMLButtonElement>(null);
  const labels = useMemo<DataTableLabels>(
    () => ({
      search: tableTranslations("search"),
      searchPlaceholder: tableTranslations("searchPlaceholder"),
      filterColumn: tableTranslations("filterColumn"),
      minimum: tableTranslations("minimum"),
      maximum: tableTranslations("maximum"),
      groupBy: tableTranslations("groupBy"),
      clearGrouping: tableTranslations("clearGrouping"),
      expandAll: tableTranslations("expandAll"),
      collapseAll: tableTranslations("collapseAll"),
      clearFilters: tableTranslations("clearFilters"),
      noResults: tableTranslations("noResults"),
      previous: tableTranslations("previous"),
      next: tableTranslations("next"),
      firstPage: tableTranslations("firstPage"),
      lastPage: tableTranslations("lastPage"),
      rowsPerPage: tableTranslations("rowsPerPage"),
      page: tableTranslations("page"),
      of: tableTranslations("of"),
      rows: tableTranslations("rows"),
      totals: tableTranslations("totals"),
      sortAscending: tableTranslations("sortAscending"),
      sortDescending: tableTranslations("sortDescending"),
      unsorted: tableTranslations("unsorted"),
      expandGroup: tableTranslations("expandGroup"),
      collapseGroup: tableTranslations("collapseGroup"),
      multiSortHint: tableTranslations("multiSortHint"),
      fullscreen: tableTranslations("fullscreen"),
      exitFullscreen: tableTranslations("exitFullscreen"),
      ...overrides,
    }),
    [tableTranslations, overrides],
  );
  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [grouping, setGrouping] = useState<GroupingState>(initialGrouping);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const table = useReactTable<Row>({
    data,
    columns,
    defaultColumn: { aggregationFn: undefined, filterFn: columnFilter },
    state: { sorting, columnFilters, globalFilter, grouping, expanded },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onGroupingChange: (updater) => {
      setGrouping(updater);
      setExpanded({});
    },
    onExpandedChange: setExpanded,
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) => Boolean(column.accessorFn),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    initialState: { pagination: { pageSize: Math.max(1, initialPageSize) } },
  });
  const pageSize = table.getState().pagination.pageSize;
  const pageSizes = [...new Set([10, 25, 50, 100, pageSize])].sort(
    (left, right) => left - right,
  );
  const hasFooter = table
    .getAllLeafColumns()
    .some((column) => column.columnDef.footer || column.getAggregationFn());

  const content = (
    <Card
      className={
        fullscreen ? "min-h-full rounded-none border-0 shadow-none" : undefined
      }
    >
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle id={`${tableId}-heading`}>{title}</CardTitle>
          <Button
            ref={fullscreenButton}
            type="button"
            size="sm"
            variant="outline"
            aria-label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
            aria-expanded={fullscreen}
            aria-haspopup="dialog"
            onClick={() => setFullscreen((current) => !current)}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" aria-hidden />
            ) : (
              <Maximize2 className="h-4 w-4" aria-hidden />
            )}
            {fullscreen ? labels.exitFullscreen : labels.fullscreen}
          </Button>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-sm space-y-1">
            <Label htmlFor={`${tableId}-search`}>{labels.search}</Label>
            <Input
              id={`${tableId}-search`}
              type="search"
              className="h-8 px-2.5 py-1 text-xs"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={labels.searchPlaceholder}
            />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!globalFilter && !columnFilters.length}
            onClick={() => {
              setGlobalFilter("");
              setColumnFilters([]);
            }}
          >
            {labels.clearFilters}
          </Button>
        </div>
        {table.getAllLeafColumns().some((column) => column.getCanGroup()) && (
          <fieldset className="flex flex-wrap items-center gap-3 rounded-md border p-3">
            <legend className="px-1 text-sm font-medium">
              {labels.groupBy}
            </legend>
            {table
              .getAllLeafColumns()
              .filter((column) => column.getCanGroup())
              .map((column) => (
                <label
                  key={column.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={column.getIsGrouped()}
                    onChange={column.getToggleGroupingHandler()}
                    className="h-4 w-4 accent-primary"
                  />
                  {columnLabel(column)}
                  {column.getIsGrouped()
                    ? ` (${column.getGroupedIndex() + 1})`
                    : ""}
                </label>
              ))}
            {grouping.length > 0 && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => table.setGrouping([])}
                >
                  {labels.clearGrouping}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => table.toggleAllRowsExpanded(true)}
                >
                  {labels.expandAll}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => table.toggleAllRowsExpanded(false)}
                >
                  {labels.collapseAll}
                </Button>
              </>
            )}
          </fieldset>
        )}
        <p
          id={`${tableId}-sort-hint`}
          className="text-xs text-muted-foreground"
        >
          {labels.multiSortHint}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border">
          <Table
            aria-labelledby={`${tableId}-heading`}
            aria-describedby={`${tableId}-sort-hint`}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const column = header.column;
                    const sorted = column.getIsSorted();
                    const numeric =
                      typeof table
                        .getCoreRowModel()
                        .flatRows.map((row) => row.getValue<unknown>(column.id))
                        .find(
                          (value) => value !== null && value !== undefined,
                        ) === "number";
                    const range = (column.getFilterValue() ?? []) as [
                      number | undefined,
                      number | undefined,
                    ];
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        scope="col"
                        aria-sort={
                          column.getCanSort()
                            ? sorted === "asc"
                              ? "ascending"
                              : sorted === "desc"
                                ? "descending"
                                : "none"
                            : undefined
                        }
                        className="h-auto min-w-36 py-3 align-top"
                      >
                        {!header.isPlaceholder && (
                          <div className="space-y-2">
                            {column.getCanSort() ? (
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                title={
                                  sorted === "asc"
                                    ? labels.sortAscending
                                    : sorted === "desc"
                                      ? labels.sortDescending
                                      : labels.unsorted
                                }
                                onClick={column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  column.columnDef.header,
                                  header.getContext(),
                                )}
                                <span aria-hidden="true">
                                  {sorted === "asc"
                                    ? "↑"
                                    : sorted === "desc"
                                      ? "↓"
                                      : "↕"}
                                  {sorting.length > 1 && sorted
                                    ? column.getSortIndex() + 1
                                    : ""}
                                </span>
                              </button>
                            ) : (
                              flexRender(
                                column.columnDef.header,
                                header.getContext(),
                              )
                            )}
                            {header.subHeaders.length === 0 &&
                              column.getCanFilter() &&
                              (numeric ? (
                                <div className="flex gap-1">
                                  <Input
                                    type="number"
                                    className="h-7 min-w-16 px-2 py-1 text-xs"
                                    aria-label={`${labels.minimum}: ${columnLabel(column)}`}
                                    placeholder={labels.minimum}
                                    value={range[0] ?? ""}
                                    onChange={(event) =>
                                      column.setFilterValue([
                                        event.target.value === ""
                                          ? undefined
                                          : event.target.valueAsNumber,
                                        range[1],
                                      ])
                                    }
                                  />
                                  <Input
                                    type="number"
                                    className="h-7 min-w-16 px-2 py-1 text-xs"
                                    aria-label={`${labels.maximum}: ${columnLabel(column)}`}
                                    placeholder={labels.maximum}
                                    value={range[1] ?? ""}
                                    onChange={(event) =>
                                      column.setFilterValue([
                                        range[0],
                                        event.target.value === ""
                                          ? undefined
                                          : event.target.valueAsNumber,
                                      ])
                                    }
                                  />
                                </div>
                              ) : (
                                <Input
                                  className="h-7 px-2 py-1 text-xs"
                                  type="search"
                                  aria-label={`${labels.filterColumn}: ${columnLabel(column)}`}
                                  placeholder={labels.filterColumn}
                                  value={String(column.getFilterValue() ?? "")}
                                  onChange={(event) =>
                                    column.setFilterValue(event.target.value)
                                  }
                                />
                              ))}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={
                      row.getIsGrouped() ? "bg-muted/40 font-medium" : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-xs [overflow-wrap:anywhere]"
                      >
                        {cell.getIsGrouped() ? (
                          <button
                            type="button"
                            aria-expanded={row.getIsExpanded()}
                            aria-label={`${row.getIsExpanded() ? labels.collapseGroup : labels.expandGroup}: ${String(cell.getValue() ?? "")}`}
                            onClick={row.getToggleExpandedHandler()}
                            className="inline-flex items-center gap-2 rounded text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            style={{ paddingInlineStart: `${row.depth}rem` }}
                          >
                            <span aria-hidden="true">
                              {row.getIsExpanded() ? "−" : "+"}
                            </span>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                            <span className="text-muted-foreground">
                              (
                              {
                                row
                                  .getLeafRows()
                                  .filter((leaf) => !leaf.subRows.length).length
                              }
                              )
                            </span>
                          </button>
                        ) : cell.getIsAggregated() ? (
                          cell.column.getAggregationFn() ? (
                            flexRender(
                              cell.column.columnDef.aggregatedCell ??
                                cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : null
                        ) : cell.getIsPlaceholder() ? null : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {labels.noResults}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {hasFooter && (
              <TableFooter>
                {table.getFooterGroups().map((footerGroup) => (
                  <TableRow key={footerGroup.id}>
                    {footerGroup.headers.map((header, index) => (
                      <TableCell key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.footer
                            ? flexRender(
                                header.column.columnDef.footer,
                                header.getContext(),
                              )
                            : header.column.getAggregationFn()
                              ? renderAggregate(
                                  getColumnAggregate(table, header.column.id),
                                )
                              : index === 0
                                ? labels.totals
                                : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            )}
          </Table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {labels.page} {table.getState().pagination.pageIndex + 1}{" "}
            {labels.of} {Math.max(1, table.getPageCount())} ·{" "}
            {table.getFilteredRowModel().rows.length} {labels.rows}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Label htmlFor={`${tableId}-page-size`}>{labels.rowsPerPage}</Label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger
                id={`${tableId}-page-size`}
                className="h-8 w-20 text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizes.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={labels.firstPage}
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {labels.previous}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {labels.next}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={labels.lastPage}
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              »
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={fullscreen} onOpenChange={setFullscreen}>
      {fullscreen ? (
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          dir={locale === "fa" ? "rtl" : "ltr"}
          className={`inset-0 left-0 top-0 block h-dvh max-h-none w-full max-w-none translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-none outline-none ${locale === "fa" ? "font-vazir" : "font-inter"}`}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            fullscreenButton.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            window.requestAnimationFrame(() =>
              fullscreenButton.current?.focus(),
            );
          }}
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {content}
        </DialogContent>
      ) : (
        content
      )}
    </Dialog>
  );
}
