import type { Resolvers } from "@/graphql/resolvers-types";
import prisma from "@/db/prisma";

export const Mutation: Resolvers["Mutation"] = {
  createUser: async (parent, args, ctx, info) => {
    console.log("createUser", { parent, args, ctx, info });
    const user = await prisma.user.create({
      data: {
        name: args.user?.name,
        smId: args.user?.smId || "",
      },
    });
    return user;
  },
  updateUser: async (parent, args) => {
    console.log("updateUser", { parent, args });

    const user = await prisma.user.update({
      where: { id: Number(args.user?.id) },
      data: {
        // ...args.user,
        // id: Number(args.user?.id),
        smId: args.user?.smId || "",
        name: args.user?.name,
        phone: args.user?.phone,
        addressId: args.user?.addressId,
        deviceId: args.user?.deviceId,
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
  createDevice: async (parent, args, ctx, info) => {
    console.log("createDevice", { parent, args, ctx, info });
    const address = await prisma.device.create({
      data: args.device,
    });
    return address;
  },
  updateDevice: async (parent, args, ctx, info) => {
    console.log("createDevice", { parent, args, ctx, info });
    const address = await prisma.device.update({
      where: { id: Number(args.device.id) },
      data: args.device,
    });
    return address;
  },
  deleteDevice: async (parent, args, ctx, info) => {
    console.log("deleteDevice", { parent, args, ctx, info });

    const device = await prisma.device.delete({
      where: { id: Number(args.deviceId) },
    });
    console.log("deleted", { device });

    return device.id;
  },
};
