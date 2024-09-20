import type { Mutation, Query, Tariff } from "@/graphql/resolvers-types";
import { getClient } from "@/lib/apolloClient";
import { CREATE_TARIFF, DELETE_TARIFF, UPDATE_TARIFF } from "./query";

export const onCreateTariff = async (tariff: Partial<Tariff>) => {
  "use server";
  console.log("onCreateTariff", { tariff });

  return await getClient().mutate<Mutation["createTariff"]>({
    mutation: CREATE_TARIFF,
    variables: { tariff },
  });
};

export const onUpdateTariff = async (tariff: Partial<Tariff>) => {
  "use server";
  console.log("onUpdateTariff", { tariff });

  return await getClient().mutate<Mutation["updateTariff"]>({
    mutation: UPDATE_TARIFF,
    variables: { tariff },
  });
};

export const onDeleteTariff = async (tariffId: string) => {
  "use server";
  console.log("onDeleteTariff", { tariffId });

  return await getClient().mutate<Mutation["deleteTariff"]>({
    mutation: DELETE_TARIFF,
    variables: { tariffId },
  });
};
