import type { Resolvers } from "@/graphql/resolvers-types";
import prisma from "@/db/prisma";

export const Query: Resolvers["Query"] = {
  users: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { name: "asc" },
      }),
    ]);

    return { list, total };
  },
  searchAddress: async (parent, args) => {
    return await prisma.address.findMany({
      where: {
        address: {
          contains: args.text ?? "",
        },
      },
      take: 10,
    });
  },
  searchDevice: async (parent, args) => {
    return await prisma.device.findMany({
      where: {
        name: {
          contains: args.text ?? "",
        },
      },
      take: 10,
    });
  },
  address: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.address.count(),
      prisma.address.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { address: "asc" },
      }),
    ]);

    return { list, total };
  },
  device: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.device.count(),
      prisma.device.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { name: "asc" },
      }),
    ]);

    return { list, total };
  },
};
