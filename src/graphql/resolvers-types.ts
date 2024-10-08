import { GraphQLResolveInfo } from 'graphql';
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
};

export type Address = {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type AddressPageResult = {
  __typename?: 'AddressPageResult';
  list: Array<Address>;
  total: Scalars['Int']['output'];
};

export type Billing = {
  __typename?: 'Billing';
  date: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  payment: Scalars['Float']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type BillingPageResult = {
  __typename?: 'BillingPageResult';
  list: Array<Billing>;
  total: Scalars['Int']['output'];
};

export type CreateAddressInput = {
  address: Scalars['String']['input'];
};

export type CreateBillingInput = {
  payment: Scalars['Float']['input'];
  userId: Scalars['Int']['input'];
};

export type CreateDeviceInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  initialValue: Scalars['Float']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
};

export type CreateTariffInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
};

export type CreateUserInput = {
  addressId?: InputMaybe<Scalars['Int']['input']>;
  deviceId?: InputMaybe<Scalars['Int']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  smId?: InputMaybe<Scalars['String']['input']>;
};

export type Device = {
  __typename?: 'Device';
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  initialValue: Scalars['Float']['output'];
  name?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
};

export type DevicePageResult = {
  __typename?: 'DevicePageResult';
  list: Array<Device>;
  total: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAddress?: Maybe<Address>;
  createBilling?: Maybe<Billing>;
  createDevice?: Maybe<Device>;
  createTariff?: Maybe<Tariff>;
  createUser?: Maybe<User>;
  deleteAddress?: Maybe<Scalars['Int']['output']>;
  deleteBilling?: Maybe<Scalars['Int']['output']>;
  deleteDevice?: Maybe<Scalars['Int']['output']>;
  deleteTariff?: Maybe<Scalars['Int']['output']>;
  deleteUser?: Maybe<Scalars['Int']['output']>;
  updateAddress?: Maybe<Address>;
  updateBilling?: Maybe<Billing>;
  updateDevice?: Maybe<Device>;
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


export type MutationUpdateTariffArgs = {
  tariff: UpdateTariffInput;
};


export type MutationUpdateUserArgs = {
  user?: InputMaybe<UpdateUserInput>;
};

export type Query = {
  __typename?: 'Query';
  address?: Maybe<AddressPageResult>;
  billing?: Maybe<BillingPageResult>;
  device?: Maybe<DevicePageResult>;
  searchAddress: Array<Maybe<Address>>;
  searchDevice: Array<Maybe<Device>>;
  settings: Settings;
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


export type QueryDeviceArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};


export type QuerySearchAddressArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchDeviceArgs = {
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type Settings = {
  __typename?: 'Settings';
  tariff: Array<Tariff>;
};

export type Tariff = {
  __typename?: 'Tariff';
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  startDate: Scalars['String']['output'];
};

export type UpdateAddressInput = {
  address: Scalars['String']['input'];
  id: Scalars['Int']['input'];
};

export type UpdateBillingInput = {
  id: Scalars['Int']['input'];
  payment: Scalars['Float']['input'];
  userId: Scalars['Int']['input'];
};

export type UpdateDeviceInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  initialValue: Scalars['Float']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  startDate: Scalars['String']['input'];
};

export type UpdateTariffInput = {
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  price: Scalars['Float']['input'];
  startDate: Scalars['String']['input'];
};

export type UpdateUserInput = {
  addressId?: InputMaybe<Scalars['Int']['input']>;
  deviceId?: InputMaybe<Scalars['Int']['input']>;
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
  device?: Maybe<Device>;
  deviceId?: Maybe<Scalars['Int']['output']>;
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
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

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

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
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
  CreateAddressInput: CreateAddressInput;
  CreateBillingInput: CreateBillingInput;
  CreateDeviceInput: CreateDeviceInput;
  CreateTariffInput: CreateTariffInput;
  CreateUserInput: CreateUserInput;
  Device: ResolverTypeWrapper<Device>;
  DevicePageResult: ResolverTypeWrapper<DevicePageResult>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Settings: ResolverTypeWrapper<Settings>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tariff: ResolverTypeWrapper<Tariff>;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBillingInput: UpdateBillingInput;
  UpdateDeviceInput: UpdateDeviceInput;
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
  CreateAddressInput: CreateAddressInput;
  CreateBillingInput: CreateBillingInput;
  CreateDeviceInput: CreateDeviceInput;
  CreateTariffInput: CreateTariffInput;
  CreateUserInput: CreateUserInput;
  Device: Device;
  DevicePageResult: DevicePageResult;
  Float: Scalars['Float']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  Settings: Settings;
  String: Scalars['String']['output'];
  Tariff: Tariff;
  UpdateAddressInput: UpdateAddressInput;
  UpdateBillingInput: UpdateBillingInput;
  UpdateDeviceInput: UpdateDeviceInput;
  UpdateTariffInput: UpdateTariffInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserPageResult: UserPageResult;
}>;

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddressPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressPageResult'] = ResolversParentTypes['AddressPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Address']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BillingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Billing'] = ResolversParentTypes['Billing']> = ResolversObject<{
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  payment?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BillingPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BillingPageResult'] = ResolversParentTypes['BillingPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Billing']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  initialValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DevicePageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DevicePageResult'] = ResolversParentTypes['DevicePageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationCreateAddressArgs, 'address'>>;
  createBilling?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType, RequireFields<MutationCreateBillingArgs, 'billing'>>;
  createDevice?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType, RequireFields<MutationCreateDeviceArgs, 'device'>>;
  createTariff?: Resolver<Maybe<ResolversTypes['Tariff']>, ParentType, ContextType, RequireFields<MutationCreateTariffArgs, 'tariff'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  deleteAddress?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteAddressArgs>>;
  deleteBilling?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteBillingArgs>>;
  deleteDevice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteDeviceArgs>>;
  deleteTariff?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteTariffArgs>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, Partial<MutationDeleteUserArgs>>;
  updateAddress?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType, RequireFields<MutationUpdateAddressArgs, 'address'>>;
  updateBilling?: Resolver<Maybe<ResolversTypes['Billing']>, ParentType, ContextType, RequireFields<MutationUpdateBillingArgs, 'billing'>>;
  updateDevice?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType, RequireFields<MutationUpdateDeviceArgs, 'device'>>;
  updateTariff?: Resolver<Maybe<ResolversTypes['Tariff']>, ParentType, ContextType, RequireFields<MutationUpdateTariffArgs, 'tariff'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['AddressPageResult']>, ParentType, ContextType, RequireFields<QueryAddressArgs, 'skip' | 'take'>>;
  billing?: Resolver<Maybe<ResolversTypes['BillingPageResult']>, ParentType, ContextType, RequireFields<QueryBillingArgs, 'skip' | 'take'>>;
  device?: Resolver<Maybe<ResolversTypes['DevicePageResult']>, ParentType, ContextType, RequireFields<QueryDeviceArgs, 'skip' | 'take'>>;
  searchAddress?: Resolver<Array<Maybe<ResolversTypes['Address']>>, ParentType, ContextType, Partial<QuerySearchAddressArgs>>;
  searchDevice?: Resolver<Array<Maybe<ResolversTypes['Device']>>, ParentType, ContextType, Partial<QuerySearchDeviceArgs>>;
  settings?: Resolver<ResolversTypes['Settings'], ParentType, ContextType>;
  users?: Resolver<Maybe<ResolversTypes['UserPageResult']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'take'>>;
}>;

export type SettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Settings'] = ResolversParentTypes['Settings']> = ResolversObject<{
  tariff?: Resolver<Array<ResolversTypes['Tariff']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TariffResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tariff'] = ResolversParentTypes['Tariff']> = ResolversObject<{
  endDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  addressId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  balance?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  device?: Resolver<Maybe<ResolversTypes['Device']>, ParentType, ContextType>;
  deviceId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  smId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserPageResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPageResult'] = ResolversParentTypes['UserPageResult']> = ResolversObject<{
  list?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Address?: AddressResolvers<ContextType>;
  AddressPageResult?: AddressPageResultResolvers<ContextType>;
  Billing?: BillingResolvers<ContextType>;
  BillingPageResult?: BillingPageResultResolvers<ContextType>;
  Device?: DeviceResolvers<ContextType>;
  DevicePageResult?: DevicePageResultResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Settings?: SettingsResolvers<ContextType>;
  Tariff?: TariffResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPageResult?: UserPageResultResolvers<ContextType>;
}>;

