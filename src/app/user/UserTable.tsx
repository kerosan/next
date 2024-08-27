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
import { GET_USUERS_PAGE } from "./user.gql";
import {
  QueryRef,
  useQuery,
  useQueryRefHandlers,
  useReadQuery,
  useSuspenseQuery,
} from "@apollo/client";
import { getClient } from "@/lib/apolloClient";

type State = {
  open: boolean;
  currentUser?: User;
};

export const UserTable: FC<{
  onSearchAddress: (text: string) => Promise<Address[]>;
  onCreateUser: (user: Partial<User>) => Promise<User>;
  onDeleteUser: (userId: string) => Promise<void>;
}> = (props) => {
  const { data, error, refetch } = useQuery<{ users: User[] }>(GET_USUERS_PAGE);

  console.log({ data, error });

  const [state, setState] = useLocalState<State>({
    open: false,
    currentUser: undefined,
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
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              setState({ open: true, currentUser: row as any });
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
          onClick={() => setState({ currentUser: undefined, open: true })}
        />
      </Flex>

      {state.open ? (
        <UserModal
          open={state.open}
          user={state.currentUser}
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
            setState({ open: false, currentUser: undefined });
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
