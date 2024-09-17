"use client";

import type { User } from "@/graphql/resolvers-types";
import { useLocalState } from "@/utils/useLocalState";
import { Modal, Input, Form, AutoComplete } from "antd";
import type { AutoCompleteProps, ModalProps } from "antd";
import { useEffect, type FC } from "react";
import type {
  onCreate,
  onUpdate,
  onSearchAddress,
  onSearchDevice,
} from "./action";

const Field = Form.Item;

export const UserModal: FC<
  ModalProps & {
    user?: User;
    onSearchAddress: typeof onSearchAddress;
    onSearchDevice: typeof onSearchDevice;
    onCreate: typeof onCreate;
    onUpdate: typeof onUpdate;
  }
> = (props) => {
  const [form] = Form.useForm();

  const [state, setState] = useLocalState<{
    addressOptions: AutoCompleteProps["options"];
    deviceOptions: AutoCompleteProps["options"];
  }>({
    addressOptions: props.user
      ? [{ ...props.user.address }].map((i) => ({
          title: i.address ?? "",
          value: i.id?.toString(),
          id: i.id,
        }))
      : [],
    deviceOptions: props.user
      ? [{ ...props.user.device }].map((i) => ({
          title: i.name ?? "",
          value: i.id?.toString(),
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
    if (
      !form.isFieldsTouched(["address"]) ||
      !form.isFieldsTouched(["device"])
    ) {
      form.setFieldValue(
        "address",
        state.addressOptions?.find(
          (o) => Number(o.id) === Number(props.user?.address?.id),
        )?.title,
      );

      form.setFieldValue(
        "device",
        state.deviceOptions?.find(
          (o) => Number(o.id) === Number(props.user?.device?.id),
        )?.title,
      );
    }
  }, [
    form,
    props.user?.address?.id,
    props.user?.device?.id,
    state.addressOptions,
    state.deviceOptions,
  ]);

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
          name="user_form_in_modal"
          initialValues={{ ...props.user }}
          clearOnDestroy
          onFinish={async (user: Partial<User>) => {
            console.log("onFinish", { user });

            if (props.user) {
              await props.onUpdate({
                id: Number(props.user.id),
                name: user.name,
                email: user.email,
                phone: user.phone,
                addressId: Number(user.addressId),
                deviceId: Number(user.deviceId),
              });
            } else {
              await props.onCreate(user);
            }
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
        <Input />
      </Field>
      <Field label="Address" name="address" colon>
        <AutoComplete
          allowClear
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
          onSearch={async (text) => {
            const { data } = await props.onSearchAddress(text);

            setState({
              addressOptions: data.searchAddress?.map((i) => ({
                title: i?.address ?? "",
                value: i?.id?.toString(),
              })),
            });
          }}
          optionRender={({ data }) => <div key={data.id}>{data.title}</div>}
          options={state.addressOptions}
        />
      </Field>
      <Field label="DeviceId" name="deviceId" hidden>
        <Input />
      </Field>
      <Field label="Device" name="device">
        <AutoComplete
          allowClear
          onFocus={async () => {
            if (!form.getFieldValue("device")) {
              const { data } = await props.onSearchDevice("");
              setState({
                deviceOptions: data.searchDevice?.map((i) => ({
                  title: i?.name ?? "",
                  value: i?.id?.toString(),
                })),
              });
            }
          }}
          onSelect={(id, data) => {
            form.setFieldValue("device", data.title);
            form.setFieldValue("deviceId", data.value);
          }}
          onSearch={async (text) => {
            const { data } = await props.onSearchDevice(text);

            setState({
              deviceOptions: data.searchDevice?.map((i) => ({
                title: i?.name ?? "",
                value: i?.id?.toString(),
              })),
            });
          }}
          optionRender={({ data }) => <div key={data.id}>{data.title}</div>}
          options={state.deviceOptions}
        />
      </Field>
    </Modal>
  );
};
