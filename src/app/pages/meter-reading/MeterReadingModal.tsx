"use client";

import { Button, Form, Input, Modal, InputNumber, DatePicker, Space } from "antd";
import type { FormInstance } from "antd";
import type { MeterReading, Device } from "@/graphql/resolvers-types";
import { useRef, useEffect, useState, type FC } from "react";
import type { onCreate } from "./action";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  device?: Device;
  previousReading?: number;
  onCreate: typeof onCreate;
  onClose: () => void;
  onSuccess: () => void;
};

export const MeterReadingModal: FC<Props> = ({
  open,
  device,
  previousReading,
  onCreate,
  onClose,
  onSuccess,
}) => {
  const formRef = useRef<FormInstance>(null);
  const [consumption, setConsumption] = useState<number | null>(null);

  useEffect(() => {
    if (!open) {
      formRef.current?.resetFields();
      setConsumption(null);
    }
  }, [open]);

  const handleValueChange = (value: number | null) => {
    if (value !== null && previousReading !== undefined) {
      const calc = value - previousReading;
      setConsumption(calc > 0 ? calc : 0);
    }
  };

  const handleOk = async () => {
    const values = await formRef.current?.validateFields();
    if (!values || !device?.id) return;

    try {
      await onCreate({
        deviceId: device.id,
        readingDate: values.readingDate.format("YYYY-MM-DD"),
        value: values.value,
        notes: values.notes,
      });
      formRef.current?.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error creating reading:", error);
    }
  };

  return (
    <Modal
      title={`Нове показання: ${device?.meterNumber} (${device?.service?.name})`}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Скасувати
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Зберегти
        </Button>,
      ]}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{
          readingDate: dayjs(),
        }}
      >
        <Form.Item
          label="Дата показання"
          name="readingDate"
          rules={[
            { required: true, message: "Будь ласка, виберіть дату" },
          ]}
        >
          <DatePicker format="DD-MMM-YYYY" />
        </Form.Item>

        {previousReading !== undefined && (
          <Form.Item label="Попереднє показання" key="prev">
            <Input disabled value={previousReading.toFixed(3)} />
          </Form.Item>
        )}

        <Form.Item
          label={`Поточне показання (${device?.service?.unit})`}
          name="value"
          rules={[
            { required: true, message: "Будь ласка, введіть поточне показання" },
            {
              validator: (_, value) => {
                if (value !== undefined && previousReading !== undefined && value < previousReading) {
                  return Promise.reject(new Error("Показання не може бути менше попереднього"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={previousReading || 0}
            step={0.1}
            onChange={handleValueChange}
            stringMode
            formatter={(value) => Number(value)?.toFixed(3).toString() || ""}
            parser={(value) => Number(value || 0)}
          />
        </Form.Item>

        {consumption !== null && (
          <Form.Item label="Розраховане споживання">
            <Input
              disabled
              value={`${consumption.toFixed(3)} ${device?.service?.unit}`}
              style={{ backgroundColor: "#e6f7ff" }}
            />
          </Form.Item>
        )}

        <Form.Item label="Примітки" name="notes">
          <Input.TextArea
            placeholder="Додаткова інформація про показання..."
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
