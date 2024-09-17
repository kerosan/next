import {
  CREATE_DEVICE,
  DELETE_DEVICE,
  GET_DEVICE_PAGE,
  // SEARCH_DEVICE,
  UPDATE_DEVICE,
} from "./query";
import { getClient } from "@/lib/apolloClient";
import type { Mutation, Query } from "@/graphql/resolvers-types";
import type { Device } from "@prisma/client";

// export const onSearch = async (text: string) => {
//   "use server";

//   const { data, error } = await getClient().query<Pick<Query, "searchDevice">>(
//     {
//       query: SEARCH_DEVICE,
//       variables: { text },
//     },
//   );
//   console.log("onSearchDevice", { text, data, error });

//   return data.searchDevice;
// };

export const onCreate = async (device: Partial<Device>) => {
  "use server";
  console.log("onCreate", { device });

  const { data, errors } = await getClient().mutate<Mutation["createDevice"]>({
    errorPolicy: "all",

    mutation: CREATE_DEVICE,

    variables: { device },
    refetchQueries: [{ query: GET_DEVICE_PAGE }],
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
    refetchQueries: [{ query: GET_DEVICE_PAGE }],
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
    refetchQueries: [{ query: GET_DEVICE_PAGE, variables: {} }],
  });

  console.log({ data, errors });
  return data;
};
