import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Popconfirm,
  Table,
  Typography,
  type TableColumnsType,
} from "antd";
import type { Tariff } from "../../../graphql/resolvers-types";
import { useRef, type FC } from "react";
import { useKey } from "react-use";
import { TariffModal } from "./TariffModal";
import { useLocalState } from "@/utils/useLocalState";
import type { onCreateTariff, onUpdateTariff, onDeleteTariff } from "./action";

type State = {
  openTariffModal: boolean;
  current?: Tariff;
};

export const TariffTable: FC<{
  tariff?: Tariff[];
  refetch: VoidFunction;
  onCreateTariff: typeof onCreateTariff;
  onUpdateTariff: typeof onUpdateTariff;
  onDeleteTariff: typeof onDeleteTariff;
}> = (props) => {
  const addRef = useRef<HTMLButtonElement>(null);

  useKey("+", () => {
    addRef.current?.click();
  });

  const [state, setState] = useLocalState<State>({
    openTariffModal: false,
    current: undefined,
  });

  const columns: TableColumnsType = [
    {
      key: 0,
      title: "id",
      dataIndex: "id",
    },
    {
      key: 1,
      title: "Price",
      dataIndex: "price",
    },
    {
      key: 4,
      title: "Start Date",
      dataIndex: "startDate",
    },
    {
      key: 4,
      title: "End Date",
      dataIndex: "endDate",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, row) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setState({ openTariffModal: false, current: row as Tariff });
            }}
          />
          <Popconfirm
            title="Sure to delete?"
            onConfirm={async () => {
              console.log("onConfirm", { row });
              await props.onDeleteTariff(row.id);
              await props.refetch();
            }}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Tariff</Typography.Title>
        <Button
          ref={addRef}
          icon={<PlusOutlined />}
          onClick={() =>
            setState({ openTariffModal: true, current: undefined })
          }
        />
      </Flex>
      <Table
        bordered
        rowKey={"id"}
        columns={columns}
        dataSource={props.tariff}
      />
      {state.openTariffModal ? (
        <TariffModal
          open
          onCancel={() =>
            setState({ openTariffModal: false, current: undefined })
          }
          tariff={state.current}
          onCreateTariff={props.onCreateTariff}
          onUpdate={props.onUpdateTariff}
        />
      ) : null}
    </>
  );
};
