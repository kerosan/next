"use server";

import { getClient } from "@/lib/apolloClient";
import { CREATE_SERVICE, DELETE_SERVICE, UPDATE_SERVICE } from "./query";

export async function onCreate(input: {
  name: string;
  unit: string;
}) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: CREATE_SERVICE,
      variables: {
        service: input,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

export async function onUpdate(input: {
  id: number;
  name?: string;
  unit?: string;
}) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: UPDATE_SERVICE,
      variables: {
        service: input,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

export async function onDelete(serviceId: number) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: DELETE_SERVICE,
      variables: {
        serviceId,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error deleting service:", error);
    throw error;
  }
}
