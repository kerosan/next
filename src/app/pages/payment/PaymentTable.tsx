"use client";

import { PaymentModal } from "./PaymentModal";
import type { Payment } from "@/graphql/resolvers-types";
import {
  Button,
  Card,
  Empty,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  type SelectProps,
  type TablePaginationConfig,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useRef, useEffect, useState, type FC } from "react";
import { useLocalState } from "@/utils/useLocalState";
import { GET_PAYMENTS_PAGE, GET_UNPAID_BILLINGS, SEARCH_PAYMENT } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import type { onCreate, onDelete } from "./action";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";
import dayjs from "dayjs";

type State = {
  open: boolean;
  selectedUserId?: number;
  selectedMethodFilter?: string;
  searchReference: string;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const PaymentTable: FC<{
  onCreate: typeof onCreate;
  onDelete: typeof onDelete;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);
  const [userOptions, setUserOptions] = useState<SelectProps["options"]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<Payment[]>([]);

  const [state, setState] = useLocalState<State>({
    open: false,
    selectedUserId: undefined,
    selectedMethodFilter: undefined,
    searchReference: "",
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const { data: paymentsData, error, refetch } = useQuery<{
    payments: Query["payments"];
  }>(GET_PAYMENTS_PAGE, {
    variables: {
      take: state.pagination.pageSize,
      skip: skip(state.pagination),
    },
  });

  const { data: billingsData } = useQuery<any>(GET_UNPAID_BILLINGS, {
    variables: {
      userId: state.selectedUserId || 0,
      take: 100,
      skip: 0,
    },
    skip: !state.selectedUserId,
  });

  const { data: searchData } = useQuery<any>(SEARCH_PAYMENT, {
    variables: {
      reference: state.searchReference,
    },
    skip: !state.searchReference || state.searchReference.length < 2,
  });

  useEffect(() => {
    if (searchData?.searchPayment) {
      setSearchResults(searchData.searchPayment);
    }
  }, [searchData?.searchPayment]);

  useEffect(() => {
    if (paymentsData?.payments?.list) {
      const uniqueUsers = Array.from(
        new Map(
          paymentsData.payments.list.map((p) => [
            p.userId,
            {
              label: `${p.user?.name} (${p.user?.email || p.user?.phone})`,
              value: p.userId,
            },
          ])
        ).values()
      );
      setUserOptions(uniqueUsers);
    }
  }, [paymentsData?.payments?.list]);

  if (error) {
    throw error;
  }

  useKey("+", () => {
    addRef.current?.click();
  });

  const handleSelectUser = (userId: number) => {
    setState({ selectedUserId: userId });
    const user = paymentsData?.payments?.list?.find((p) => p.userId === userId)?.user;
    setSelectedUser(user);
  };

  const handleSearchReference = (value: string) => {
    setState({ searchReference: value });
  };

  const paymentMethodOptions = [
    { label: "Усі методи", value: "" },
    { label: "Готівка", value: "cash" },
    { label: "Карта", value: "card" },
    { label: "Переказ", value: "transfer" },
    { label: "Інше", value: "other" },
  ];

  let displayData: Payment[] = [];

  if (state.searchReference && state.searchReference.length >= 2) {
    displayData = searchResults;
  } else if (state.selectedUserId) {
    displayData = paymentsData?.payments?.list?.filter((p) => p.userId === state.selectedUserId) || [];
  } else {
    displayData = paymentsData?.payments?.list || [];
  }

  // Apply method filter
  if (state.selectedMethodFilter) {
    displayData = displayData.filter((p) => p.paymentMethod === state.selectedMethodFilter);
  }

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "Готівка",
      card: "Карта",
      transfer: "Переказ",
      other: "Інше",
    };
    return methods[method] || method;
  };

  const columns: TableColumnsType<Payment> = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      key: "user",
      title: "Абонент",
      render: (_, record) => record.user?.name || "—",
      width: "15%",
    },
    {
      key: "amount",
      title: "Сума (₴)",
      dataIndex: "amount",
      render: (value) => `${value?.toFixed(2) || "0.00"} ₴`,
      width: "10%",
    },
    {
      key: "paymentMethod",
      title: "Метод оплати",
      render: (_, record) => getPaymentMethodLabel(record.paymentMethod),
      width: "12%",
    },
    {
      key: "paymentDate",
      title: "Дата платежу",
      render: (_, record) =>
        dayjs(record.paymentDate).isValid()
          ? dayjs(record.paymentDate).format("DD-MMM-YYYY")
          : "—",
      width: "13%",
    },
    {
      key: "reference",
      title: "Номер чека",
      dataIndex: "reference",
      width: "12%",
      render: (value) => value || "—",
    },
    {
      key: "billing",
      title: "Рахунок",
      render: (_, record) => record.billing?.billingPeriod || "—",
      width: "10%",
    },
    {
      key: "notes",
      title: "Примітки",
      dataIndex: "notes",
      ellipsis: true,
      width: "20%",
    },
    {
      key: "actions",
      title: "Дії",
      width: "8%",
      render: (_, record) => (
        <Popconfirm
          title="Видалити платіж?"
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
      <Card title="Платежі">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Search by Reference */}
          <div>
            <label style={{ marginRight: "10px" }}>Пошук за номером чека:</label>
            <Input
              placeholder="Введіть номер чека..."
              prefix={<SearchOutlined />}
              value={state.searchReference}
              onChange={(e) => handleSearchReference(e.target.value)}
              style={{ maxWidth: "300px" }}
              allowClear
            />
          </div>

          {/* Filter by User */}
          <div>
            <label style={{ marginRight: "10px" }}>Фільтр за абонентом:</label>
            <Select
              style={{ width: "100%", maxWidth: "400px" }}
              placeholder="Виберіть абонента для перегляду платежів"
              value={state.selectedUserId || undefined}
              onChange={(value) => handleSelectUser(value)}
              options={userOptions}
              allowClear
              disabled={!!state.searchReference}
            />
          </div>

          {/* Filter by Payment Method */}
          {state.selectedUserId && !state.searchReference && (
            <div>
              <label style={{ marginRight: "10px" }}>Фільтр за методом оплати:</label>
              <Select
                style={{ width: "100%", maxWidth: "300px" }}
                placeholder="Виберіть метод оплати"
                value={state.selectedMethodFilter || undefined}
                onChange={(value) => setState({ selectedMethodFilter: value || undefined })}
                options={paymentMethodOptions}
                allowClear
              />
            </div>
          )}

          {state.selectedUserId && !state.searchReference && (
            <Button
              ref={addRef}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setState({ open: true })}
            >
              Додати платіж
            </Button>
          )}

          {displayData && displayData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={displayData}
              rowKey={(record) => record.id}
              pagination={{
                current: state.pagination.current,
                pageSize: state.pagination.pageSize,
                total: displayData.length,
                onChange: (page, pageSize) => {
                  setState({
                    pagination: { current: page, pageSize },
                  });
                },
              }}
              loading={!paymentsData && !state.searchReference}
              locale={{
                emptyText: <Empty description="Платежі не знайдені" />,
              }}
            />
          ) : (
            <Empty 
              description={
                state.searchReference
                  ? "Платежі за таким номером чека не знайдені"
                  : state.selectedUserId
                  ? "Платежі для цього абонента не знайдені"
                  : "Виберіть абонента або номер чека для пошуку"
              } 
            />
          )}
        </Space>
      </Card>

      {state.selectedUserId && !state.searchReference && (
        <PaymentModal
          open={state.open}
          user={selectedUser}
          unpaidBillings={billingsData?.billings?.list}
          onCreate={props.onCreate}
          onClose={() => setState({ open: false })}
          onSuccess={() => refetch()}
        />
      )}
    </>
  );
};
