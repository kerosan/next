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
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { onCreate, onDelete, onSearch } from "./action";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";

type State = {
  open: boolean;
  current?: User;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const UserTable: FC<{
  onSearch: typeof onSearch;
  onCreate: typeof onCreate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);

  const { data, error, refetch, fetchMore } = useQuery<{
    users: Query["users"];
  }>(GET_USUERS_PAGE, {
    variables: { take: 10, skip: 0 },
  });

  if (error) {
    throw error;
  }

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

  const columns: TableColumnsType = [
    {
      key: 0,
      title: "id",
      dataIndex: "id",
    },
    {
      key: 1,
      title: "Name",
      dataIndex: "name",
    },
    {
      key: 2,
      title: "Phone",
      dataIndex: "phone",
    },
    {
      key: 3,
      title: "Email",
      dataIndex: "email",
    },
    {
      key: 4,
      title: "Address",
      // dataIndex: "address",
      render: (_, row) => {
        return row.address?.address;
      },
    },
    {
      key: 5,
      title: "Device",
      // dataIndex: "device",
      render: (_, row) => {
        return row.device?.name;
      },
    },
    {
      key: 5,
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, row) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setState({ open: true, current: row as User });
            }}
          />{" "}
          <Popconfirm
            title="Sure to delete?"
            onConfirm={async () => {
              console.log("onConfirm", { row });
              await props.onDelete(row.id);
              await refetch();
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
        <Typography.Title>Users</Typography.Title>
        <Button
          ref={addRef}
          icon={<PlusOutlined />}
          onClick={() => setState({ current: undefined, open: true })}
        />
      </Flex>

      {state.open ? (
        <UserModal
          open={state.open}
          user={state.current}
          closable
          destroyOnClose
          onSearch={props.onSearch}
          onCreate={async (user) => {
            const newUser = await props.onCreate(user);
            if (newUser) {
              setState({ open: false });
              await refetch();
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
