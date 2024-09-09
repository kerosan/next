"use client";

import { UserModal } from "./UserModal";
import type { Address, User } from "@prisma/client";
import {
  Button,
  Card,
  Flex,
  Popconfirm,
  Table,
  Typography,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import type { FC } from "react";
import { useLocalState } from "@/utils/useLocalState";
import { GET_USUERS_PAGE } from "./query";
import { useQuery } from "@apollo/client";
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { onCreateUser, onDeleteUser, onSearchAddress } from "./action";

type State = {
  open: boolean;
  current?: User;
};

export const UserTable: FC<{
  onSearchAddress: typeof onSearchAddress;
  onCreateUser: typeof onCreateUser;
  onDeleteUser: typeof onDeleteUser;
}> = (props) => {
  const { data, error, refetch } = useQuery<{ users: User[] }>(GET_USUERS_PAGE);

  if (error) {
    throw error;
  }

  const [state, setState] = useLocalState<State>({
    open: false,
    current: undefined,
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
              await props.onDeleteUser(row.id);
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
          onSearch={props.onSearchAddress}
          onCreate={async (user) => {
            const newUser = await props.onCreateUser(user);
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
        dataSource={data?.users}
      />
    </Card>
  );
};
