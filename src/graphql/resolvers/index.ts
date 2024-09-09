import prisma from "@/db/prisma";
import type { Resolvers } from "../resolvers-types";

export const resolvers: Resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
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
    address: async (parent, args) => {
      const [total, list] = await prisma.$transaction([
        prisma.address.count(),
        prisma.address.findMany({
          take: args.take,
          skip: args.skip,
          orderBy: { address: "desc" },
        }),
      ]);

      return { list, total };
    },
    device: async () => {
      return await prisma.device.findMany();
    },
  },
  User: {
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
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      console.log("createUser", { parent, args, ctx, info });
      const user = await prisma.user.create({
        data: {
          name: args.user?.name,
        },
      });
      return user;
    },
    deleteUser: async (parent, args, ctx, info) => {
      const user = await prisma.user.delete({
        where: { id: Number(args.userId) },
      });
      console.log("deleted", { user });

      return user.id;
    },
    createAddress: async (parent, args, ctx, info) => {
      console.log("createAddress", { parent, args, ctx, info });
      const address = await prisma.address.create({
        data: {
          address: args.address?.address,
        },
      });
      return address;
    },
    updateAddress: async (parent, args, ctx, info) => {
      console.log("createAddress", { parent, args, ctx, info });
      const address = await prisma.address.update({
        where: { id: Number(args.address.id) },
        data: {
          address: args.address.address,
        },
      });
      return address;
    },
    deleteAddress: async (parent, args, ctx, info) => {
      console.log("deleteAddrerss", { parent, args, ctx, info });

      const address = await prisma.address.delete({
        where: { id: Number(args.addressId) },
      });
      console.log("deleted", { address });

      return address.id;
    },
  },
};
