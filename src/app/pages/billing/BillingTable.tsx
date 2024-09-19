"use client";

import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Table,
  type TablePaginationConfig,
  Typography,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRef, type FC } from "react";
import { useLocalState } from "@/utils/useLocalState";
import { useQuery } from "@apollo/client";
import { BillingModal } from "./BillingModal";
import type { Billing, BillingPageResult } from "@/graphql/resolvers-types";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import { GET_BILLING_PAGE } from "./query";
import dayjs from "dayjs";
import type { onCreate, onDelete, onUpdate } from "./action";

type State = {
  open: boolean;
  current?: Billing;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const BillingTable: FC<{
  onCreate: typeof onCreate;
  onUpdate: typeof onUpdate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);

  useKey("+", () => {
    addRef.current?.click();
  });

  const [state, setState] = useLocalState<State>({
    open: false,
    current: undefined,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data, error, refetch, fetchMore } = useQuery<{
    billing: BillingPageResult;
  }>(GET_BILLING_PAGE, {
    variables: {
      take: state.pagination.pageSize,
      skip: skip(state.pagination),
    },
  });

  if (error) {
    throw error;
  }

  const columns: TableColumnsType = [
    {
      key: 0,
      title: "id",
      dataIndex: "id",
    },
    {
      key: 1,
      title: "User",
      dataIndex: "user.name",
    },
    {
      key: 3,
      title: "Date",
      dataIndex: "date",
      render: (_, row) => {
        return dayjs(row.startDate).isValid()
          ? dayjs(row.startDate).format("DD-MMM-YYYY")
          : "";
      },
    },
    {
      key: 4,
      title: "Payment",
      dataIndex: "payment",
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: "10%",
      render: (_, row) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              const r = setState({
                open: true,
                current: row as Billing,
              });
            }}
          />{" "}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={async () => {
              console.log("onConfirm", { row });
              await props.onDelete(row.id);
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card>
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Billing</Typography.Title>
        <Button
          ref={addRef}
          icon={<PlusOutlined />}
          onClick={() => setState({ current: undefined, open: true })}
        />
      </Flex>
      {state.open ? (
        <BillingModal
          open={state.open}
          billing={state.current}
          closable
          destroyOnClose
          onUpdate={async (billing) => {
            const upBilling = await props.onUpdate(billing);

            if (upBilling) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return upBilling;
          }}
          onCreate={async (billing) => {
            const newBilling = await props.onCreate(billing);
            if (newBilling) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return newBilling;
          }}
          onCancel={() => {
            setState({ open: false, current: undefined });
          }}
        />
      ) : null}
      <Table
        bordered
        rowKey={"id"}
        columns={columns}
        dataSource={data?.billing?.list ?? []}
        pagination={{
          ...state.pagination,
          total: data?.billing.total,
          onChange: async (current, pageSize) => {
            setState({ pagination: { current, pageSize } });
            await fetchMore({
              variables: {
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              },
            });
          },
        }}
      />
    </Card>
  );
};
