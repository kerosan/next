"use client";

import { Card, Form, Select, DatePicker, Button, Alert, Spin, Empty, Table, Space, message } from "antd";
import { useQuery } from "@apollo/client";
import type { Device, Tariff, Query } from "@/graphql/resolvers-types";
import { useRef, useState, type FC } from "react";
import { GET_DEVICES_FOR_READINGS } from "../meter-reading/query";
import { GET_BILLING_PAGE } from "./query";
import { getClient } from "@/lib/apolloClient";
import { CREATE_BILLING } from "./query";
import dayjs from "dayjs";

export const BillingGenerator: FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedBillings, setGeneratedBillings] = useState<any[]>([]);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);

  const { data: devicesData } = useQuery<{ device: Query["device"] }>(
    GET_DEVICES_FOR_READINGS,
    {
      variables: { take: 100, skip: 0 },
    }
  );

  const handleGenerateBilling = async () => {
    const values = await form.validateFields();
    if (!values.deviceId || !values.tariffId || !values.dueDate) return;

    setLoading(true);
    try {
      const device = devicesData?.device?.list?.find(
        (d) => d.id === values.deviceId
      );
      if (!device) throw new Error("Лічильник не знайдений");

      // Отримуємо останні показання
      const client = await getClient();
      const readingsResult = await client.query({
        query: require("../meter-reading/query").GET_READINGS_PAGE,
        variables: {
          deviceId: values.deviceId,
          take: 2,
          skip: 0,
        },
      });

      const readings = readingsResult.data?.readings?.list || [];
      if (readings.length < 1) {
        message.error("Не можна створити рахунок - немає показань лічильника");
        setLoading(false);
        return;
      }

      const currentReading = readings[0]?.value;
      const previousReading = readings[1]?.value || device.initialValue;

      const billingData = {
        userId: device.userId,
        deviceId: device.id,
        tariffId: values.tariffId,
        billingPeriod: values.billingPeriod,
        previousReading,
        currentReading,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
      };

      // Створюємо рахунок
      const result = await client.mutate({
        mutation: CREATE_BILLING,
        variables: { billing: billingData },
      });

      if (result.data?.createBilling) {
        setGeneratedBillings([result.data.createBilling]);
        message.success("Рахунок успішно створено!");
        form.resetFields();
      }
    } catch (error) {
      console.error("Error generating billing:", error);
      message.error("Помилка при створенні рахунку");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 50 },
    { title: "Період", dataIndex: "billingPeriod", width: 100 },
    {
      title: "Попереднє показання",
      dataIndex: "previousReading",
      render: (v) => v?.toFixed(3),
    },
    {
      title: "Поточне показання",
      dataIndex: "currentReading",
      render: (v) => v?.toFixed(3),
    },
    { title: "Споживання", dataIndex: "consumption", render: (v) => v?.toFixed(3) },
    { title: "Сума (₴)", dataIndex: "amount", render: (v) => v?.toFixed(2) },
    {
      title: "Крайній термін",
      dataIndex: "dueDate",
      render: (v) => dayjs(v).format("DD-MMM-YYYY"),
    },
  ];

  return (
    <Card title="Генерування рахунків">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Alert
          message="Інструкція"
          description="Оберіть лічильник, тариф та період. Система використає останнє показання для розрахунку"
          type="info"
        />

        <Form form={form} layout="vertical">
          <Form.Item
            label="Лічильник"
            name="deviceId"
            rules={[{ required: true, message: "Виберіть лічильник" }]}
          >
            <Select
              placeholder="Виберіть лічильник"
              options={devicesData?.device?.list?.map((d) => ({
                label: `${d.meterNumber} - ${d.service?.name}`,
                value: d.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Тариф"
            name="tariffId"
            rules={[{ required: true, message: "Виберіть тариф" }]}
          >
            <Select placeholder="Виберіть тариф" disabled>
              <Select.Option value="">Тарифи завантажуються...</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Період біліингу"
            name="billingPeriod"
            rules={[{ required: true, message: "Виберіть період" }]}
          >
            <Select
              placeholder="YYYY-MM"
              options={Array.from({ length: 12 }, (_, i) => {
                const date = dayjs().subtract(i, "month");
                return {
                  label: date.format("YYYY-MM (MMMM)"),
                  value: date.format("YYYY-MM"),
                };
              })}
            />
          </Form.Item>

          <Form.Item
            label="Крайній термін оплати"
            name="dueDate"
            rules={[{ required: true, message: "Виберіть дату" }]}
          >
            <DatePicker format="DD-MMM-YYYY" />
          </Form.Item>

          <Button
            type="primary"
            onClick={handleGenerateBilling}
            loading={loading}
            block
          >
            Створити рахунок
          </Button>
        </Form>

        {generatedBillings.length > 0 && (
          <Table
            columns={columns}
            dataSource={generatedBillings}
            rowKey="id"
            pagination={false}
          />
        )}
      </Space>
    </Card>
  );
};
