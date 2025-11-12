"use client";

import { Modal, Form, Input, DatePicker, Row, Col, InputNumber, Select } from "antd";
import type { ModalProps, SelectProps } from "antd";
import { useEffect, useState, type FC } from "react";
import type { onCreate, onUpdate } from "./action";
import type { Device } from "@/graphql/resolvers-types";
import { useQuery } from "@apollo/client";
import { GET_SERVICES_PAGE } from "../service/query";
import type { Query } from "@/graphql/resolvers-types";

const Field = Form.Item;

export const DeviceModal: FC<
  ModalProps & {
    device?: Device;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();
  const [serviceOptions, setServiceOptions] = useState<SelectProps["options"]>([]);

  const { data: servicesData } = useQuery<{
    services: Query["services"];
  }>(GET_SERVICES_PAGE, {
    variables: {
      take: 100,
      skip: 0,
    },
  });

  useEffect(() => {
    if (servicesData?.services?.list) {
      setServiceOptions(
        servicesData.services.list.map((service) => ({
          label: `${service.name} (${service.unit})`,
          value: service.id,
        }))
      );
    }
    // biome-ignore lint/react-hooks/exhaustiveDeps: setServiceOptions is stable
  }, [servicesData?.services?.list]);

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
                meterNumber: data.meterNumber,
                initialValue: data.initialValue,
                startDate: data.startDate,
                endDate: data.endDate,
                serviceId: data.serviceId,
              });
            } else {
              await props.onCreate({
                meterNumber: data.meterNumber,
                initialValue: data.initialValue,
                startDate: data.startDate,
                endDate: data.endDate,
                serviceId: data.serviceId,
              });
            }
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Field 
        label="Meter number" 
        name="meterNumber" 
        rules={[
          { required: true, message: "Please enter the meter number" },
          { pattern: /^\d+$/, message: "Number must contain only digits" }
        ]}
      >
        <Input placeholder="e.g.: 12345678" />
      </Field>
      <Field 
        label="Service" 
        name="serviceId" 
        rules={[
          { required: true, message: "Please select a service" }
        ]}
      >
        <Select
          placeholder="Select a service (Water, Gas, Electricity)"
          options={serviceOptions}
        />
      </Field>
      <Row justify={"space-between"}>
        <Col flex={"50%"}>
          <Field 
            label="Installation date" 
            name="startDate" 
            rules={[
              { required: true, message: "Please select a date" }
            ]}
          >
            <DatePicker format={"DD-MMM-YYYY"} />
          </Field>
        </Col>
        <Col flex={"50%"}>
          <Field label="Removal date" name="endDate">
            <DatePicker format={"DD-MMM-YYYY"} />
          </Field>
        </Col>
      </Row>
      <Field 
        label="Initial reading" 
        name="initialValue" 
        rules={[
          { required: true, message: "Please enter the initial reading" }
        ]}
      >
        <InputNumber
          min={0}
          step={0.1}
          stringMode
          formatter={(value) => {
            return Number(value)?.toFixed(3).toString();
          }}
        />
      </Field>
    </Modal>
  );
};
