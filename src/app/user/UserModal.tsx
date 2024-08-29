"use client";

import type { User, Address, CreateUserInput } from "@/graphql/resolvers-types";
import { useLocalState } from "@/utils/useLocalState";
import { Modal, Input, Form, AutoComplete } from "antd";
import type { AutoCompleteProps, ModalProps } from "antd";
import { useEffect, type FC } from "react";

const Field = Form.Item;

export const UserModal: FC<
  ModalProps & {
    user?: User;
    onSearch: (text: string) => Promise<Address[]>;
    onCreate: (user: CreateUserInput) => Promise<User>;
  }
> = (props) => {
  const [form] = Form.useForm();

  const [state, setState] = useLocalState<{
    options: AutoCompleteProps["options"];
  }>({
    options: props.user
      ? [{ ...props.user.address }].map((i) => ({
          title: i.address ?? "",
          value: i.id,
          id: i.id,
        }))
      : [],
  });

  useEffect(() => {
    if (props.open && props.user) {
      form.resetFields();
    }
  }, [form, props.open, props.user]);

  useEffect(() => {
    if (!form.isFieldsTouched(["address"])) {
      form.setFieldValue(
        "address",
        state.options?.find(
          (o) => Number(o.id) === Number(props.user?.address?.id),
        )?.title,
      );
    }
  }, [form, props.user?.address?.id, state.options]);

  console.log({ state });

  return (
    <Modal
      {...props}
      title={props.user ? `Edit user #${props.user.id}` : "Add user"}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={{ ...props.user }}
          clearOnDestroy
          onFieldsChange={(a) => console.log("onFieldsChange", { a })}
          onFinishFailed={(b) => console.log("onFinishFailed", { b })}
          onValuesChange={(c) => console.log("onValuesChange", { c })}
          onFinish={async (d) => {
            const user = await props.onCreate(d);
            console.log("onFinish", { d, user });
          }}
        >
          {dom}
        </Form>
      )}
    >
      <Field label="Name" name="name" required colon>
        <Input />
      </Field>
      <Field label="Phone" name="phone" required colon>
        <Input />
      </Field>
      <Field label="Email" name="email" colon>
        <Input />
      </Field>
      <Field label="AddressId" name="addressId" hidden>
        <Input hidden />
      </Field>
      <Field label="Address" name="address" colon>
        <AutoComplete
          allowClear
          onFocus={async () => {
            if (!form.getFieldValue("address")) {
              const address = await props.onSearch("");
              setState({
                options: address.splice(0, 10).map((i) => ({
                  title: i.address ?? "",
                  value: i.id,
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
            const address = await props.onSearch(text);
            setState({
              options: address.map((i) => ({
                title: i.address ?? "",
                value: i.id,
              })),
            });
          }}
          options={state.options}
        />
      </Field>
      <Field label="DeviceId" name="deviceId" hidden>
        <Input hidden />
      </Field>
      <Field label="Device" name="device">
        <AutoComplete />
      </Field>
    </Modal>
  );
};
