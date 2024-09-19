import { CREATE_BILLING, DELETE_BILLING, UPDATE_BILLING } from "./query";
import { getClient } from "@/lib/apolloClient";
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { Billing } from "@prisma/client";

export const onCreate = async (billing: Partial<Billing>) => {
  "use server";
  console.log("onCreate", { billing });

  const { data, errors } = await getClient().mutate<Mutation["createBilling"]>({
    errorPolicy: "all",
    mutation: CREATE_BILLING,
    variables: {
      billing: {
        ...billing,
      },
    },
  });
  console.log({ data, errors });
  return data;
};

export const onUpdate = async (billing: Partial<Billing>) => {
  "use server";
  console.log("onUpdate", { billing });

  const { data, errors } = await getClient().mutate<Mutation["updateBilling"]>({
    errorPolicy: "all",

    mutation: UPDATE_BILLING,

    variables: { billing },
  });
  console.log({ data, errors });
  return data;
};

export const onDelete = async (billingId: string) => {
  "use server";
  console.log({ billingId });

  const { data, errors } = await getClient().mutate<Mutation["deleteBilling"]>({
    mutation: DELETE_BILLING,
    variables: { billingId },
  });

  console.log({ data, errors });
  return data;
};
