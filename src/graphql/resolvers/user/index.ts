import type { Resolvers } from "@/graphql/resolvers-types";
import prisma from "@/db/prisma";

export const User: Resolvers["User"] = {
  address: async (parent, args, ctx, info) => {
    return await prisma.address.findFirst({
      where: { id: Number(parent.addressId) },
    });
  },
  device: async (parent, args, ctx, info) => {
    return await prisma.device.findFirst({
      where: { id: Number(parent.deviceId) },
    });
  },
};
