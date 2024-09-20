"use client";

import { Card, Flex, Typography, Form, Checkbox } from "antd";
import type { FC } from "react";
import { GET_SETTINGS_PAGE } from "./query";
import { useQuery } from "@apollo/client";
import type { Query } from "@/graphql/resolvers-types";
import { TariffTable } from "./TariffTable";
import { onCreateTariff, onDeleteTariff, onUpdateTariff } from "./action";

const Field = Form.Item;

export const SettingsPage: FC<{
  onCreateTariff: typeof onCreateTariff;
  onUpdateTariff: typeof onUpdateTariff;
  onDeleteTariff: typeof onDeleteTariff;
}> = (props) => {
  const { data, error, refetch, fetchMore } = useQuery<{
    settings: Query["settings"];
  }>(GET_SETTINGS_PAGE);

  if (error) {
    throw error;
  }

  return (
    <Card>
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Settings</Typography.Title>
      </Flex>
      <hr />

      <TariffTable
        tariff={data?.settings.tariff}
        refetch={refetch}
        onCreateTariff={async (tariff) => {
          const newTariff = await props.onCreateTariff(tariff);
          await refetch();
          return newTariff;
        }}
        onUpdateTariff={async (tariff) => {
          const newTariff = await props.onUpdateTariff(tariff);
          await refetch();
          return newTariff;
        }}
        onDeleteTariff={async (id) => await props.onDeleteTariff(id)}
      />
      <br />
      <hr />
      <Flex align="baseline" justify="space-between">
        <Typography.Title>Parameters</Typography.Title>
      </Flex>
      <Form>
        <Field label="Checkbox">
          <Checkbox />
        </Field>
      </Form>
    </Card>
  );
};
