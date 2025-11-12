"use client";

import { ServiceModal } from "./ServiceModal";
import type { Service } from "@/graphql/resolvers-types";
import {
  Button,
  Card,
  Empty,
  Popconfirm,
  Table,
  type TablePaginationConfig,
  type TableColumnsType,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useRef, type FC } from "react";
import { useLocalState } from "@/utils/useLocalState";
import { GET_SERVICES_PAGE } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import type { onCreate, onDelete, onUpdate } from "./action";
import { useKey } from "react-use";
import { skip } from "@/utils/pagination";

type State = {
  open: boolean;
  current?: Service;
  pagination: Pick<TablePaginationConfig, "current" | "pageSize">;
};

export const ServiceTable: FC<{
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

  const { data, error, refetch } = useQuery<{
    services: Query["services"];
  }>(GET_SERVICES_PAGE, {
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

  const columns: TableColumnsType<Service> = [
    {
      key: "id",
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      key: "name",
      title: "Назва послуги",
      dataIndex: "name",
      sorter: (a, b) => (a.name || "").localeCompare(b.name || ""),
    },
    {
      key: "unit",
      title: "Одиниця вимірювання",
      dataIndex: "unit",
    },
    {
      key: "tariffs",
      title: "Кількість тарифів",
      render: (_, record) => record.tariffs?.length || 0,
    },
    {
      key: "actions",
      title: "Дії",
      width: 150,
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setState({ open: true, current: record })}
          />
          <Popconfirm
            title="Видалити послугу?"
            description={`Ви впевнені, що хочете видалити послугу "${record.name}"?`}
            onConfirm={async () => {
              await props.onDelete(record.id);
              await refetch();
            }}
            okText="Так"
            cancelText="Ні"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        title="Послуги"
        extra={
          <Button
            ref={addRef}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setState({ open: true, current: undefined })}
          >
            Додати послугу
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data?.services.list}
          rowKey={(record) => record.id}
          pagination={{
            current: state.pagination.current,
            pageSize: state.pagination.pageSize,
            total: data?.services.total,
            onChange: (page, pageSize) => {
              setState({
                pagination: { current: page, pageSize },
              });
            },
          }}
          loading={!data}
          locale={{
            emptyText: <Empty description="Послуги не знайдені" />,
          }}
        />
      </Card>

      <ServiceModal
        open={state.open}
        current={state.current}
        onCreate={props.onCreate}
        onUpdate={props.onUpdate}
        onDelete={props.onDelete}
        onClose={() => setState({ open: false, current: undefined })}
        onSuccess={() => refetch()}
      />
    </>
  );
};
