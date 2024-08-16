"use client";

import { client } from "@/app/ApolloClient";
import { getClient } from "@/app/ApolloClientRSC";
import { SEARCH_ADDRESS } from "@/graphql/query/address";
import { useLocalState } from "@/utils/useLocalState";
import { useQuery, useSuspenseQuery } from "@apollo/client";
import type { User } from "@prisma/client";
import { Modal, Input, Form, AutoComplete } from "antd";
import type { ModalProps } from "antd";
import {
  type ReactNode,
  useCallback,
  useEffect,
  type FC,
  useRef,
  ComponentProps,
} from "react";

const Field = Form.Item;

export const UserModal: FC<
  ModalProps & { user?: any; }
> = (props) => {
  const [form] = Form.useForm();

  const [state, setState] = useLocalState({
    options: props.user ? [{ ...props.user.address }] : [],
  });

  useEffect(() => {
    if (props.open && props.user) {
      form.resetFields();
      form.setFieldsValue(props.user);

      form.setFieldValue(
        "address",
        state.options.find(
          (o) => Number(o.id) === Number(props.user.address.id),
        )?.address,
      );
    }
  }, [form, props.open, props.user, state.options]);

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
          onFieldsChange={(a) => console.log({ a })}
          onFinishFailed={(b) => console.log({ b })}
          onValuesChange={(c) => console.log({ c })}
          onFinish={(d) => console.log({ d })}
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
      <Field label="Address" name="address" colon>
        <AutoComplete
          onClick={async () => {
            // const options = await refetch();
            // console.log(options);
            // setState({ options });
          }}
          onSearch={async (text) => {
            console.log({ text });
            const ret = await getClient().query({query:SEARCH_ADDRESS, variables:{text}})
            console.log({ ret });
          }}
          options={state.options}
        />
      </Field>
      <Field label="Device" name="device">
        <AutoComplete />
      </Field>
    </Modal>
  );
};
