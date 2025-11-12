import type { Resolvers } from "@/graphql/resolvers-types";
import prisma from "@/db/prisma";

export const User: Resolvers["User"] = {
  address: async (parent, args, ctx, info) => {
    return await prisma.address.findFirst({
      where: { id: Number(parent.addressId) },
    });
  },
  devices: async (parent, args, ctx, info) => {
    return await prisma.device.findMany({
      where: { userId: Number(parent.id) },
      include: {
        readings: true,
        service: true,
      },
    });
  },
};
