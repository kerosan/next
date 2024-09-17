"use client";

import type { Address } from "@prisma/client";
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
import { GET_ADDRESS_PAGE } from "./query";
import { AddressModal } from "./AddressModal";
import type { AddressPageResult } from "@/graphql/resolvers-types";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import type { onCreate, onDelete, onSearch, onUpdate } from "./action";

type State = {
  open: boolean;
  current?: Address;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const AddressTable: FC<{
  onSearch: typeof onSearch;
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
    address: AddressPageResult;
  }>(GET_ADDRESS_PAGE, {
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
      key: 4,
      title: "Address",
      dataIndex: "address",
      width: "90%",
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
              setState({ open: true, current: row as Address });
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
        <Typography.Title>Address</Typography.Title>
        <Button
          ref={addRef}
          icon={<PlusOutlined />}
          onClick={() => setState({ current: undefined, open: true })}
        />
      </Flex>
      {state.open ? (
        <AddressModal
          open={state.open}
          address={state.current}
          closable
          destroyOnClose
          onSearch={props.onSearch}
          onUpdate={async (address) => {
            const upAddress = await props.onUpdate(address);

            if (upAddress) {
              setState({ open: false });
              await refetch();
            }
            return upAddress;
          }}
          onCreate={async (address) => {
            const newAddress = await props.onCreate(address);
            if (newAddress) {
              setState({ open: false });
              await refetch();
            }
            return newAddress;
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
        dataSource={data?.address?.list ?? []}
        pagination={{
          ...state.pagination,
          total: data?.address.total,
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
