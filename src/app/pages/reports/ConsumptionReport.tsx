"use client";

import { Card, Select, Space, Empty, Row, Col, Statistic, Table } from "antd";
import type { FC } from "react";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONSUMPTION_REPORT } from "./query";
import type { Query } from "@/graphql/resolvers-types";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { GET_USUERS_PAGE } from "@/app/pages/user/query";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import("recharts").then((mod) => mod.Line),
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

const ConsumptionReport: FC = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [months, setMonths] = useState(6);

  // Get all users first
  const { data: allUsersData } = useQuery(GET_USUERS_PAGE, {
    variables: { take: 1000, skip: 0 },
  });

  const userOptions = allUsersData?.users?.list?.map((u) => ({
    label: u.name,
    value: u.id,
  })) || [];

  const { data: reportData } = useQuery<{
    consumptionReport: Query["consumptionReport"];
  }>(GET_CONSUMPTION_REPORT, {
    variables: {
      userId: selectedUserId || 0,
      months,
    },
    skip: !selectedUserId,
  });

  const chartData = reportData?.consumptionReport?.readings || [];

  const columns = [
    {
      key: "period",
      title: "Період",
      render: (_, record: any) =>
        dayjs(record.period).format("DD-MMM-YYYY"),
    },
    {
      key: "value",
      title: "Показання",
      render: (_, record: any) => record.value.toFixed(2),
    },
    {
      key: "consumption",
      title: "Споживання",
      render: (_, record: any) => record.consumption.toFixed(2),
    },
    {
      key: "service",
      title: "Послуга",
      dataIndex: "service",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card title="Витрати послуг по абоненту">
        <Space>
          <Select
            placeholder="Виберіть абонента"
            style={{ width: "300px" }}
            value={selectedUserId}
            onChange={setSelectedUserId}
            options={userOptions}
          />
          <Select
            placeholder="Кількість місяців"
            value={months}
            onChange={setMonths}
            options={[
              { label: "3 місяці", value: 3 },
              { label: "6 місяців", value: 6 },
              { label: "12 місяців", value: 12 },
            ]}
          />
        </Space>
      </Card>

      {selectedUserId && reportData?.consumptionReport ? (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Загальне споживання"
                value={reportData.consumptionReport.totalConsumption}
                precision={2}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Середнє місячне споживання"
                value={reportData.consumptionReport.averageMonthlyConsumption}
                precision={2}
              />
            </Col>
          </Row>

          <Card title="Графік споживання">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="#1890ff"
                  name="Споживання"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Таблиця показань">
            <Table
              columns={columns}
              dataSource={chartData}
              rowKey={(_, idx) => idx}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </>
      ) : (
        <Empty description="Виберіть абонента для перегляду звіту" />
      )}
    </Space>
  );
};

export default ConsumptionReport;
