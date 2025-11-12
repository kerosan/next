"use client";

import { Modal, Form, Input, DatePicker, Row, Col, InputNumber, Checkbox, Alert, Divider } from "antd";
import type { ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type { onCreate, onUpdate } from "./action";
import type { Billing } from "@/graphql/resolvers-types";
import dayjs from "dayjs";

const Field = Form.Item;

export const BillingModal: FC<
  ModalProps & {
    billing?: Billing;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();
  const isEdit = !!props.billing?.id;

  useEffect(() => {
    if (props.open && props.billing) {
      form.resetFields();
      form.setFieldsValue({
        ...props.billing,
        dueDate: props.billing.dueDate ? dayjs(props.billing.dueDate) : undefined,
      });
    }
  }, [form, props.open, props.billing]);

  const isOverdue = props.billing?.dueDate && 
    dayjs(props.billing.dueDate).isBefore(dayjs()) && 
    !props.billing?.isPaid;

  return (
    <Modal
      {...props}
      title={
        isEdit ? `Редагувати рахунок #${props.billing.id}` : "Додати рахунок"
      }
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      width={700}
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="billing_form_in_modal"
          initialValues={{ ...props.billing }}
          clearOnDestroy
          onFinish={async (data: Partial<Billing>) => {
            if (isEdit) {
              await props.onUpdate({
                id: props.billing!.id,
                isPaid: data.isPaid,
              });
            } else {
              await props.onCreate(data);
            }
          }}
        >
          {dom}
        </Form>
      )}
    >
      {isOverdue && (
        <Alert
          message="Рахунок прострочено!"
          description={`Крайній термін оплати був ${dayjs(props.billing.dueDate).format("DD-MMM-YYYY")}`}
          type="error"
          showIcon
          style={{ marginBottom: "16px" }}
        />
      )}

      {isEdit ? (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Field label="Період біліингу">
                <Input disabled value={props.billing?.billingPeriod || "—"} />
              </Field>
            </Col>
            <Col span={12}>
              <Field label="Лічильник">
                <Input disabled value={`${props.billing?.device?.meterNumber} (${props.billing?.device?.service?.name})`} />
              </Field>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Field label="Попереднє показання">
                <Input disabled value={props.billing?.previousReading?.toFixed(3) || "—"} />
              </Field>
            </Col>
            <Col span={12}>
              <Field label="Поточне показання">
                <Input disabled value={props.billing?.currentReading?.toFixed(3) || "—"} />
              </Field>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Field label="Споживання">
                <Input disabled value={`${props.billing?.consumption?.toFixed(3)} ${props.billing?.device?.service?.unit}`} />
              </Field>
            </Col>
            <Col span={12}>
              <Field label="Тариф">
                <Input disabled value={`${props.billing?.tariff?.price} ₴/${props.billing?.device?.service?.unit}`} />
              </Field>
            </Col>
          </Row>

          <Field label="Сума до сплати">
            <Input disabled value={`${props.billing?.amount?.toFixed(2) || "0.00"} ₴`} style={{ fontSize: "16px", fontWeight: "bold" }} />
          </Field>

          <Divider />

          <Field label="Крайній термін оплати">
            <Input disabled value={props.billing?.dueDate ? dayjs(props.billing.dueDate).format("DD-MMM-YYYY") : "—"} />
          </Field>

          <Field
            label="Статус оплати"
            name="isPaid"
            valuePropName="checked"
            rules={[]}
          >
            <Checkbox>Позначити як сплачено</Checkbox>
          </Field>
        </>
      ) : (
        <>
          <Field label="Період біліингу" name="billingPeriod" rules={[{ required: true }]}>
            <Input placeholder="YYYY-MM" />
          </Field>

          <Row gutter={16}>
            <Col span={12}>
              <Field label="Попереднє показання" name="previousReading" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.1} stringMode />
              </Field>
            </Col>
            <Col span={12}>
              <Field label="Поточне показання" name="currentReading" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.1} stringMode />
              </Field>
            </Col>
          </Row>

          <Field label="Крайній термін оплати" name="dueDate" rules={[{ required: true }]}>
            <DatePicker format="DD-MMM-YYYY" />
          </Field>
        </>
      )}
    </Modal>
  );
};
