"use client";

import { Modal, Form, Input, DatePicker, Row, Col, InputNumber } from "antd";
import type { ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type { onCreate, onUpdate } from "./action";
import type { Device } from "@/graphql/resolvers-types";

const Field = Form.Item;

export const DeviceModal: FC<
  ModalProps & {
    device?: Device;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open && props.device) {
      form.resetFields();
    }
  }, [form, props.open, props.device]);

  return (
    <Modal
      {...props}
      title={props.device ? `Edit device #${props.device.id}` : "Add device"}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="device_form_in_modal"
          initialValues={{ ...props.device }}
          clearOnDestroy
          onFieldsChange={console.log}
          onFinish={async (data: Partial<Device>) => {
            if (props.device) {
              await props.onUpdate({
                id: props.device.id,
                name: data.name,
                initialValue: data.initialValue,
                startDate: data.startDate,
                endDate: data.endDate,
              });
            } else {
              await props.onCreate({
                name: data.name,
                initialValue: data.initialValue,
                startDate: data.startDate,
                endDate: data.endDate,
              });
            }
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Field label="Name" name="name" colon>
        <Input />
      </Field>
      <Row justify={"space-between"}>
        <Col flex={"50%"}>
          <Field label="Start Date" name="startDate" colon required>
            <DatePicker format={"DD-MMM-YYYY"} />
          </Field>
        </Col>
        <Col flex={"50%"}>
          <Field label="End Date" name="endDate" colon>
            <DatePicker format={"DD-MMM-YYYY"} />
          </Field>
        </Col>
      </Row>
      <Field label="Initial Value" name="initialValue" colon>
        <InputNumber
          stringMode
          formatter={(value) => {
            return Number(value)?.toFixed(3).toString();
          }}
        />
      </Field>
    </Modal>
  );
};
