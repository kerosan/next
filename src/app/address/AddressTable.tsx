"use client";

import type { Address } from "@prisma/client";
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
import { useQuery } from "@apollo/client";
import { GET_ADDRESS_PAGE } from "./query";
import { AddressModal } from "./AddressModal";

type State = {
  open: boolean;
  current?: Address;
};

export const AddressTable: FC<{
  onSearch: (text: string) => Promise<Address[]>;
  onCreate: (address: Partial<Address>) => Promise<Address>;
  onDelete: (addressId: string) => Promise<void>;
}> = (props) => {
  const { data, error, refetch } = useQuery<{ address: Address[] }>(
    GET_ADDRESS_PAGE,
  );

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
        dataSource={data?.address}
      />
    </Card>
  );
};
