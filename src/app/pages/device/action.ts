import { CREATE_DEVICE, DELETE_DEVICE, UPDATE_DEVICE } from "./query";
import { getClient } from "@/lib/apolloClient";
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { Device } from "@prisma/client";

export const onCreate = async (device: Partial<Device>) => {
  "use server";
  console.log("onCreate", { device });

  const { data, errors } = await getClient().mutate<Mutation["createDevice"]>({
    errorPolicy: "all",

    mutation: CREATE_DEVICE,

    variables: {
      device: {
        ...device,
        initialValue: Number(device.initialValue),
      },
    },
  });
  console.log({ data, errors });
  return data;
};

export const onUpdate = async (device: Partial<Device>) => {
  "use server";
  console.log("onUpdate", { device });

  const { data, errors } = await getClient().mutate<Mutation["updateDevice"]>({
    errorPolicy: "all",

    mutation: UPDATE_DEVICE,

    variables: { device },
  });
  console.log({ data, errors });
  return data;
};

export const onDelete = async (deviceId: string) => {
  "use server";
  console.log({ deviceId });

  const { data, errors } = await getClient().mutate<Mutation["deleteDevice"]>({
    mutation: DELETE_DEVICE,
    variables: { deviceId },
  });

  console.log({ data, errors });
  return data;
};
