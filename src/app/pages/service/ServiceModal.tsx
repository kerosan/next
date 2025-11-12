"use client";

import { Button, Form, Input, Modal, Space, type FormInstance } from "antd";
import type { Service } from "@/graphql/resolvers-types";
import { useRef, type FC } from "react";
import type { onCreate, onDelete, onUpdate } from "./action";

type Props = {
  open: boolean;
  current?: Service;
  onCreate: typeof onCreate;
  onUpdate: typeof onUpdate;
  onDelete: typeof onDelete;
  onClose: () => void;
  onSuccess: () => void;
};

export const ServiceModal: FC<Props> = ({
  open,
  current,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
  onSuccess,
}) => {
  const formRef = useRef<FormInstance>(null);
  const isEdit = !!current?.id;

  const handleOk = async () => {
    const values = await formRef.current?.validateFields();
    if (!values) return;

    try {
      if (isEdit) {
        await onUpdate({
          id: current!.id,
          ...values,
        });
      } else {
        await onCreate(values);
      }
      formRef.current?.resetFields();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async () => {
    if (!current?.id) return;
    try {
      await onDelete(current.id);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <Modal
      title={isEdit ? "Редагувати послугу" : "Додати послугу"}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Скасувати
        </Button>,
        isEdit && (
          <Button key="delete" danger onClick={handleDelete}>
            Видалити
          </Button>
        ),
        <Button key="submit" type="primary" onClick={handleOk}>
          {isEdit ? "Оновити" : "Створити"}
        </Button>,
      ]}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={
          current
            ? {
                name: current.name,
                unit: current.unit,
              }
            : undefined
        }
      >
        <Form.Item
          label="Назва послуги"
          name="name"
          rules={[
            { required: true, message: "Будь ласка, введіть назву послуги" },
          ]}
        >
          <Input placeholder="Наприклад: Вода, Газ, Електрика" />
        </Form.Item>
        <Form.Item
          label="Одиниця вимірювання"
          name="unit"
          rules={[
            {
              required: true,
              message: "Будь ласка, введіть одиницю вимірювання",
            },
          ]}
        >
          <Input placeholder="Наприклад: м³, кВт•ч" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
