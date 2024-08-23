import prisma from "@/db/prisma";
import { createSchema } from "graphql-yoga";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `

type User {
    id: ID
    email: String
    name: String
    phone: String
    address: Address
    device: Device
    balance: Float
  }

input CreateUserInput {
    email: String
    name: String
    phone: String
}

type Address {
    id: ID
    address: String
}

input CreateUserInput {
    address: String
}

type Device {
    id: ID
    name: String
    initialValue: Float
}

input CreateDeviceInput {
    name: String
    initialValue: Float
}
type Query {
    users(id: ID): [User]
    address(id: ID, text: String): [Address]
    device: [Device]
    searchAddress(text: String!): [Address]
}

type Mutation {
  createUser(user: CreateUserInput): User
  deleteUser(userId: String): String
}

  `,
  resolvers: {
    Query: {
      users: async () => {
        return await prisma.user.findMany();
      },
      searchAddress: async (parent, args) => {
        return await prisma.address.findMany({
          where: { address: { startsWith: args.text } },
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
          data: args,
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
  },
});
