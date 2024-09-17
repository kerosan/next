import type { TablePaginationConfig } from "antd";

export const skip: (
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">,
) => number = (pagination) =>
  Number(pagination.pageSize) * Number(pagination.current) -
  Number(pagination.pageSize);
