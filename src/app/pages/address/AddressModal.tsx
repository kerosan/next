"use client";

import type { Address } from "@/graphql/resolvers-types";
import { useLocalState } from "@/utils/useLocalState";
import { Modal, Form, AutoComplete, Input } from "antd";
import type { AutoCompleteProps, ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type { onCreate, onSearchAddress, onUpdate } from "./action";

const Field = Form.Item;

export const AddressModal: FC<
  ModalProps & {
    address?: Address;
    onSearchAddress: typeof onSearchAddress;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();

  const [state, setState] = useLocalState<{
    addressOptions: AutoCompleteProps["options"];
  }>({
    addressOptions: props.address
      ? [{ ...props.address }].map((i) => ({
          title: i.address ?? "",
          value: i.id?.toString(),
          id: i.id,
        }))
      : [],
  });

  useEffect(() => {
    if (props.open && props.address) {
      form.resetFields();
    }
  }, [form, props.open, props.address]);

  useEffect(() => {
    if (!form.isFieldsTouched(["address"])) {
      form.setFieldValue(
        "address",
        state.addressOptions?.find(
          (o) => Number(o.id) === Number(props.address?.id),
        )?.title,
      );
    }
  }, [form, props.address?.id, state.addressOptions]);

  return (
    <Modal
      {...props}
      title={
        props.address ? `Редагувати адресу #${props.address.id}` : "Додати адресу"
      }
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="address_form_in_modal"
          initialValues={{ ...props.address }}
          clearOnDestroy
          onFinish={async (data) => {
            if (props.address) {
              await props.onUpdate({ id: props.address.id, ...data });
            } else {
              await props.onCreate(data);
            }
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Field 
        label="Адреса" 
        name="address" 
        rules={[{ required: true, message: "Будь ласка, введіть адресу" }]}
      >
        <AutoComplete
          allowClear
          placeholder="Вулиця, будинок, квартира"
          onFocus={async () => {
            if (!form.getFieldValue("address")) {
              const { data } = await props.onSearchAddress("");
              setState({
                addressOptions: data.searchAddress?.map((i) => ({
                  title: i?.address ?? "",
                  value: i?.id?.toString(),
                })),
              });
            }
          }}
          onSelect={(id, data) => {
            form.setFieldValue("address", data.title);
            form.setFieldValue("addressId", data.value);
          }}
          optionRender={({ data }) => <div key={data.id}>{data.title}</div>}
          onSearch={async (text) => {
            const { data } = await props.onSearchAddress(text);

            setState({
              addressOptions: data.searchAddress?.map((i) => ({
                title: i?.address ?? "",
                value: i?.id?.toString(),
              })),
            });
          }}
          options={state.addressOptions}
        />
      </Field>
      <Field label="Місто" name="city">
        <Input placeholder="Наприклад: Київ, Львів" />
      </Field>
      <Field label="Поштовий індекс" name="zipCode">
        <Input placeholder="Наприклад: 01001" />
      </Field>
    </Modal>
  );
};
