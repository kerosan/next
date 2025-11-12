"use client";

import { Button, Form, Input, Modal, InputNumber, DatePicker, Select, Alert } from "antd";
import type { FormInstance, SelectProps } from "antd";
import type { Payment, User } from "@/graphql/resolvers-types";
import { useRef, useEffect, useState, type FC } from "react";
import type { onCreate } from "./action";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  user?: User;
  unpaidBillings?: any[];
  onCreate: typeof onCreate;
  onClose: () => void;
  onSuccess: () => void;
};

export const PaymentModal: FC<Props> = ({
  open,
  user,
  unpaidBillings,
  onCreate,
  onClose,
  onSuccess,
}) => {
  const formRef = useRef<FormInstance>(null);
  const [selectedBilling, setSelectedBilling] = useState<any>(null);
  const [billingOptions, setBillingOptions] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    if (!open) {
      formRef.current?.resetFields();
      setSelectedBilling(null);
    }
  }, [open]);

  useEffect(() => {
    if (unpaidBillings) {
      setBillingOptions(
        unpaidBillings.map((b) => ({
          label: `${b.billingPeriod} - ${b.device?.meterNumber} (${b.device?.service?.name}) - ${b.amount?.toFixed(2)} ₴`,
          value: b.id,
          amount: b.amount,
        }))
      );
    }
  }, [unpaidBillings]);

  const handleBillingSelect = (billingId: number) => {
    const billing = unpaidBillings?.find((b) => b.id === billingId);
    setSelectedBilling(billing);
    if (billing) {
      formRef.current?.setFieldValue("amount", billing.amount);
    }
  };

  const handleOk = async () => {
    const values = await formRef.current?.validateFields();
    if (!values || !user?.id) return;

    try {
      await onCreate({
        userId: user.id,
        billingId: values.billingId || undefined,
        amount: values.amount,
        paymentMethod: values.paymentMethod,
        paymentDate: values.paymentDate.format("YYYY-MM-DD"),
        reference: values.reference,
        notes: values.notes,
      });
      formRef.current?.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error creating payment:", error);
    }
  };

  return (
    <Modal
      title={`Новий платіж: ${user?.name}`}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      width={600}
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
          paymentDate: dayjs(),
        }}
      >
        {unpaidBillings && unpaidBillings.length > 0 && (
          <>
            <Alert
              message="Невиплачені рахунки"
              description="Оберіть рахунок для автоматичного заповнення суми"
              type="info"
              style={{ marginBottom: "16px" }}
            />
            <Form.Item
              label="Рахунок (опціонально)"
              name="billingId"
            >
              <Select
                placeholder="Виберіть рахунок для прив'язки"
                onChange={handleBillingSelect}
                options={billingOptions}
                allowClear
              />
            </Form.Item>
          </>
        )}

        <Form.Item
          label="Метод оплати"
          name="paymentMethod"
          rules={[
            { required: true, message: "Будь ласка, виберіть метод оплати" },
          ]}
        >
          <Select
            placeholder="Виберіть метод оплати"
            options={[
              { label: "Готівка", value: "cash" },
              { label: "Карта", value: "card" },
              { label: "Переказ", value: "transfer" },
              { label: "Інше", value: "other" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Сума платежу (₴)"
          name="amount"
          rules={[
            { required: true, message: "Будь ласка, введіть суму платежу" },
            {
              validator: (_, value) => {
                if (value && value > 0) return Promise.resolve();
                return Promise.reject(new Error("Сума має бути більше нуля"));
              },
            },
          ]}
        >
          <InputNumber
            min={0.01}
            step={0.1}
            stringMode
            formatter={(value) => Number(value)?.toFixed(2).toString() || ""}
            parser={(value) => Number(value || 0)}
          />
        </Form.Item>

        <Form.Item
          label="Дата платежу"
          name="paymentDate"
          rules={[
            { required: true, message: "Будь ласка, виберіть дату" },
          ]}
        >
          <DatePicker format="DD-MMM-YYYY" />
        </Form.Item>

        <Form.Item
          label="Номер чека / переказу"
          name="reference"
        >
          <Input placeholder="Наприклад: ЧК12345 або ID переказу" />
        </Form.Item>

        <Form.Item
          label="Примітки"
          name="notes"
        >
          <Input.TextArea
            placeholder="Додаткова інформація про платіж..."
            rows={2}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
