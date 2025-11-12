"use client";

import { Card, Table, Space, Row, Col, Statistic, Tag, Empty } from "antd";
import type { FC } from "react";
import { useQuery } from "@apollo/client";
import { GET_DEBT_REPORT } from "./query";
import type { Query } from "@/graphql/resolvers-types";
import type { TableColumnsType } from "antd";

const DebtReport: FC = () => {
  const { data: reportData } = useQuery<{
    debtReport: Query["debtReport"];
  }>(GET_DEBT_REPORT);

  const report = reportData?.debtReport;

  const userColumns: TableColumnsType<any> = [
    {
      key: "userId",
      title: "ID",
      dataIndex: "userId",
      width: 80,
    },
    {
      key: "userName",
      title: "Абонент",
      dataIndex: "userName",
      width: "20%",
    },
    {
      key: "totalDebt",
      title: "Борг (₴)",
      dataIndex: "totalDebt",
      render: (value) => (
        <span style={{ color: "#cf1322", fontWeight: "bold" }}>
          {value.toFixed(2)} ₴
        </span>
      ),
      width: "15%",
    },
    {
      key: "dueCount",
      title: "Кількість рахунків",
      dataIndex: "dueCount",
      width: "15%",
    },
    {
      key: "overdueCount",
      title: "Прострочених",
      dataIndex: "overdueCount",
      render: (value) => (
        <Tag color="red">{value}</Tag>
      ),
      width: "15%",
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Загальний борг (₴)"
              value={report?.totalDebt || 0}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Прострочених боргів (₴)"
              value={report?.overdueDebt || 0}
              precision={2}
              valueStyle={{ color: "#d32f2f" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Всього рахунків"
              value={report?.billingCount || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Прострочених рахунків"
              value={report?.overdueCount || 0}
              valueStyle={{ color: "#d32f2f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Боргу по абонентам">
        {report?.users && report.users.length > 0 ? (
          <Table
            columns={userColumns}
            dataSource={report.users}
            rowKey={(record) => record.userId}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "100%" }}
          />
        ) : (
          <Empty description="Немає боргів" />
        )}
      </Card>
    </Space>
  );
};

export default DebtReport;
