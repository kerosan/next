import type { Resolvers } from "@/graphql/resolvers-types";
import prisma from "@/db/prisma";
import dayjs from "dayjs";

export const Query: Resolvers["Query"] = {
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
  billing: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.billing.count(),
      prisma.billing.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { userId: "asc" },
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
  settings: async (parent, args) => {
    const tariff = await prisma.tariff.findMany();
    return { tariff };
  },
  services: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.service.count(),
      prisma.service.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { name: "asc" },
      }),
    ]);

    return { list, total };
  },
  readings: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.meterReading.count({
        where: { deviceId: args.deviceId },
      }),
      prisma.meterReading.findMany({
        where: { deviceId: args.deviceId },
        take: args.take,
        skip: args.skip,
        orderBy: { readingDate: "desc" },
      }),
    ]);

    return { list, total };
  },
  payments: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.payment.count(),
      prisma.payment.findMany({
        take: args.take,
        skip: args.skip,
        orderBy: { paymentDate: "desc" },
      }),
    ]);

    return { list, total };
  },
  searchPayment: async (parent, args) => {
    return await prisma.payment.findMany({
      where: {
        reference: {
          contains: args.reference ?? "",
        },
      },
      take: 10,
    });
  },
  unpaidBillings: async (parent, args) => {
    const [total, list] = await prisma.$transaction([
      prisma.billing.count({
        where: { userId: args.userId, isPaid: false },
      }),
      prisma.billing.findMany({
        where: { userId: args.userId, isPaid: false },
        take: args.take,
        skip: args.skip,
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return { list, total };
  },
  consumptionReport: async (parent, args) => {
    const user = await prisma.user.findUnique({
      where: { id: args.userId },
    });

    const readings = await prisma.meterReading.findMany({
      where: {
        device: {
          userId: args.userId,
        },
      },
      include: { device: { include: { service: true } } },
      orderBy: { readingDate: "desc" },
      take: args.months * 2,
    });

    const totalConsumption = readings.reduce((sum, r) => sum + (r.consumption || 0), 0);
    const uniqueMonths = new Set(
      readings.map((r) => dayjs(r.readingDate).format("YYYY-MM"))
    ).size;

    return {
      userId: args.userId,
      userName: user?.name || "—",
      totalConsumption,
      averageMonthlyConsumption: uniqueMonths > 0 ? totalConsumption / uniqueMonths : 0,
      readings: readings.map((r) => ({
        period: dayjs(r.readingDate).format("YYYY-MM-DD"),
        value: r.value,
        consumption: r.consumption || 0,
        service: r.device.service?.name || "—",
      })),
    };
  },
  debtReport: async (parent, args) => {
    const unpaidBillings = await prisma.billing.findMany({
      where: { isPaid: false },
      include: { user: true },
    });

    const overdueCount = unpaidBillings.filter(
      (b) => b.dueDate && dayjs(b.dueDate).isBefore(dayjs())
    ).length;

    const totalDebt = unpaidBillings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const overdueDebt = unpaidBillings
      .filter((b) => b.dueDate && dayjs(b.dueDate).isBefore(dayjs()))
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const userDebtMap = new Map<
      number,
      { userId: number; userName: string; totalDebt: number; dueCount: number; overdueCount: number }
    >();

    unpaidBillings.forEach((billing) => {
      if (!userDebtMap.has(billing.userId)) {
        userDebtMap.set(billing.userId, {
          userId: billing.userId,
          userName: billing.user?.name || "—",
          totalDebt: 0,
          dueCount: 0,
          overdueCount: 0,
        });
      }

      const user = userDebtMap.get(billing.userId)!;
      user.totalDebt += billing.amount || 0;
      user.dueCount += 1;
      if (billing.dueDate && dayjs(billing.dueDate).isBefore(dayjs())) {
        user.overdueCount += 1;
      }
    });

    return {
      totalDebt,
      overdueDebt,
      billingCount: unpaidBillings.length,
      overdueCount,
      users: Array.from(userDebtMap.values()),
    };
  },
  revenueReport: async (parent, args) => {
    const startDate = dayjs().subtract(args.monthsBack, "months");
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: startDate.format("YYYY-MM-DD"),
        },
      },
      include: { billing: true },
    });

    const billings = await prisma.billing.findMany({
      where: {
        createdAt: {
          gte: startDate.toDate(),
        },
      },
    });

    const totalBilled = billings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const collectionRate = totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0;

    // Monthly breakdown
    const monthlyMap = new Map<
      string,
      { month: string; billed: number; paid: number; collected: number }
    >();

    for (let i = 0; i < args.monthsBack; i++) {
      const month = dayjs().subtract(i, "months").format("YYYY-MM");
      monthlyMap.set(month, { month, billed: 0, paid: 0, collected: 0 });
    }

    billings.forEach((b) => {
      const month = dayjs(b.createdAt).format("YYYY-MM");
      if (monthlyMap.has(month)) {
        const data = monthlyMap.get(month)!;
        data.billed += b.amount || 0;
      }
    });

    payments.forEach((p) => {
      const month = dayjs(p.paymentDate).format("YYYY-MM");
      if (monthlyMap.has(month)) {
        const data = monthlyMap.get(month)!;
        data.paid += p.amount;
        data.collected = data.paid > 0 ? (data.paid / data.billed) * 100 : 0;
      }
    });

    const monthlyData = Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Payment methods breakdown
    const methodMap = new Map<string, { method: string; count: number; amount: number }>();

    payments.forEach((p) => {
      if (!methodMap.has(p.paymentMethod)) {
        methodMap.set(p.paymentMethod, { method: p.paymentMethod, count: 0, amount: 0 });
      }
      const method = methodMap.get(p.paymentMethod)!;
      method.count += 1;
      method.amount += p.amount;
    });

    const paymentMethods = Array.from(methodMap.values());

    return {
      totalRevenue: totalPaid,
      totalBilled,
      totalPaid,
      collectionRate,
      monthlyData,
      paymentMethods,
    };
  },
};
