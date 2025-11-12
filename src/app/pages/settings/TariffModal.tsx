"use client";

import { Modal, Form, Input, DatePicker, Row, Col, InputNumber, Select } from "antd";
import type { ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type { onCreateTariff, onUpdateTariff } from "./action";
import { GET_SERVICES_LIST } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import type { Tariff } from "@/graphql/resolvers-types";

const Field = Form.Item;

export const TariffModal: FC<
  ModalProps & {
    tariff?: Tariff;
    onCreateTariff: typeof onCreateTariff;
    onUpdate: typeof onUpdateTariff;
  }
> = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.open && props.tariff) {
      form.resetFields();
    }
  }, [form, props.open, props.tariff]);

  const { data: servicesData } = useQuery<{
    services: Query["services"];
  }>(GET_SERVICES_LIST, { fetchPolicy: "cache-first" });

  return (
    <Modal
      {...props}
      title={props.tariff ? `Edit tariff #${props.tariff.id}` : "Add tariff"}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="tariff_form_in_modal"
          initialValues={{ ...props.tariff }}
          clearOnDestroy
          onFieldsChange={console.log}
          onFinish={async (data: Partial<Tariff>) => {
            if (props.tariff) {
              await props.onUpdate(data);
            } else {
              await props.onCreateTariff(data);
            }
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Field label="Service" name="serviceId" colon required>
        <Select
          showSearch
          options={servicesData?.services.list.map((s) => ({
            label: `${s.name} (${s.unit})`,
            value: s.id,
          }))}
        />
      </Field>

      <Field label="Name" name="name" colon>
        <Input />
      </Field>

      <Field label="Price" name="price" colon>
        <InputNumber
          stringMode
          formatter={(value) => {
            return Number(value)?.toFixed(3).toString();
          }}
        />
        <Row justify={"space-between"}>
          <Col flex={"50%"}>
            <Field label="Start Date" name="startDate" colon required>
              <DatePicker format={"DD-MMM-YYYY"} />
            </Field>
          </Col>
          <Col flex={"50%"}>
            <Field label="End Date" name="endDate" colon>
              <DatePicker format={"DD-MMM-YYYY"} disabled />
            </Field>
          </Col>
        </Row>
      </Field>
    </Modal>
  );
};
