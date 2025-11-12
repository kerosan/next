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
import { DeviceModal } from "./DeviceModal";
import type { Device, DevicePageResult } from "@/graphql/resolvers-types";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import { GET_DEVICE_PAGE } from "./query";
import dayjs from "dayjs";
import type { onCreate, onDelete, onUpdate } from "./action";

type State = {
  open: boolean;
  current?: Device;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const DeviceTable: FC<{
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
    device: DevicePageResult;
  }>(GET_DEVICE_PAGE, {
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
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      key: 1,
      title: "Номер лічильника",
      dataIndex: "meterNumber",
      width: "20%",
    },
    {
      key: 2,
      title: "Послуга",
      render: (_, row) => {
        return row.service?.name ? `${row.service.name} (${row.service.unit})` : "—";
      },
      width: "20%",
    },
    {
      key: 3,
      title: "Дата встановлення",
      dataIndex: "startDate",
      render: (_, row) => {
        return dayjs(row.startDate).isValid()
          ? dayjs(row.startDate).format("DD-MMM-YYYY")
          : "";
      },
      width: "15%",
    },
    {
      key: 4,
      title: "Дата зняття",
      dataIndex: "endDate",
      render: (_, row) => {
        return dayjs(row.endDate).isValid()
          ? dayjs(row.endDate).format("DD-MMM-YYYY")
          : "—";
      },
      width: "15%",
    },
    {
      key: 5,
      title: "Початкові показання",
      dataIndex: "initialValue",
      width: "12%",
      render: (value) => value?.toFixed(3),
    },
    {
      title: "Дії",
      dataIndex: "operation",
      width: "10%",
      render: (_, row) => (
        <>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              const r = setState({
                open: true,
                current: row as Device,
              });
            }}
          />{" "}
          <Popconfirm
            title="Видалити лічильник?"
            description="Ця дія не може бути скасована"
            onConfirm={async () => {
              console.log("onConfirm", { row });
              await props.onDelete(row.id);
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }}
            okText="Так"
            cancelText="Ні"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Card>
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Лічильники</Typography.Title>
        <Button
          ref={addRef}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setState({ current: undefined, open: true })}
        >
          Додати лічильник
        </Button>
      </Flex>
      {state.open ? (
        <DeviceModal
          open={state.open}
          device={state.current}
          closable
          destroyOnClose
          onUpdate={async (device) => {
            const upDevice = await props.onUpdate(device);

            if (upDevice) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return upDevice;
          }}
          onCreate={async (device) => {
            const newDevice = await props.onCreate(device);
            if (newDevice) {
              setState({ open: false });
              await refetch({
                take: state.pagination.pageSize,
                skip: skip(state.pagination),
              });
            }
            return newDevice;
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
        dataSource={data?.device?.list ?? []}
        pagination={{
          ...state.pagination,
          total: data?.device.total,
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
