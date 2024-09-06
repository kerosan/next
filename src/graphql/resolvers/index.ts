import prisma from "@/db/prisma";
import type { Resolvers } from "../resolvers-types";

export const resolvers: Resolvers = {
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    searchAddress: async (parent, args) => {
      console.log("==>", args);

      return await prisma.address.findMany({
        where: { address: { startsWith: args.text || "" } },
      });
    },
    address: async (parent, args) => {
      return await prisma.address.findMany();
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
  },
};
