"use client";

import type {
  User,
  Address,
  CreateUserInput,
  CreateAddressInput,
} from "@/graphql/resolvers-types";
import { useLocalState } from "@/utils/useLocalState";
import { Modal, Input, Form, AutoComplete } from "antd";
import type { AutoCompleteProps, ModalProps } from "antd";
import { useEffect, type FC } from "react";

const Field = Form.Item;

export const AddressModal: FC<
  ModalProps & {
    address?: Address;
    onSearch: (text: string) => Promise<Address[]>;
    onCreate: (address: CreateAddressInput) => Promise<Address>;
  }
> = (props) => {
  const [form] = Form.useForm();

  const [state, setState] = useLocalState<{
    options: AutoCompleteProps["options"];
  }>({
    options: props.address
      ? [{ ...props.address }].map((i) => ({
          title: i.address ?? "",
          value: i.id,
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
        state.options?.find((o) => Number(o.id) === Number(props.address?.id))
          ?.title,
      );
    }
  }, [form, props.address?.id, state.options]);

  return (
    <Modal
      {...props}
      title={props.address ? `Edit user #${props.address.id}` : "Add address"}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout="vertical"
          form={form}
          name="form_in_modal"
          initialValues={{ ...props.address }}
          clearOnDestroy
          onFieldsChange={(a) => console.log("onFieldsChange", { a })}
          onFinishFailed={(b) => console.log("onFinishFailed", { b })}
          onValuesChange={(c) => console.log("onValuesChange", { c })}
          onFinish={async (d) => {
            const address = await props.onCreate(d);
            console.log("onFinish", { d, address });
          }}
        >
          {dom}
        </Form>
      )}
    >
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
              options: address?.map((i) => ({
                title: i.address ?? "",
                value: i.id,
              })),
            });
          }}
          options={state.options}
        />
      </Field>
    </Modal>
  );
};
