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
  Tag,
  Select,
  Space,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, CheckOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useRef, useState, type FC } from "react";
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

// Визначення статусу рахунку
const getBillingStatus = (billing: Billing) => {
  if (billing.isPaid) {
    return "paid";
  }
  if (billing.dueDate && dayjs(billing.dueDate).isBefore(dayjs())) {
    return "overdue";
  }
  return "pending";
};

export const BillingTable: FC<{
  onCreate: typeof onCreate;
  onUpdate: typeof onUpdate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

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

  // Фільтрація за статусом
  const filteredBillings = filterStatus
    ? data?.billing?.list?.filter((b) => getBillingStatus(b) === filterStatus)
    : data?.billing?.list;

  const renderStatusTag = (billing: Billing) => {
    const status = getBillingStatus(billing);
    
    switch (status) {
      case "paid":
        return <Tag icon={<CheckOutlined />} color="green">Сплачено</Tag>;
      case "overdue":
        return <Tag icon={<ExclamationCircleOutlined />} color="red">Прострочено</Tag>;
      case "pending":
        return <Tag icon={<ClockCircleOutlined />} color="orange">Очікується</Tag>;
      default:
        return null;
    }
  };

  const columns: TableColumnsType<Billing> = [
    {
      key: 0,
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      key: 1,
      title: "Абонент",
      render: (_, row) => row.user?.name || "—",
      width: "15%",
    },
    {
      key: 2,
      title: "Адреса",
      render: (_, row) => {
        const addr = row.user?.address?.address;
        const city = row.user?.address?.city;
        return city ? `${addr}, ${city}` : addr || "—";
      },
      width: "18%",
    },
    {
      key: 3,
      title: "Лічильник",
      render: (_, row) => `${row.device?.meterNumber} (${row.device?.service?.name})`,
      width: "15%",
    },
    {
      key: 4,
      title: "Період",
      dataIndex: "billingPeriod",
      width: "10%",
    },
    {
      key: 5,
      title: "Сума",
      dataIndex: "amount",
      render: (value) => `${value?.toFixed(2) || "0.00"} ₴`,
      width: "10%",
    },
    {
      key: 6,
      title: "Крайній термін",
      dataIndex: "dueDate",
      render: (value) =>
        dayjs(value).isValid() ? dayjs(value).format("DD-MMM-YYYY") : "—",
      width: "12%",
    },
    {
      key: 7,
      title: "Статус",
      render: (_, row) => renderStatusTag(row),
      width: "12%",
    },
    {
      title: "Дії",
      dataIndex: "operation",
      width: "8%",
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setState({
                open: true,
                current: row as Billing,
              });
            }}
          />
          <Popconfirm
            title="Видалити рахунок?"
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
        </Space>
      ),
    },
  ];

  return (
    <Card title="Рахунки">
      <Space direction="vertical" style={{ width: "100%", marginBottom: "16px" }} size="large">
        <div>
          <label style={{ marginRight: "10px" }}>Фільтр за статусом:</label>
          <Select
            style={{ width: "250px" }}
            placeholder="Усі статуси"
            value={filterStatus || undefined}
            onChange={(value) => setFilterStatus(value)}
            allowClear
            options={[
              { label: "Очікується", value: "pending" },
              { label: "Сплачено", value: "paid" },
              { label: "Прострочено", value: "overdue" },
            ]}
          />
        </div>
      </Space>

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
        dataSource={filteredBillings ?? []}
        pagination={{
          ...state.pagination,
          total: filteredBillings?.length,
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
