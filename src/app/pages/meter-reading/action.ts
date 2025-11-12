"use server";

import { getClient } from "@/lib/apolloClient";
import { CREATE_READING, DELETE_READING } from "./query";

export async function onCreate(input: {
  deviceId: number;
  readingDate: string;
  value: number;
  notes?: string;
}) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: CREATE_READING,
      variables: {
        reading: input,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error creating reading:", error);
    throw error;
  }
}

export async function onDelete(readingId: number) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: DELETE_READING,
      variables: {
        readingId,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error deleting reading:", error);
    throw error;
  }
}
