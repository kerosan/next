import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type AddressPageResult = {
  __typename?: 'AddressPageResult';
  list: Array<Address>;
  total: Scalars['Int']['output'];
};

export type Billing = {
  __typename?: 'Billing';
  amount: Scalars['Float']['output'];
  billingPeriod: Scalars['String']['output'];
  consumption: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  currentReading: Scalars['Float']['output'];
  device: Device;
  deviceId: Scalars['Int']['output'];
  dueDate: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isPaid: Scalars['Boolean']['output'];
  previousReading: Scalars['Float']['output'];
  tariff: Tariff;
  tariffId: Scalars['Int']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type BillingPageResult = {
  __typename?: 'BillingPageResult';
  list: Array<Billing>;
  total: Scalars['Int']['output'];
};

export type ConsumptionReading = {
  __typename?: 'ConsumptionReading';
  consumption?: Maybe<Scalars['Float']['output']>;
  period: Scalars['String']['output'];
  service: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type ConsumptionReport = {
  __typename?: 'ConsumptionReport';
  averageMonthlyConsumption: Scalars['Float']['output'];
  readings: Array<ConsumptionReading>;
  totalConsumption: Scalars['Float']['output'];
  userId: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
};

export type CreateAddressInput = {
  address: Scalars['String']['input'];
  city?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreateBillingInput = {
  billingPeriod: Scalars['String']['input'];
  currentReading: Scalars['Float']['input'];
  deviceId: Scalars['Int']['input'];
  dueDate: Scalars['String']['input'];
  previousReading: Scalars['Float']['input'];
  tariffId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateDeviceInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  initialValue: Scalars['Float']['input'];
  meterNumber?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMeterReadingInput = {
  deviceId: Scalars['Int']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  readingDate: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type CreatePaymentInput = {
  amount: Scalars['Float']['input'];
  billingId?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  paymentDate: Scalars['String']['input'];
  paymentMethod: Scalars['String']['input'];
  reference?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};

export type CreateServiceInput = {
  name: Scalars['String']['input'];
  unit: Scalars['String']['input'];
};

export type CreateTariffInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  serviceId: Scalars['Int']['input'];
  startDate: Scalars['String']['input'];
};

export type CreateUserInput = {
  addressId?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  smId?: InputMaybe<Scalars['String']['input']>;
};

export type DebtReport = {
  __typename?: 'DebtReport';
  billingCount: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  overdueDebt: Scalars['Float']['output'];
  totalDebt: Scalars['Float']['output'];
  users: Array<DebtUser>;
};

export type DebtUser = {
  __typename?: 'DebtUser';
  dueCount: Scalars['Int']['output'];
  overdueCount: Scalars['Int']['output'];
  totalDebt: Scalars['Float']['output'];
  userId: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
};

export type Device = {
  __typename?: 'Device';
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  initialValue: Scalars['Float']['output'];
  meterNumber?: Maybe<Scalars['String']['output']>;
  readings: Array<MeterReading>;
  service?: Maybe<Service>;
  serviceId?: Maybe<Scalars['Int']['output']>;
  startDate: Scalars['String']['output'];
  user?: Maybe<User>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type DevicePageResult = {
  __typename?: 'DevicePageResult';
  list: Array<Device>;
  total: Scalars['Int']['output'];
};

export type MeterReading = {
  __typename?: 'MeterReading';
  consumption?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  device: Device;
  deviceId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  readingDate: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type MeterReadingPageResult = {
  __typename?: 'MeterReadingPageResult';
  list: Array<MeterReading>;
  total: Scalars['Int']['output'];
};

export type MonthlyRevenueData = {
  __typename?: 'MonthlyRevenueData';
  billed: Scalars['Float']['output'];
  collected: Scalars['Float']['output'];
  month: Scalars['String']['output'];
  paid: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAddress?: Maybe<Address>;
  createBilling?: Maybe<Billing>;
  createDevice?: Maybe<Device>;
  createPayment?: Maybe<Payment>;
  createReading?: Maybe<MeterReading>;
  createService?: Maybe<Service>;
  createTariff?: Maybe<Tariff>;
  createUser?: Maybe<User>;
  deleteAddress?: Maybe<Scalars['Int']['output']>;
  deleteBilling?: Maybe<Scalars['Int']['output']>;
  deleteDevice?: Maybe<Scalars['Int']['output']>;
  deletePayment?: Maybe<Scalars['Int']['output']>;
  deleteReading?: Maybe<Scalars['Int']['output']>;
  deleteService?: Maybe<Scalars['Int']['output']>;
  deleteTariff?: Maybe<Scalars['Int']['output']>;
  deleteUser?: Maybe<Scalars['Int']['output']>;
  updateAddress?: Maybe<Address>;
  updateBilling?: Maybe<Billing>;
  updateDevice?: Maybe<Device>;
  updateService?: Maybe<Service>;
  updateTariff?: Maybe<Tariff>;
  updateUser?: Maybe<User>;
};


export type MutationCreateAddressArgs = {
  address: CreateAddressInput;
};


export type MutationCreateBillingArgs = {
  billing: CreateBillingInput;
};


export type MutationCreateDeviceArgs = {
  device: CreateDeviceInput;
};


export type MutationCreatePaymentArgs = {
  payment: CreatePaymentInput;
};


export type MutationCreateReadingArgs = {
  reading: CreateMeterReadingInput;
};


export type MutationCreateServiceArgs = {
  service: CreateServiceInput;
};


export type MutationCreateTariffArgs = {
  tariff: CreateTariffInput;
};


export type MutationCreateUserArgs = {
  user?: InputMaybe<CreateUserInput>;
};


export type MutationDeleteAddressArgs = {
  addressId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteBillingArgs = {
  billingId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteDeviceArgs = {
  deviceId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeletePaymentArgs = {
  paymentId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteReadingArgs = {
  readingId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteServiceArgs = {
  serviceId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteTariffArgs = {
  tariffId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDeleteUserArgs = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateAddressArgs = {
  address: UpdateAddressInput;
};


export type MutationUpdateBillingArgs = {
  billing: UpdateBillingInput;
};


export type MutationUpdateDeviceArgs = {
  device: UpdateDeviceInput;
};


export type MutationUpdateServiceArgs = {
  service: UpdateServiceInput;
};


export type MutationUpdateTariffArgs = {
  tariff: UpdateTariffInput;
};


export type MutationUpdateUserArgs = {
  user?: InputMaybe<UpdateUserInput>;
};

export type Payment = {
  __typename?: 'Payment';
  amount: Scalars['Float']['output'];
  billing?: Maybe<Billing>;
  billingId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  paymentDate: Scalars['String']['output'];
  paymentMethod: Scalars['String']['output'];
  reference?: Maybe<Scalars['String']['output']>;
  user: User;
  userId: Scalars['Int']['output'];
};

export type PaymentMethodStats = {
  __typename?: 'PaymentMethodStats';
  amount: Scalars['Float']['output'];
  count: Scalars['Int']['output'];
  method: Scalars['String']['output'];
};

export type PaymentPageResult = {
  __typename?: 'PaymentPageResult';
  list: Array<Payment>;
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  address?: Maybe<AddressPageResult>;
  billing?: Maybe<BillingPageResult>;
  consumptionReport?: Maybe<ConsumptionReport>;
  debtReport?: Maybe<DebtReport>;
  device?: Maybe<DevicePageResult>;
  getAddress?: Maybe<Address>;
  getBilling?: Maybe<Billing>;
  getDevice?: Maybe<Device>;
  getTariff?: Maybe<Tariff>;
  payments?: Maybe<PaymentPageResult>;
  readings?: Maybe<MeterReadingPageResult>;
  revenueReport?: Maybe<RevenueReport>;
  searchAddress: Array<Maybe<Address>>;
  searchDevice: Array<Maybe<Device>>;
  searchPayment: Array<Maybe<Payment>>;
  services?: Maybe<ServicePageResult>;
  settings: Settings;
  unpaidBillings?: Maybe<BillingPageResult>;
  users?: Maybe<UserPageResult>;
};


export type QueryAddressArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryBillingArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryConsumptionReportArgs = {
  months: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};


export type QueryDeviceArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryGetAddressArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetBillingArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetDeviceArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetTariffArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPaymentsArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryReadingsArgs = {
  deviceId: Scalars['Int']['input'];
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryRevenueReportArgs = {
  monthsBack: Scalars['Int']['input'];
};


export type QuerySearchAddressArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchDeviceArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchPaymentArgs = {
  reference?: InputMaybe<Scalars['String']['input']>;
};


export type QueryServicesArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QueryUnpaidBillingsArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};


export type QueryUsersArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type RevenueReport = {
  __typename?: 'RevenueReport';
  collectionRate: Scalars['Float']['output'];
  monthlyData: Array<MonthlyRevenueData>;
  paymentMethods: Array<PaymentMethodStats>;
  totalBilled: Scalars['Float']['output'];
  totalPaid: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type Service = {
  __typename?: 'Service';
  devices: Array<Device>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  tariffs: Array<Tariff>;
  unit: Scalars['String']['output'];
};

export type ServicePageResult = {
  __typename?: 'ServicePageResult';
  list: Array<Service>;
  total: Scalars['Int']['output'];
};

export type Settings = {
  __typename?: 'Settings';
  tariff: Array<Tariff>;
};

export type Tariff = {
  __typename?: 'Tariff';
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  service: Service;
  serviceId: Scalars['Int']['output'];
  startDate: Scalars['String']['output'];
};

export type UpdateAddressInput = {
  address: Scalars['String']['input'];
  city?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateBillingInput = {
  billingPeriod?: InputMaybe<Scalars['String']['input']>;
  currentReading?: InputMaybe<Scalars['Float']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  previousReading?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateDeviceInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  initialValue?: InputMaybe<Scalars['Float']['input']>;
  meterNumber?: InputMaybe<Scalars['String']['input']>;
  serviceId?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateServiceInput = {
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTariffInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  serviceId?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  addressId?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  smId?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Address>;
  addressId?: Maybe<Scalars['Int']['output']>;
  balance?: Maybe<Scalars['Float']['output']>;
  devices: Array<Device>;
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  smId?: Maybe<Scalars['String']['output']>;
};

export type UserPageResult = {
  __typename?: 'UserPageResult';
  list: Array<User>;
  total: Scalars['Int']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Address: ResolverTypeWrapper<Address>;
  AddressPageResult: ResolverTypeWrapper<AddressPageResult>;
  Billing: ResolverTypeWrapper<Billing>;
  BillingPageResult: ResolverTypeWrapper<BillingPageResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  ConsumptionReading: ResolverTypeWrapper<ConsumptionReading>;
  ConsumptionReport: ResolverTypeWrapper<ConsumptionReport>;
  CreateAddressInput: CreateAddressInput;
  CreateBillingInput: CreateBillingInput;
  CreateDeviceInput: CreateDeviceInput;
  CreateMeterReadingInput: CreateMeterReadingInput;
  CreatePaymentInput: CreatePaymentInput;
  CreateServiceInput: CreateServiceInput;
  CreateTariffInput: CreateTariffInput;
  CreateUserInput: CreateUserInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DebtReport: ResolverTypeWrapper<DebtReport>;
  DebtUser: ResolverTypeWrapper<DebtUser>;
  Device: ResolverTypeWrapper<Device>;
  DevicePageResult: ResolverTypeWrapper<DevicePageResult>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MeterReading: ResolverTypeWrapper<MeterReading>;
  MeterReadingPageResult: ResolverTypeWrapper<MeterReadingPageResult>;
  MonthlyRevenueData: ResolverTypeWrapper<MonthlyRevenueData>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Payment: ResolverTypeWrapper<Payment>;
  PaymentMethodStats: ResolverTypeWrapper<PaymentMethodStats>;
  PaymentPageResult: ResolverTypeWrapper<PaymentPageResult>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RevenueReport: ResolverTypeWrapper<RevenueReport>;
  Service: ResolverTypeWrapper<Service>;
  ServicePageResult: ResolverTypeWrapper<ServicePageResult>;
  Settings: ResolverTypeWrapper<Settings>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tariff: ResolverTypeWrapper<Tariff>;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBillingInput: UpdateBillingInput;
  UpdateDeviceInput: UpdateDeviceInput;
  UpdateServiceInput: UpdateServiceInput;
  UpdateTariffInput: UpdateTariffInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserPageResult: ResolverTypeWrapper<UserPageResult>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Address: Address;
  AddressPageResult: AddressPageResult;
  Billing: Billing;
  BillingPageResult: BillingPageResult;
  Boolean: Scalars['Boolean']['output'];
  ConsumptionReading: ConsumptionReading;
  ConsumptionReport: ConsumptionReport;
  CreateAddressInput: CreateAddressInput;
  CreateBillingInput: CreateBillingInput;
  CreateDeviceInput: CreateDeviceInput;
  CreateMeterReadingInput: CreateMeterReadingInput;
  CreatePaymentInput: CreatePaymentInput;
  CreateServiceInput: CreateServiceInput;
  CreateTariffInput: CreateTariffInput;
  CreateUserInput: CreateUserInput;
  DateTime: Scalars['DateTime']['output'];
  DebtReport: DebtReport;
  DebtUser: DebtUser;
  Device: Device;
  DevicePageResult: DevicePageResult;
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  MeterReading: MeterReading;
  MeterReadingPageResult: MeterReadingPageResult;
  MonthlyRevenueData: MonthlyRevenueData;
  Mutation: Record<PropertyKey, never>;
  Payment: Payment;
  PaymentMethodStats: PaymentMethodStats;
  PaymentPageResult: PaymentPageResult;
  Query: Record<PropertyKey, never>;
  RevenueReport: RevenueReport;
  Service: Service;
  ServicePageResult: ServicePageResult;
  Settings: Settings;
  String: Scalars['String']['output'];
  Tariff: Tariff;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBillingInput: UpdateBillingInput;
  UpdateDeviceInput: UpdateDeviceInput;
  UpdateServiceInput: UpdateServiceInput;
  UpdateTariffInput: UpdateTariffInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserPageResult: UserPageResult;
}>;

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type AddressPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressPageResult'] = ResolversParentTypes['AddressPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Address']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type BillingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Billing'] = ResolversParentTypes['Billing']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  billingPeriod?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  consumption?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currentReading?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  device?: Resolver<ResolversTypes['Device'], ParentType, ContextType>;
  deviceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  dueDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isPaid?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  previousReading?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tariff?: Resolver<ResolversTypes['Tariff'], ParentType, ContextType>;
  tariffId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type BillingPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BillingPageResult'] = ResolversParentTypes['BillingPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Billing']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type ConsumptionReadingResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConsumptionReading'] = ResolversParentTypes['ConsumptionReading']> = ResolversObject<{
  consumption?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  period?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  service?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type ConsumptionReportResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConsumptionReport'] = ResolversParentTypes['ConsumptionReport']> = ResolversObject<{
  averageMonthlyConsumption?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  readings?: Resolver<Array<ResolversTypes['ConsumptionReading']>, ParentType, ContextType>;
  totalConsumption?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DebtReportResolvers<ContextType = any, ParentType extends ResolversParentTypes['DebtReport'] = ResolversParentTypes['DebtReport']> = ResolversObject<{
  billingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overdueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overdueDebt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalDebt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['DebtUser']>, ParentType, ContextType>;
}>;

export type DebtUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['DebtUser'] = ResolversParentTypes['DebtUser']> = ResolversObject<{
  dueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overdueCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalDebt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type DeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  initialValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  meterNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  readings?: Resolver<Array<ResolversTypes['MeterReading']>, ParentType, ContextType>;
  service?: Resolver<Maybe<ResolversTypes['Service']>, ParentType, ContextType>;
  serviceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
}>;

export type DevicePageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DevicePageResult'] = ResolversParentTypes['DevicePageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MeterReadingResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeterReading'] = ResolversParentTypes['MeterReading']> = ResolversObject<{
  consumption?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  device?: Resolver<ResolversTypes['Device'], ParentType, ContextType>;
  deviceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  readingDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type MeterReadingPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeterReadingPageResult'] = ResolversParentTypes['MeterReadingPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['MeterReading']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type MonthlyRevenueDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MonthlyRevenueData'] = ResolversParentTypes['MonthlyRevenueData']> = ResolversObject<{
  billed?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  collected?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  month?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paid?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationCreateAddressArgs, 'address'>>;
  createBilling?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType, RequireFields<MutationCreateBillingArgs, 'billing'>>;
  createDevice?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType, RequireFields<MutationCreateDeviceArgs, 'device'>>;
  createPayment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType, RequireFields<MutationCreatePaymentArgs, 'payment'>>;
  createReading?: Resolver<Maybe<ResolversTypes['MeterReading']>, ParentType, ContextType, RequireFields<MutationCreateReadingArgs, 'reading'>>;
  createService?: Resolver<Maybe<ResolversTypes['Service']>, ParentType, ContextType, RequireFields<MutationCreateServiceArgs, 'service'>>;
  createTariff?: Resolver<Maybe<ResolversTypes['Tariff']>, ParentType, ContextType, RequireFields<MutationCreateTariffArgs, 'tariff'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  deleteAddress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteAddressArgs>>;
  deleteBilling?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteBillingArgs>>;
  deleteDevice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteDeviceArgs>>;
  deletePayment?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeletePaymentArgs>>;
  deleteReading?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteReadingArgs>>;
  deleteService?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteServiceArgs>>;
  deleteTariff?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteTariffArgs>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteUserArgs>>;
  updateAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationUpdateAddressArgs, 'address'>>;
  updateBilling?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType, RequireFields<MutationUpdateBillingArgs, 'billing'>>;
  updateDevice?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType, RequireFields<MutationUpdateDeviceArgs, 'device'>>;
  updateService?: Resolver<Maybe<ResolversTypes['Service']>, ParentType, ContextType, RequireFields<MutationUpdateServiceArgs, 'service'>>;
  updateTariff?: Resolver<Maybe<ResolversTypes['Tariff']>, ParentType, ContextType, RequireFields<MutationUpdateTariffArgs, 'tariff'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
}>;

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  billing?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType>;
  billingId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentMethod?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reference?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type PaymentMethodStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethodStats'] = ResolversParentTypes['PaymentMethodStats']> = ResolversObject<{
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type PaymentPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentPageResult'] = ResolversParentTypes['PaymentPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Payment']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['AddressPageResult']>, ParentType, ContextType, RequireFields<QueryAddressArgs, 'skip' | 'take'>>;
  billing?: Resolver<Maybe<ResolversTypes['BillingPageResult']>, ParentType, ContextType, RequireFields<QueryBillingArgs, 'skip' | 'take'>>;
  consumptionReport?: Resolver<Maybe<ResolversTypes['ConsumptionReport']>, ParentType, ContextType, RequireFields<QueryConsumptionReportArgs, 'months' | 'userId'>>;
  debtReport?: Resolver<Maybe<ResolversTypes['DebtReport']>, ParentType, ContextType>;
  device?: Resolver<Maybe<ResolversTypes['DevicePageResult']>, ParentType, ContextType, RequireFields<QueryDeviceArgs, 'skip' | 'take'>>;
  getAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<QueryGetAddressArgs, 'id'>>;
  getBilling?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType, RequireFields<QueryGetBillingArgs, 'id'>>;
  getDevice?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType, RequireFields<QueryGetDeviceArgs, 'id'>>;
  getTariff?: Resolver<Maybe<ResolversTypes['Tariff']>, ParentType, ContextType, RequireFields<QueryGetTariffArgs, 'id'>>;
  payments?: Resolver<Maybe<ResolversTypes['PaymentPageResult']>, ParentType, ContextType, RequireFields<QueryPaymentsArgs, 'skip' | 'take'>>;
  readings?: Resolver<Maybe<ResolversTypes['MeterReadingPageResult']>, ParentType, ContextType, RequireFields<QueryReadingsArgs, 'deviceId' | 'skip' | 'take'>>;
  revenueReport?: Resolver<Maybe<ResolversTypes['RevenueReport']>, ParentType, ContextType, RequireFields<QueryRevenueReportArgs, 'monthsBack'>>;
  searchAddress?: Resolver<Array<Maybe<ResolversTypes['Address']>>, ParentType, ContextType, Partial<QuerySearchAddressArgs>>;
  searchDevice?: Resolver<Array<Maybe<ResolversTypes['Device']>>, ParentType, ContextType, Partial<QuerySearchDeviceArgs>>;
  searchPayment?: Resolver<Array<Maybe<ResolversTypes['Payment']>>, ParentType, ContextType, Partial<QuerySearchPaymentArgs>>;
  services?: Resolver<Maybe<ResolversTypes['ServicePageResult']>, ParentType, ContextType, RequireFields<QueryServicesArgs, 'skip' | 'take'>>;
  settings?: Resolver<ResolversTypes['Settings'], ParentType, ContextType>;
  unpaidBillings?: Resolver<Maybe<ResolversTypes['BillingPageResult']>, ParentType, ContextType, RequireFields<QueryUnpaidBillingsArgs, 'skip' | 'take' | 'userId'>>;
  users?: Resolver<Maybe<ResolversTypes['UserPageResult']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'take'>>;
}>;

export type RevenueReportResolvers<ContextType = any, ParentType extends ResolversParentTypes['RevenueReport'] = ResolversParentTypes['RevenueReport']> = ResolversObject<{
  collectionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  monthlyData?: Resolver<Array<ResolversTypes['MonthlyRevenueData']>, ParentType, ContextType>;
  paymentMethods?: Resolver<Array<ResolversTypes['PaymentMethodStats']>, ParentType, ContextType>;
  totalBilled?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalPaid?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalRevenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
}>;

export type ServiceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Service'] = ResolversParentTypes['Service']> = ResolversObject<{
  devices?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tariffs?: Resolver<Array<ResolversTypes['Tariff']>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type ServicePageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ServicePageResult'] = ResolversParentTypes['ServicePageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Service']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type SettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Settings'] = ResolversParentTypes['Settings']> = ResolversObject<{
  tariff?: Resolver<Array<ResolversTypes['Tariff']>, ParentType, ContextType>;
}>;

export type TariffResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tariff'] = ResolversParentTypes['Tariff']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  service?: Resolver<ResolversTypes['Service'], ParentType, ContextType>;
  serviceId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  addressId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  balance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  devices?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
}>;

export type UserPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPageResult'] = ResolversParentTypes['UserPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Address?: AddressResolvers<ContextType>;
  AddressPageResult?: AddressPageResultResolvers<ContextType>;
  Billing?: BillingResolvers<ContextType>;
  BillingPageResult?: BillingPageResultResolvers<ContextType>;
  ConsumptionReading?: ConsumptionReadingResolvers<ContextType>;
  ConsumptionReport?: ConsumptionReportResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DebtReport?: DebtReportResolvers<ContextType>;
  DebtUser?: DebtUserResolvers<ContextType>;
  Device?: DeviceResolvers<ContextType>;
  DevicePageResult?: DevicePageResultResolvers<ContextType>;
  MeterReading?: MeterReadingResolvers<ContextType>;
  MeterReadingPageResult?: MeterReadingPageResultResolvers<ContextType>;
  MonthlyRevenueData?: MonthlyRevenueDataResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PaymentMethodStats?: PaymentMethodStatsResolvers<ContextType>;
  PaymentPageResult?: PaymentPageResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RevenueReport?: RevenueReportResolvers<ContextType>;
  Service?: ServiceResolvers<ContextType>;
  ServicePageResult?: ServicePageResultResolvers<ContextType>;
  Settings?: SettingsResolvers<ContextType>;
  Tariff?: TariffResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPageResult?: UserPageResultResolvers<ContextType>;
}>;

