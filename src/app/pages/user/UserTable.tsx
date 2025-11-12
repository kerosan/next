"use client";

import { UserModal } from "./UserModal";
import type { User } from "@prisma/client";
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
import { GET_USUERS_PAGE } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import type { onCreate, onDelete, onUpdate } from "./action";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import type { onSearchAddress } from "../address/action";
import type { onSearchDevice } from "../device/action";

type State = {
  open: boolean;
  current?: User;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const UserTable: FC<{
  onSearchAddress: typeof onSearchAddress;
  onSearchDevice: typeof onSearchDevice;
  onCreate: typeof onCreate;
  onUpdate: typeof onUpdate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);

  const [state, setState] = useLocalState<State>({
    open: false,
    current: undefined,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data, error, refetch, fetchMore } = useQuery<{
    users: Query["users"];
  }>(GET_USUERS_PAGE, {
    variables: {
      take: state.pagination.pageSize,
      skip: skip(state.pagination),
    },
  });

  if (error) {
    throw error;
  }

  useKey("+", () => {
    addRef.current?.click();
  });

  const columns: TableColumnsType = [
    {
      key: 0,
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      key: 1,
      title: "Ім'я",
      dataIndex: "name",
      width: "20%",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      key: 2,
      title: "Телефон",
      dataIndex: "phone",
      width: "15%",
    },
    {
      key: 3,
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      key: 4,
      title: "Адреса",
      render: (_, row) => {
        const addr = row.address?.address;
        const city = row.address?.city;
        return city ? `${addr}, ${city}` : addr;
      },
      width: "20%",
    },
    {
      key: 5,
      title: "Баланс",
      dataIndex: "balance",
      width: "10%",
      render: (balance) => `${balance?.toFixed(2) || "0.00"} ₴`,
    },
    {
      title: "Дії",
      dataIndex: "operation",
      width: "12%",
      render: (_, row) => (
        <>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setState({ open: true, current: row as User });
            }}
          />{" "}
          <Popconfirm
            title="Видалити абонента?"
            description="Ця дія не може бути скасована"
            onConfirm={async () => {
              console.log("onConfirm", { row });
              await props.onDelete(row.id);
              await refetch();
            }}
            okText="Так"
            cancelText="Ні"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card>
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Абоненти</Typography.Title>
        <Button
          ref={addRef}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setState({ current: undefined, open: true })}
        >
          Додати абонента
        </Button>
      </Flex>

      {state.open ? (
        <UserModal
          open={state.open}
          user={state.current}
          closable
          destroyOnClose
          onSearchAddress={props.onSearchAddress}
          onSearchDevice={props.onSearchDevice}
          onCreate={async (user) => {
            const newUser = await props.onCreate(user);
            if (newUser) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return newUser;
          }}
          onUpdate={async (user) => {
            const newUser = await props.onUpdate(user);
            if (newUser) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return newUser;
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
        dataSource={data?.users?.list}
        pagination={{
          ...state.pagination,
          total: data?.users?.total,
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
