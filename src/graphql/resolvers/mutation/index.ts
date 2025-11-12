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
        smId: args.user?.smId || "",
        name: args.user?.name,
        phone: args.user?.phone,
        addressId: args.user?.addressId,
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
        city: args.address?.city,
        zipCode: args.address?.zipCode,
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
        city: args.address.city,
        zipCode: args.address.zipCode,
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
  createBilling: async (parent, args) => {
    console.log("createBilling", { parent, args });
    const consumption = args.billing.currentReading - args.billing.previousReading;
    const billing = await prisma.billing.create({
      data: {
        userId: args.billing.userId,
        deviceId: args.billing.deviceId,
        tariffId: args.billing.tariffId,
        billingPeriod: args.billing.billingPeriod,
        previousReading: args.billing.previousReading,
        currentReading: args.billing.currentReading,
        consumption,
        amount: consumption * (await prisma.tariff.findUnique({ where: { id: args.billing.tariffId } }))?.price ?? 0,
        dueDate: args.billing.dueDate,
      },
    });
    return billing;
  },
  updateBilling: async (parent, args) => {
    console.log("updateBilling", { parent, args });
    const billing = await prisma.billing.update({
      where: { id: args.billing.id },
      data: {
        billingPeriod: args.billing.billingPeriod,
        previousReading: args.billing.previousReading,
        currentReading: args.billing.currentReading,
        dueDate: args.billing.dueDate,
        isPaid: args.billing.isPaid,
      },
    });
    return billing;
  },
  deleteBilling: async (parent, args) => {
    console.log("deleteBilling", { parent, args });
    const billing = await prisma.billing.delete({
      where: { id: args.billingId },
    });
    return billing.id;
  },
  createTariff: async (parent, args) => {
    console.log("createTariff", { parent, args });
    const tariff = await prisma.tariff.create({
      data: {
        serviceId: args.tariff.serviceId,
        name: args.tariff.name,
        price: args.tariff.price,
        startDate: args.tariff.startDate,
        endDate: args.tariff.endDate,
      },
    });
    return tariff;
  },
  updateTariff: async (parent, args) => {
    console.log("updateTariff", { parent, args });
    const tariff = await prisma.tariff.update({
      where: { id: args.tariff.id },
      data: {
        serviceId: args.tariff.serviceId,
        name: args.tariff.name,
        price: args.tariff.price,
        startDate: args.tariff.startDate,
        endDate: args.tariff.endDate,
      },
    });
    return tariff;
  },
  deleteTariff: async (parent, args) => {
    console.log("deleteTariff", { parent, args });
    const tariff = await prisma.tariff.delete({
      where: { id: args.tariffId },
    });
    return tariff.id;
  },
  createService: async (parent, args) => {
    console.log("createService", { parent, args });
    const service = await prisma.service.create({
      data: {
        name: args.service.name,
        unit: args.service.unit,
      },
    });
    return service;
  },
  updateService: async (parent, args) => {
    console.log("updateService", { parent, args });
    const service = await prisma.service.update({
      where: { id: args.service.id },
      data: {
        name: args.service.name,
        unit: args.service.unit,
      },
    });
    return service;
  },
  deleteService: async (parent, args) => {
    console.log("deleteService", { parent, args });
    const service = await prisma.service.delete({
      where: { id: args.serviceId },
    });
    return service.id;
  },
  createReading: async (parent, args) => {
    console.log("createReading", { parent, args });
    const previousReading = await prisma.meterReading.findFirst({
      where: { deviceId: args.reading.deviceId },
      orderBy: { readingDate: "desc" },
    });

    const consumption = previousReading 
      ? args.reading.value - previousReading.value 
      : args.reading.value;

    const reading = await prisma.meterReading.create({
      data: {
        deviceId: args.reading.deviceId,
        readingDate: args.reading.readingDate,
        value: args.reading.value,
        consumption,
        notes: args.reading.notes,
      },
    });
    return reading;
  },
  deleteReading: async (parent, args) => {
    console.log("deleteReading", { parent, args });
    const reading = await prisma.meterReading.delete({
      where: { id: args.readingId },
    });
    return reading.id;
  },
  createPayment: async (parent, args) => {
    console.log("createPayment", { parent, args });
    const payment = await prisma.payment.create({
      data: {
        userId: args.payment.userId,
        billingId: args.payment.billingId,
        amount: args.payment.amount,
        paymentMethod: args.payment.paymentMethod,
        paymentDate: args.payment.paymentDate,
        reference: args.payment.reference,
        notes: args.payment.notes,
      },
    });

    // Якщо платіж прив'язаний до рахунку, позначити його як оплачений
    if (args.payment.billingId) {
      await prisma.billing.update({
        where: { id: args.payment.billingId },
        data: { isPaid: true },
      });
    }

    return payment;
  },
  deletePayment: async (parent, args) => {
    console.log("deletePayment", { parent, args });
    const payment = await prisma.payment.delete({
      where: { id: args.paymentId },
    });
    return payment.id;
  },
};
