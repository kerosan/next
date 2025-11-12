"use client";

import { Card, Table, Space, Row, Col, Statistic, Select } from "antd";
import type { FC } from "react";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_REVENUE_REPORT } from "./query";
import type { Query } from "@/graphql/resolvers-types";
import type { TableColumnsType } from "antd";
import dynamic from "next/dynamic";
import { PercentageOutlined, DollarOutlined } from "@ant-design/icons";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamic(
  () => import("recharts").then((mod) => mod.Bar),
  { ssr: false }
);
const XAxis = dynamic(
  () => import("recharts").then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import("recharts").then((mod) => mod.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("recharts").then((mod) => mod.Tooltip),
  { ssr: false }
);
const Legend = dynamic(
  () => import("recharts").then((mod) => mod.Legend),
  { ssr: false }
);

const RevenueReport: FC = () => {
  const [monthsBack, setMonthsBack] = useState(6);

  const { data: reportData } = useQuery<{
    revenueReport: Query["revenueReport"];
  }>(GET_REVENUE_REPORT, {
    variables: { monthsBack },
  });

  const report = reportData?.revenueReport;

  const monthlyColumns: TableColumnsType<any> = [
    {
      key: "month",
      title: "Місяць",
      dataIndex: "month",
      width: "20%",
    },
    {
      key: "billed",
      title: "Виставлено (₴)",
      dataIndex: "billed",
      render: (value) => `${value.toFixed(2)} ₴`,
      width: "20%",
    },
    {
      key: "paid",
      title: "Сплачено (₴)",
      dataIndex: "paid",
      render: (value) => `${value.toFixed(2)} ₴`,
      width: "20%",
    },
    {
      key: "collected",
      title: "Зібрано (%)",
      dataIndex: "collected",
      render: (value) => `${value.toFixed(2)}%`,
      width: "20%",
    },
  ];

  const methodColumns: TableColumnsType<any> = [
    {
      key: "method",
      title: "Метод оплати",
      dataIndex: "method",
      render: (value) => {
        const methods: Record<string, string> = {
          cash: "Готівка",
          card: "Карта",
          transfer: "Переказ",
          other: "Інше",
        };
        return methods[value] || value;
      },
      width: "30%",
    },
    {
      key: "count",
      title: "Кількість платежів",
      dataIndex: "count",
      width: "30%",
    },
    {
      key: "amount",
      title: "Сума (₴)",
      dataIndex: "amount",
      render: (value) => `${value.toFixed(2)} ₴`,
      width: "40%",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card title="Період" extra={
        <Select
          value={monthsBack}
          onChange={setMonthsBack}
          options={[
            { label: "3 місяці", value: 3 },
            { label: "6 місяців", value: 6 },
            { label: "12 місяців", value: 12 },
          ]}
          style={{ width: "150px" }}
        />
      }>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Загальний доход (₴)"
              value={report?.totalRevenue || 0}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Виставлено (₴)"
              value={report?.totalBilled || 0}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Сплачено (₴)"
              value={report?.totalPaid || 0}
              precision={2}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Касса поповнення (%)"
              value={report?.collectionRate || 0}
              precision={2}
              suffix="%"
              prefix={<PercentageOutlined />}
            />
          </Col>
        </Row>
      </Card>

      <Card title="Графік доходів">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={report?.monthlyData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="billed" fill="#8884d8" name="Виставлено" />
            <Bar dataKey="paid" fill="#82ca9d" name="Сплачено" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Місячні дані">
        <Table
          columns={monthlyColumns}
          dataSource={report?.monthlyData || []}
          rowKey={(_, idx) => idx}
          pagination={{ pageSize: 12 }}
        />
      </Card>

      <Card title="Розподіл за методами оплати">
        <Table
          columns={methodColumns}
          dataSource={report?.paymentMethods || []}
          rowKey={(_, idx) => idx}
          pagination={false}
        />
      </Card>
    </Space>
  );
};

export default RevenueReport;
