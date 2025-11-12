"use client";

import { MeterReadingModal } from "./MeterReadingModal";
import type { MeterReading, Device } from "@/graphql/resolvers-types";
import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Select,
  Space,
  Table,
  type SelectProps,
  type TablePaginationConfig,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState, type FC } from "react";
import { useLocalState } from "@/utils/useLocalState";
import { GET_READINGS_PAGE, GET_DEVICES_FOR_READINGS } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import type { onCreate, onDelete } from "./action";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import dayjs from "dayjs";

type State = {
  open: boolean;
  selectedDeviceId?: number;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const MeterReadingTable: FC<{
  onCreate: typeof onCreate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);
  const [deviceOptions, setDeviceOptions] = useState<SelectProps["options"]>([]);

  const [state, setState] = useLocalState<State>({
    open: false,
    selectedDeviceId: undefined,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data: devicesData } = useQuery<{
    device: Query["device"];
  }>(GET_DEVICES_FOR_READINGS, {
    variables: {
      take: 100,
      skip: 0,
    },
  });

  useEffect(() => {
    if (devicesData?.device?.list) {
      setDeviceOptions(
        devicesData.device.list.map((device) => ({
          label: `${device.meterNumber} - ${device.service?.name} (${device.service?.unit})`,
          value: device.id,
        }))
      );
    }
  }, [devicesData?.device?.list]);

  const { data, error, refetch } = useQuery<{
    readings: Query["readings"];
  }>(GET_READINGS_PAGE, {
    variables: {
      deviceId: state.selectedDeviceId || 0,
      take: state.pagination.pageSize,
      skip: skip(state.pagination),
    },
    skip: !state.selectedDeviceId,
  });

  if (error) {
    throw error;
  }

  useKey("+", () => {
    addRef.current?.click();
  });

  const selectedDevice = devicesData?.device?.list?.find(
    (d) => d.id === state.selectedDeviceId
  );

  const previousReading =
    data?.readings?.list?.[0]?.value;

  const columns: TableColumnsType<MeterReading> = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      key: "readingDate",
      title: "Дата показання",
      dataIndex: "readingDate",
      render: (value) =>
        dayjs(value).isValid() ? dayjs(value).format("DD-MMM-YYYY") : "—",
      width: "15%",
    },
    {
      key: "value",
      title: `Показання (${selectedDevice?.service?.unit || ""})`,
      dataIndex: "value",
      render: (value) => value?.toFixed(3),
      width: "15%",
    },
    {
      key: "consumption",
      title: `Споживання (${selectedDevice?.service?.unit || ""})`,
      dataIndex: "consumption",
      render: (value) => (value !== null && value !== undefined ? value.toFixed(3) : "—"),
      width: "18%",
    },
    {
      key: "notes",
      title: "Примітки",
      dataIndex: "notes",
      ellipsis: true,
      width: "25%",
    },
    {
      key: "actions",
      title: "Дії",
      width: "10%",
      render: (_, record) => (
        <Popconfirm
          title="Видалити показання?"
          description="Ця дія не може бути скасована"
          onConfirm={async () => {
            await props.onDelete(record.id);
            await refetch();
          }}
          okText="Так"
          cancelText="Ні"
        >
          <Button size="small" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Показання лічильників"
        extra={
          state.selectedDeviceId && (
            <Button
              ref={addRef}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setState({ open: true })}
            >
              Додати показання
            </Button>
          )
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <label style={{ marginRight: "10px" }}>Виберіть лічильник:</label>
            <Select
              style={{ width: "100%", maxWidth: "500px" }}
              placeholder="Виберіть лічильник для перегляду показань"
              value={state.selectedDeviceId || undefined}
              onChange={(value) =>
                setState({
                  selectedDeviceId: value,
                  pagination: { current: 1, pageSize: 10 },
                })
              }
              options={deviceOptions}
              allowClear
            />
          </div>

          {state.selectedDeviceId && (
            <Table
              columns={columns}
              dataSource={data?.readings?.list}
              rowKey={(record) => record.id}
              pagination={{
                current: state.pagination.current,
                pageSize: state.pagination.pageSize,
                total: data?.readings?.total,
                onChange: (page, pageSize) => {
                  setState({
                    pagination: { current: page, pageSize },
                  });
                },
              }}
              loading={!data}
              locale={{
                emptyText: <Empty description="Показання не знайдені" />,
              }}
            />
          )}

          {!state.selectedDeviceId && (
            <Empty description="Виберіть лічильник для перегляду показань" />
          )}
        </Space>
      </Card>

      <MeterReadingModal
        open={state.open}
        device={selectedDevice}
        previousReading={previousReading}
        onCreate={props.onCreate}
        onClose={() => setState({ open: false })}
        onSuccess={() => refetch()}
      />
    </>
  );
};
