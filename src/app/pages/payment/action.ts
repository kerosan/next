"use server";

import { getClient } from "@/lib/apolloClient";
import { CREATE_PAYMENT, DELETE_PAYMENT } from "./query";

export async function onCreate(input: {
  userId: number;
  billingId?: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  reference?: string;
  notes?: string;
}) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: CREATE_PAYMENT,
      variables: {
        payment: input,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

export async function onDelete(paymentId: number) {
  try {
    const client = await getClient();
    const result = await client.mutate({
      mutation: DELETE_PAYMENT,
      variables: {
        paymentId,
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
}
