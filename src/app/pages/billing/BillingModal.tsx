"use client";

import { Modal, Form, Input, DatePicker, Row, Col, InputNumber } from "antd";
import type { ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type { onCreate, onUpdate } from "./action";
import type { Billing } from "@/graphql/resolvers-types";

const Field = Form.Item;

export const BillingModal: FC<
  ModalProps & {
    billing?: Billing;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open && props.billing) {
      form.resetFields();
    }
  }, [form, props.open, props.billing]);

  return (
    <Modal
      {...props}
      title={
        props.billing ? `Edit billing #${props.billing.id}` : "Add billing"
      }
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="billing_form_in_modal"
          initialValues={{ ...props.billing }}
          clearOnDestroy
          onFieldsChange={console.log}
          onFinish={async (data: Partial<Billing>) => {
            if (props.billing) {
              await props.onUpdate(data);
            } else {
              await props.onCreate(data);
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
