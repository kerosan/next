import { Modal, Input, Form as AntForm } from "antd";
import type { ModalProps } from "antd";
import  type { FC } from "react";

const Field = AntForm.Item;

export const AddressModal: FC<ModalProps> = (props) => {
  const [form] = AntForm.useForm();
  // const submit = useSubmit();
  
  return (
    <Modal
      {...props}
      title="Add user"
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      destroyOnClose
      modalRender={(dom) => (
        <AntForm
          layout="vertical"
          form={form}
          name="form_in_modal"
          component={false}
          action="/api/address"
          method="POST"
          // initialValues={{ modifier: "public" }}
          clearOnDestroy
        >
          {dom}
        </AntForm>
      )}
    >
      <Field label="Address" required colon>
        <Input name="address" required />
      </Field>
    </Modal>
  );
};
