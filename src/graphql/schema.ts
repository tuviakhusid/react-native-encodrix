import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type AiPromptResponse = {
  __typename?: 'AIPromptResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AiPromptType = {
  __typename?: 'AIPromptType';
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  industryId?: Maybe<Scalars['String']['output']>;
  industryName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  promptKey: Scalars['String']['output'];
  promptText: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type AcceptStageResult = {
  __typename?: 'AcceptStageResult';
  completed: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  googleDriveResult?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type AccountsResponse = {
  __typename?: 'AccountsResponse';
  accounts: Array<QuickBooksAccountType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type AddCommentResult = {
  __typename?: 'AddCommentResult';
  comment?: Maybe<DocumentComment>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AdditionalChargesConfigInput = {
  allocationMethod: AllocationMethodEnum;
  useSeparateExpenseAccount: Scalars['Boolean']['input'];
};

export type AdditionalChargesConfigType = {
  __typename?: 'AdditionalChargesConfigType';
  allocationMethod: AllocationMethodEnum;
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  useSeparateExpenseAccount: Scalars['Boolean']['output'];
};

export type AdditionalDataType = {
  __typename?: 'AdditionalDataType';
  abnStatus?: Maybe<Scalars['String']['output']>;
  atoData?: Maybe<Scalars['String']['output']>;
  businessData?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  nzbnData?: Maybe<Scalars['String']['output']>;
  nzbnStatus?: Maybe<Scalars['String']['output']>;
  testField?: Maybe<Scalars['String']['output']>;
  validationType?: Maybe<Scalars['String']['output']>;
};

export type AdminUserResponse = {
  __typename?: 'AdminUserResponse';
  adminUser?: Maybe<AdminUserType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AdminUserType = {
  __typename?: 'AdminUserType';
  createdAt?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isMainAdmin: Scalars['Boolean']['output'];
  lastLogin?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type AllocationBulkResponse = {
  __typename?: 'AllocationBulkResponse';
  message: Scalars['String']['output'];
  results: Array<AllocationItemResult>;
  success: Scalars['Boolean']['output'];
};

export type AllocationItemResult = {
  __typename?: 'AllocationItemResult';
  allocationId?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
};

export enum AllocationMethodEnum {
  Quantity = 'QUANTITY',
  Value = 'VALUE',
  Weight = 'WEIGHT'
}

export type AllocationResponse = {
  __typename?: 'AllocationResponse';
  allocationId?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type AllocationSummaryCard = {
  __typename?: 'AllocationSummaryCard';
  amount: Scalars['String']['output'];
  itemCount: Scalars['Int']['output'];
};

export type AllocationSummaryResponse = {
  __typename?: 'AllocationSummaryResponse';
  error?: Maybe<Scalars['String']['output']>;
  fullyAllocated: AllocationSummaryCard;
  partiallyAllocated: AllocationSummaryCard;
  pending: AllocationSummaryCard;
  success: Scalars['Boolean']['output'];
};

export enum AllocationTypeFilter {
  All = 'all',
  LineItem = 'line_item',
  Manual = 'manual'
}

export type ArchiveStatisticsType = {
  __typename?: 'ArchiveStatisticsType';
  averageMonthlyCount: Scalars['Float']['output'];
  lastMonthCount: Scalars['Int']['output'];
  thisMonthCount: Scalars['Int']['output'];
};

export type AssignUserToBranchInput = {
  branchId: Scalars['String']['input'];
  roleId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type AssignUserToBranchResponse = {
  __typename?: 'AssignUserToBranchResponse';
  assignment?: Maybe<UserRoleAssignmentType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type AuditTrailChangeType = {
  __typename?: 'AuditTrailChangeType';
  fieldName: Scalars['String']['output'];
  newValue?: Maybe<Scalars['JSON']['output']>;
  previousValue?: Maybe<Scalars['JSON']['output']>;
};

export type AuditTrailEntryType = {
  __typename?: 'AuditTrailEntryType';
  action: Scalars['String']['output'];
  changes: Array<AuditTrailChangeType>;
  comments?: Maybe<Scalars['String']['output']>;
  dateTime: Scalars['String']['output'];
  documentId?: Maybe<Scalars['String']['output']>;
  entityId?: Maybe<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  trailName: Scalars['String']['output'];
  userId: Scalars['String']['output'];
  workflowDocumentInstanceId?: Maybe<Scalars['String']['output']>;
};

export type AuditTrailResultType = {
  __typename?: 'AuditTrailResultType';
  entries: Array<AuditTrailEntryType>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type BillLineInput = {
  accountId: Scalars['String']['input'];
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
};

export type BranchInfoType = {
  __typename?: 'BranchInfoType';
  branchEmail?: Maybe<Scalars['String']['output']>;
  branchNum?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
};

export type BranchSearchInput = {
  filter?: InputMaybe<Scalars['JSON']['input']>;
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
};

export type BranchType = {
  __typename?: 'BranchType';
  data: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
};

export type BranchUser = {
  __typename?: 'BranchUser';
  userId: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type BranchUsersResult = {
  __typename?: 'BranchUsersResult';
  branchId: Scalars['String']['output'];
  branchName: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  users: Array<BranchUser>;
};

export type BranchWithFolders = {
  __typename?: 'BranchWithFolders';
  branchId: Scalars['String']['output'];
  branchName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  documentCount: Scalars['Int']['output'];
  folders: Array<Folder>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type BusinessDetailsFilterInput = {
  abn?: InputMaybe<Scalars['String']['input']>;
  businessName?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  entityName?: InputMaybe<Scalars['String']['input']>;
  nzbn?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type BusinessDetailsResponse = {
  __typename?: 'BusinessDetailsResponse';
  businessDetails?: Maybe<Array<BusinessDetailsType>>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type BusinessDetailsType = {
  __typename?: 'BusinessDetailsType';
  abn?: Maybe<Scalars['String']['output']>;
  acn?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Array<Scalars['String']['output']>>;
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  entityName?: Maybe<Scalars['String']['output']>;
  entityType?: Maybe<Scalars['String']['output']>;
  gstDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  industryClassifications?: Maybe<Scalars['String']['output']>;
  nzbn?: Maybe<Scalars['String']['output']>;
  registrationDate?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  sourceRegister?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  statusEffectiveFrom?: Maybe<Scalars['String']['output']>;
  tradingNames?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type BusinessValidationLogType = {
  __typename?: 'BusinessValidationLogType';
  abnNumber?: Maybe<Scalars['String']['output']>;
  additionalData?: Maybe<AdditionalDataType>;
  businessName?: Maybe<Array<Scalars['String']['output']>>;
  clientId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  nzbnNumber?: Maybe<Scalars['String']['output']>;
  s3FileLink: Scalars['String']['output'];
  source: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type BusinessValidationLogsFilterInput = {
  abnNumber?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  nzbnNumber?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type BusinessValidationLogsResponse = {
  __typename?: 'BusinessValidationLogsResponse';
  error?: Maybe<Scalars['String']['output']>;
  logs?: Maybe<Array<BusinessValidationLogType>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type CategoryExpense = {
  __typename?: 'CategoryExpense';
  categoryName: Scalars['String']['output'];
  invoiceCount: Scalars['Int']['output'];
  percentageChange?: Maybe<Scalars['Float']['output']>;
  percentageOfTotal: Scalars['Float']['output'];
  totalExpense: Scalars['Float']['output'];
};

export type ChangePasswordInput = {
  confirmPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type ChangeSubscriptionInput = {
  billingPeriod?: InputMaybe<Scalars['String']['input']>;
  keepCurrentPrice?: InputMaybe<Scalars['Boolean']['input']>;
  newPackageId: Scalars['String']['input'];
};

export type ChangeSubscriptionPlanInput = {
  billingPeriod: Scalars['String']['input'];
  newPackageId: Scalars['String']['input'];
  prorate?: Scalars['Boolean']['input'];
};

export type ChatMessageNotificationType = {
  __typename?: 'ChatMessageNotificationType';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isAnonymous?: Maybe<Scalars['Boolean']['output']>;
  isSeen: Scalars['Boolean']['output'];
  messageType: Scalars['String']['output'];
  recipientUserId?: Maybe<Scalars['String']['output']>;
  roomName: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  senderAnonymousId?: Maybe<Scalars['String']['output']>;
  senderEmail?: Maybe<Scalars['String']['output']>;
  senderPhone?: Maybe<Scalars['String']['output']>;
  senderProfileImage?: Maybe<Scalars['String']['output']>;
  senderUserId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type ChatMessageType = {
  __typename?: 'ChatMessageType';
  content: Scalars['String']['output'];
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  fileUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isAnonymous?: Maybe<Scalars['Boolean']['output']>;
  isSeen?: Maybe<Scalars['Boolean']['output']>;
  recipientUserId?: Maybe<Scalars['String']['output']>;
  roomName: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  senderAnonymousId?: Maybe<Scalars['String']['output']>;
  senderEmail?: Maybe<Scalars['String']['output']>;
  senderPhone?: Maybe<Scalars['String']['output']>;
  senderUserId?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  userName: Scalars['String']['output'];
};

export type CheckEmailExistsInput = {
  clientId: Scalars['String']['input'];
  email: Scalars['String']['input'];
};

export type ClassificationGroup = {
  __typename?: 'ClassificationGroup';
  groupName: Scalars['String']['output'];
  itemCount: Scalars['Int']['output'];
};

export type ClassificationGroupsResponse = {
  __typename?: 'ClassificationGroupsResponse';
  groups?: Maybe<Array<ClassificationGroup>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ClassificationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  group: Scalars['String']['input'];
  item: Scalars['String']['input'];
};

export type ClassificationItem = {
  __typename?: 'ClassificationItem';
  description?: Maybe<Scalars['String']['output']>;
  group: Scalars['String']['output'];
  item: Scalars['String']['output'];
};

export type ClassificationItemsResponse = {
  __typename?: 'ClassificationItemsResponse';
  items?: Maybe<Array<ClassificationItem>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type ClassificationMutationResponse = {
  __typename?: 'ClassificationMutationResponse';
  item?: Maybe<ClassificationItem>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ClientDocumentConfigType = {
  __typename?: 'ClientDocumentConfigType';
  Id: Scalars['String']['output'];
  abnNumber?: Maybe<Scalars['String']['output']>;
  branchId: Scalars['String']['output'];
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Array<Scalars['String']['output']>>;
  isActive: Scalars['Boolean']['output'];
  role?: Maybe<Array<Scalars['String']['output']>>;
  userId?: Maybe<Array<Scalars['String']['output']>>;
};

export type ClientSubscriptionType = {
  __typename?: 'ClientSubscriptionType';
  billingPeriod: Scalars['String']['output'];
  clientId: Scalars['String']['output'];
  clientName: Scalars['String']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  organizationName?: Maybe<Scalars['String']['output']>;
  packName?: Maybe<Scalars['String']['output']>;
  packageDisplayName: Scalars['String']['output'];
  packageName: Scalars['String']['output'];
  paymentMethod?: Maybe<Scalars['String']['output']>;
  startDate: Scalars['String']['output'];
  status: Scalars['String']['output'];
  subscribedDiscount: Scalars['String']['output'];
  subscribedPrice: Scalars['String']['output'];
};

export enum CommentReaction {
  Dislike = 'DISLIKE',
  Like = 'LIKE',
  None = 'NONE'
}

export type ConfigData = {
  __typename?: 'ConfigData';
  data?: Maybe<Array<Scalars['String']['output']>>;
  name: Scalars['String']['output'];
};

export type ConnectionsResponse = {
  __typename?: 'ConnectionsResponse';
  connections: Array<QuickBooksConnectionType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ContactFormSubmissionType = {
  __typename?: 'ContactFormSubmissionType';
  businessEmail: Scalars['String']['output'];
  companyName: Scalars['String']['output'];
  companySize: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  roleJobTitle: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ConversationType = {
  __typename?: 'ConversationType';
  lastMessage?: Maybe<ChatMessageType>;
  lastTimestamp?: Maybe<Scalars['String']['output']>;
  messageCount: Scalars['Int']['output'];
  otherUserId: Scalars['String']['output'];
};

export type ConvertTrialInput = {
  billingPeriod: Scalars['String']['input'];
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type CountryResponse = {
  __typename?: 'CountryResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CountryType = {
  __typename?: 'CountryType';
  code: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CreateAiPromptInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  industryId?: InputMaybe<Scalars['String']['input']>;
  promptKey: Scalars['String']['input'];
  promptText: Scalars['String']['input'];
};

export type CreateAdminUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateContactFormInput = {
  businessEmail: Scalars['String']['input'];
  companyName: Scalars['String']['input'];
  companySize: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  message: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  roleJobTitle: Scalars['String']['input'];
};

export type CreateCountryInput = {
  code: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateFaqInput = {
  answer: Scalars['String']['input'];
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question: Scalars['String']['input'];
};

export type CreateFeatureInput = {
  description: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  featureType: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateIndustryInput = {
  description: Scalars['String']['input'];
};

export type CreateLineItemAllocationInput = {
  customerId: Scalars['String']['input'];
  invoiceId: Scalars['String']['input'];
  invoiceLineItemId: Scalars['String']['input'];
  jobProject?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  quantityAllocated: Scalars['Float']['input'];
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  unitPrice?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateManualCostInput = {
  customerId: Scalars['String']['input'];
  description: Scalars['String']['input'];
  invoiceId?: InputMaybe<Scalars['String']['input']>;
  jobProject?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
  totalAmount?: InputMaybe<Scalars['Float']['input']>;
  unitPrice: Scalars['Float']['input'];
};

export type CreatePackageInput = {
  currency?: Scalars['String']['input'];
  description: Scalars['String']['input'];
  discountPercentage?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  isCustom?: InputMaybe<Scalars['Boolean']['input']>;
  maxUsers: Scalars['String']['input'];
  monthlyPrice: Scalars['String']['input'];
  name: Scalars['String']['input'];
  storageGb: Scalars['String']['input'];
  trialDurationDays?: InputMaybe<Scalars['Int']['input']>;
  trialEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  yearlyPrice: Scalars['String']['input'];
};

export type CreateQuoteRequestFormInput = {
  companyName: Scalars['String']['input'];
  companySize: QuoteRequestCompanySize;
  emailAddress: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  industry: Scalars['String']['input'];
  monthlyInvoiceVolume: Scalars['String']['input'];
  numberOfBranchesLocations?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type CreateRoleInput = {
  description: Scalars['String']['input'];
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  permissions: Array<Scalars['String']['input']>;
};

export type CreateSubscriptionCheckoutInput = {
  billingPeriod: Scalars['String']['input'];
  businessNumber?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  industryId?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  organizationName: Scalars['String']['input'];
  packageId: Scalars['String']['input'];
  paymentMethodId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  trialDays?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateTaxRateInput = {
  countryId: Scalars['String']['input'];
  taxRatePercent: Scalars['Float']['input'];
};

export type CreateTempUserWorkflowResult = {
  __typename?: 'CreateTempUserWorkflowResult';
  documentId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  taskId?: Maybe<Scalars['String']['output']>;
  tempUserId?: Maybe<Scalars['String']['output']>;
  workflowInstanceId?: Maybe<Scalars['String']['output']>;
};

export type CreateToleranceRuleInput = {
  action: Scalars['String']['input'];
  basedOn: Scalars['String']['input'];
  calculationMethod?: InputMaybe<Scalars['String']['input']>;
  operator: Scalars['String']['input'];
  purchaseType: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type CreateUserCheckoutInput = {
  billingPeriod: PaymentMethodEnum;
  packageId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CurrentUsageType = {
  __typename?: 'CurrentUsageType';
  storageUsedGb: Scalars['String']['output'];
  userCount: Scalars['String']['output'];
};

export type CustomFeatureSelectionInput = {
  featureId: Scalars['String']['input'];
  limitationValue: Scalars['String']['input'];
  numericLimit?: InputMaybe<Scalars['String']['input']>;
};

export type CustomFeatureType = {
  __typename?: 'CustomFeatureType';
  featureDisplayName: Scalars['String']['output'];
  featureId: Scalars['String']['output'];
  featureName: Scalars['String']['output'];
  limitationValue: Scalars['String']['output'];
  numericLimit?: Maybe<Scalars['String']['output']>;
};

export type CustomerInvoiceType = {
  __typename?: 'CustomerInvoiceType';
  amountExclGst: Scalars['String']['output'];
  billingEmail: Scalars['String']['output'];
  billingPeriod: Scalars['String']['output'];
  billingPeriodEnd?: Maybe<Scalars['String']['output']>;
  billingPeriodStart?: Maybe<Scalars['String']['output']>;
  businessNumber?: Maybe<Scalars['String']['output']>;
  clientId: Scalars['String']['output'];
  clientName: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  dueDate: Scalars['String']['output'];
  gstAmount: Scalars['String']['output'];
  gstRate: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invoiceDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationName?: Maybe<Scalars['String']['output']>;
  packageId?: Maybe<Scalars['String']['output']>;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  subscriptionId?: Maybe<Scalars['String']['output']>;
  subscriptionPlan: Scalars['String']['output'];
  totalAmount: Scalars['String']['output'];
};

export type DecryptedFileResponse = {
  __typename?: 'DecryptedFileResponse';
  content?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteDocumentResult = {
  __typename?: 'DeleteDocumentResult';
  deleted: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteEmailResponse = {
  __typename?: 'DeleteEmailResponse';
  deletedCount?: Maybe<Scalars['Int']['output']>;
  failedCount?: Maybe<Scalars['Int']['output']>;
  failedIds?: Maybe<Array<Scalars['String']['output']>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteMessageResult = {
  __typename?: 'DeleteMessageResult';
  deletedCount?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  failedCount?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type DeleteSharedDocumentResult = {
  __typename?: 'DeleteSharedDocumentResult';
  deleted: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type DeleteVendorStatementReconciliationNoteInput = {
  index: Scalars['Int']['input'];
};

export type DemoRequestInput = {
  companyName: Scalars['String']['input'];
  contactPerson: Scalars['String']['input'];
  email: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type DemoRequestListResponse = {
  __typename?: 'DemoRequestListResponse';
  leads: Array<DemoRequestType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type DemoRequestResponse = {
  __typename?: 'DemoRequestResponse';
  message: Scalars['String']['output'];
  requestId?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DemoRequestType = {
  __typename?: 'DemoRequestType';
  companyName: Scalars['String']['output'];
  contactPerson: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type DocumentBulkMoveInput = {
  fileLinkIds: Array<Scalars['String']['input']>;
  newFolderId: Scalars['String']['input'];
};

export type DocumentBulkMoveResult = {
  __typename?: 'DocumentBulkMoveResult';
  failed: Array<DocumentMoveFailedItem>;
  failedCount: Scalars['Int']['output'];
  successCount: Scalars['Int']['output'];
  successful: Array<DocumentMoveSuccessItem>;
};

export type DocumentComment = {
  __typename?: 'DocumentComment';
  commentText: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  dislikeCount: Scalars['Int']['output'];
  dislikedBy: Array<Scalars['String']['output']>;
  documentName?: Maybe<Scalars['String']['output']>;
  documentStatus?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  editedAt?: Maybe<Scalars['String']['output']>;
  editedBy?: Maybe<Scalars['String']['output']>;
  externalMentions: Array<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  internalMentions: Array<Scalars['String']['output']>;
  isEdited: Scalars['Boolean']['output'];
  likeCount: Scalars['Int']['output'];
  likedBy: Array<Scalars['String']['output']>;
  pageNumber?: Maybe<Scalars['Int']['output']>;
  parentCommentId?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  replies: Array<DocumentComment>;
  updatedAt: Scalars['String']['output'];
  userEmail: Scalars['String']['output'];
  userHasDisliked: Scalars['Boolean']['output'];
  userHasLiked: Scalars['Boolean']['output'];
  userId: Scalars['String']['output'];
  userName: Scalars['String']['output'];
  xCoords?: Maybe<Scalars['Float']['output']>;
  yCoords?: Maybe<Scalars['Float']['output']>;
};

export type DocumentCommentNotification = {
  __typename?: 'DocumentCommentNotification';
  clientId?: Maybe<Scalars['String']['output']>;
  commentId: Scalars['String']['output'];
  commentText: Scalars['String']['output'];
  commenterName: Scalars['String']['output'];
  commenterProfileImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  documentCreatedAt?: Maybe<Scalars['String']['output']>;
  documentName?: Maybe<Scalars['String']['output']>;
  documentStatus?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  documentUrl: Scalars['String']['output'];
  fileLinkId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isSeen: Scalars['Boolean']['output'];
  notificationMessage?: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  taggedUsers: Array<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
  workflowInstanceId?: Maybe<Scalars['String']['output']>;
};

export type DocumentMoveFailedItem = {
  __typename?: 'DocumentMoveFailedItem';
  error: Scalars['String']['output'];
  fileLinkId: Scalars['String']['output'];
};

export type DocumentMoveInput = {
  fileLinkId: Scalars['String']['input'];
  newFolderId: Scalars['String']['input'];
};

export type DocumentMoveResult = {
  __typename?: 'DocumentMoveResult';
  document?: Maybe<FileLink>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DocumentMoveSuccessItem = {
  __typename?: 'DocumentMoveSuccessItem';
  fileLinkId: Scalars['String']['output'];
  s3Urls: Scalars['String']['output'];
};

export type DocumentShareNotification = {
  __typename?: 'DocumentShareNotification';
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  documentName?: Maybe<Scalars['String']['output']>;
  documentStatus?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  documentUrl: Scalars['String']['output'];
  fileLinkId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isSeen: Scalars['Boolean']['output'];
  notificationMessage?: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  sharedByName: Scalars['String']['output'];
  sharedByProfileImage?: Maybe<Scalars['String']['output']>;
  sharedByUserId: Scalars['String']['output'];
  workflowInstanceId?: Maybe<Scalars['String']['output']>;
};

export type DocumentTrackingResultType = {
  __typename?: 'DocumentTrackingResultType';
  completedCount: Scalars['Int']['output'];
  documents: Array<DocumentTrackingType>;
  inProgressCount: Scalars['Int']['output'];
  noWorkflowCount: Scalars['Int']['output'];
  onHoldCount: Scalars['Int']['output'];
  page?: Maybe<Scalars['Int']['output']>;
  pageSize?: Maybe<Scalars['Int']['output']>;
  pendingCount: Scalars['Int']['output'];
  rejectedCount?: Maybe<Scalars['Int']['output']>;
  stageCount?: Maybe<Scalars['JSON']['output']>;
  totalAmount?: Maybe<Scalars['Float']['output']>;
  totalDocuments: Scalars['Int']['output'];
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type DocumentTrackingType = {
  __typename?: 'DocumentTrackingType';
  amount?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  commentCount?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['String']['output'];
  currentStageName?: Maybe<Scalars['String']['output']>;
  currentStageType?: Maybe<Scalars['String']['output']>;
  documentHighLevelType?: Maybe<Scalars['String']['output']>;
  documentName?: Maybe<Scalars['String']['output']>;
  documentStatus?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  extraData?: Maybe<Scalars['JSON']['output']>;
  fileFormat?: Maybe<Scalars['String']['output']>;
  fileLinkId: Scalars['String']['output'];
  folderId: Scalars['String']['output'];
  googleDriveUploaded: Scalars['Boolean']['output'];
  googleDriveUrl?: Maybe<Scalars['String']['output']>;
  history?: Maybe<Array<Scalars['JSON']['output']>>;
  id: Scalars['String']['output'];
  invoiceDataId: Scalars['String']['output'];
  invoiceId?: Maybe<Scalars['String']['output']>;
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  isMappingConfirmed?: Maybe<Scalars['Boolean']['output']>;
  issueDate?: Maybe<Scalars['String']['output']>;
  nextStage?: Maybe<Scalars['String']['output']>;
  orgName?: Maybe<Scalars['String']['output']>;
  reconciled: Scalars['Boolean']['output'];
  s3Url?: Maybe<Scalars['String']['output']>;
  s3Urls: Scalars['String']['output'];
  stageType?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  updatedAt: Scalars['String']['output'];
  uploadedByDetails?: Maybe<Scalars['JSON']['output']>;
  vendor?: Maybe<Scalars['String']['output']>;
  wfStageStatus?: Maybe<Scalars['String']['output']>;
  workFlowStatus?: Maybe<Scalars['String']['output']>;
  workflowDocumentInstanceId?: Maybe<Scalars['String']['output']>;
  workflowName?: Maybe<Scalars['String']['output']>;
  workflowStatus: Scalars['String']['output'];
};

export type DocumentType = {
  __typename?: 'DocumentType';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type DocumentTypePreference = {
  __typename?: 'DocumentTypePreference';
  documentTypeId: Scalars['String']['output'];
  preferred: Scalars['Boolean']['output'];
};

export type DocumentTypePreferenceInput = {
  documentTypeId: Scalars['String']['input'];
  preferred: Scalars['Boolean']['input'];
};

export type EmailApprovalTokenResult = {
  __typename?: 'EmailApprovalTokenResult';
  approveUrl?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  rejectUrl?: Maybe<Scalars['String']['output']>;
};

export type EmailAttachmentType = {
  __typename?: 'EmailAttachmentType';
  contentType: Scalars['String']['output'];
  documentStatus?: Maybe<Scalars['String']['output']>;
  extractionStatus?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  s3Url?: Maybe<Scalars['String']['output']>;
  size: Scalars['Int']['output'];
  workflowStatus?: Maybe<Scalars['String']['output']>;
};

export type EmailExistsResponse = {
  __typename?: 'EmailExistsResponse';
  exists: Scalars['Boolean']['output'];
};

export type EmailListResponse = {
  __typename?: 'EmailListResponse';
  emails: Array<EmailType>;
  totalCount: Scalars['Int']['output'];
};

export type EmailNotificationType = {
  __typename?: 'EmailNotificationType';
  branchId?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  emailDate?: Maybe<Scalars['String']['output']>;
  fromEmail?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  subject?: Maybe<Scalars['String']['output']>;
  toEmails: Array<Scalars['String']['output']>;
};

export type EmailType = {
  __typename?: 'EmailType';
  attachments: Array<EmailAttachmentType>;
  bccEmails: Array<Scalars['String']['output']>;
  body: Scalars['String']['output'];
  bodyHtml?: Maybe<Scalars['String']['output']>;
  branchEmail: Scalars['String']['output'];
  branchId: Scalars['String']['output'];
  ccEmails: Array<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  emailDate: Scalars['String']['output'];
  fromEmail: Scalars['String']['output'];
  hasAttachments: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  messageId?: Maybe<Scalars['String']['output']>;
  replyTo?: Maybe<Scalars['String']['output']>;
  subject: Scalars['String']['output'];
  toEmails: Array<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ExpenseTrendsResponse = {
  __typename?: 'ExpenseTrendsResponse';
  averageMonthlyExpense: Scalars['Float']['output'];
  currentYearExpense: Scalars['Float']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  numberOfMonths: Scalars['Int']['output'];
  period: Scalars['String']['output'];
  periodBreakdown: Array<PeriodBreakdown>;
  previousYearExpense?: Maybe<Scalars['Float']['output']>;
  success: Scalars['Boolean']['output'];
  totalExpenses: Scalars['Float']['output'];
  yoyGrowth?: Maybe<Scalars['Float']['output']>;
};

export type ExpensesByCategoryResponse = {
  __typename?: 'ExpensesByCategoryResponse';
  categories: Array<CategoryExpense>;
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  period: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  totalCategories: Scalars['Int']['output'];
  totalExpenses: Scalars['Float']['output'];
};

export type ExpensesBySupplierResponse = {
  __typename?: 'ExpensesBySupplierResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  period: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  suppliers: Array<SupplierExpense>;
  totalExpenses: Scalars['Float']['output'];
  totalSuppliers: Scalars['Int']['output'];
};

export type ExtractVendorStatementInput = {
  file: Scalars['Upload']['input'];
  useAi?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ExtractVendorStatementLineType = {
  __typename?: 'ExtractVendorStatementLineType';
  amount: Scalars['Float']['output'];
  invoiceDate: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
};

export type ExtractVendorStatementResponse = {
  __typename?: 'ExtractVendorStatementResponse';
  error?: Maybe<Scalars['String']['output']>;
  fromDate?: Maybe<Scalars['String']['output']>;
  statementLines: Array<ExtractVendorStatementLineType>;
  success: Scalars['Boolean']['output'];
  toDate?: Maybe<Scalars['String']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type FaqListResponse = {
  __typename?: 'FAQListResponse';
  items: Array<FaqType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type FaqMutationResponse = {
  __typename?: 'FAQMutationResponse';
  faq?: Maybe<FaqType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FaqType = {
  __typename?: 'FAQType';
  answer: Scalars['String']['output'];
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  question: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type FailedBranchOperationResult = {
  __typename?: 'FailedBranchOperationResult';
  branch?: Maybe<FailedBranchType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FailedBranchSearchInput = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type FailedBranchType = {
  __typename?: 'FailedBranchType';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data: Scalars['JSON']['output'];
  id: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type FeatureLimitationType = {
  __typename?: 'FeatureLimitationType';
  featureDescription?: Maybe<Scalars['String']['output']>;
  featureDisplayName: Scalars['String']['output'];
  featureId: Scalars['String']['output'];
  featureName: Scalars['String']['output'];
  isIncluded: Scalars['Boolean']['output'];
  limitationType?: Maybe<Scalars['String']['output']>;
  limitationValue?: Maybe<Scalars['String']['output']>;
  numericLimit?: Maybe<Scalars['Int']['output']>;
};

export type FeatureType = {
  __typename?: 'FeatureType';
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  featureType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type FeatureWithLimitationsType = {
  __typename?: 'FeatureWithLimitationsType';
  coreLimitation?: Maybe<Scalars['String']['output']>;
  customLimitation?: Maybe<Scalars['String']['output']>;
  feature: FeatureType;
  liteLimitation?: Maybe<Scalars['String']['output']>;
  plusLimitation?: Maybe<Scalars['String']['output']>;
};

export type File = {
  __typename?: 'File';
  id: Scalars['String']['output'];
  invoiceDataId?: Maybe<Scalars['String']['output']>;
  s3Urls: Scalars['String']['output'];
};

export type FileLink = {
  __typename?: 'FileLink';
  createdAt?: Maybe<Scalars['String']['output']>;
  folderId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invoiceDataId?: Maybe<Scalars['String']['output']>;
  s3Urls: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type FileLinkDataResponse = {
  __typename?: 'FileLinkDataResponse';
  error?: Maybe<Scalars['String']['output']>;
  fileLinkData?: Maybe<FileLinkDataType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FileLinkDataType = {
  __typename?: 'FileLinkDataType';
  businessName?: Maybe<Scalars['String']['output']>;
  businessStatus?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  duplicateData?: Maybe<Scalars['Boolean']['output']>;
  folderId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invoiceDate?: Maybe<Scalars['String']['output']>;
  s3Urls?: Maybe<Scalars['String']['output']>;
  statusEffectiveFrom?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type FileLinkPermissions = {
  __typename?: 'FileLinkPermissions';
  canComment: Scalars['Boolean']['output'];
  canView: Scalars['Boolean']['output'];
};

export type FileLinkWithComments = {
  __typename?: 'FileLinkWithComments';
  comments: Array<DocumentComment>;
  documentCommentsId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invoiceDataId?: Maybe<Scalars['String']['output']>;
  permissions: FileLinkPermissions;
  s3Urls: Array<Scalars['String']['output']>;
  workflowStatus: Scalars['String']['output'];
};

export type FileUploadInput = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  files: Array<Scalars['Upload']['input']>;
  folderId?: InputMaybe<Scalars['String']['input']>;
};

export type FileUploadResponse = {
  __typename?: 'FileUploadResponse';
  branchId?: Maybe<Scalars['String']['output']>;
  duplicateCount?: Maybe<Scalars['Int']['output']>;
  duplicateFiles?: Maybe<Array<Scalars['String']['output']>>;
  folderId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  taskIds?: Maybe<Array<Scalars['String']['output']>>;
  uploadedCount?: Maybe<Scalars['Int']['output']>;
  uploadedFiles?: Maybe<Array<Scalars['String']['output']>>;
};

export type FileUploadResult = {
  __typename?: 'FileUploadResult';
  error?: Maybe<Scalars['String']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  s3Url?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export enum FinanceSystemEnum {
  Myob = 'MYOB',
  Quickbooks = 'QUICKBOOKS',
  Xero = 'XERO'
}

export type FinancialYearBoundary = {
  __typename?: 'FinancialYearBoundary';
  day: Scalars['Int']['output'];
  month: Scalars['Int']['output'];
};

export type FinancialYearBoundaryInput = {
  day: Scalars['Int']['input'];
  month: Scalars['Int']['input'];
};

export type FinancialYearConfig = {
  __typename?: 'FinancialYearConfig';
  format: Scalars['String']['output'];
  from: FinancialYearBoundary;
  to: FinancialYearBoundary;
};

export type FinancialYearInput = {
  format: Scalars['String']['input'];
  from: FinancialYearBoundaryInput;
  to: FinancialYearBoundaryInput;
};

export type Folder = {
  __typename?: 'Folder';
  branchId: Scalars['String']['output'];
  children: Array<Folder>;
  createdAt?: Maybe<Scalars['String']['output']>;
  files: Array<File>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isDefault: Scalars['Boolean']['output'];
  itemCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ownerId: Scalars['String']['output'];
  parentFolderId?: Maybe<Scalars['String']['output']>;
  tags: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type FolderBulkMoveInput = {
  folderIds: Array<Scalars['String']['input']>;
  newBranchId?: InputMaybe<Scalars['String']['input']>;
  newParentFolderId?: InputMaybe<Scalars['String']['input']>;
};

export type FolderBulkMoveResult = {
  __typename?: 'FolderBulkMoveResult';
  failed: Array<FolderMoveFailedItem>;
  failedCount: Scalars['Int']['output'];
  successCount: Scalars['Int']['output'];
  successful: Array<FolderMoveSuccessItem>;
};

export type FolderMoveFailedItem = {
  __typename?: 'FolderMoveFailedItem';
  error: Scalars['String']['output'];
  folderId: Scalars['String']['output'];
};

export type FolderMoveInput = {
  folderId: Scalars['String']['input'];
  newBranchId?: InputMaybe<Scalars['String']['input']>;
  newParentFolderId?: InputMaybe<Scalars['String']['input']>;
};

export type FolderMoveResult = {
  __typename?: 'FolderMoveResult';
  folder?: Maybe<Folder>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type FolderMoveSuccessItem = {
  __typename?: 'FolderMoveSuccessItem';
  folderId: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type FolderTemplate = {
  __typename?: 'FolderTemplate';
  assignedBranches: Array<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  financialYear?: Maybe<FinancialYearConfig>;
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  root: FolderTemplateNode;
  tree: Scalars['JSON']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type FolderTemplateCreateInput = {
  assignedBranches?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  financialYear?: InputMaybe<FinancialYearInput>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  root: FolderTemplateNodeInput;
};

export type FolderTemplateNode = {
  __typename?: 'FolderTemplateNode';
  children: Array<FolderTemplateNode>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type FolderTemplateNodeDefinition = {
  __typename?: 'FolderTemplateNodeDefinition';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type FolderTemplateNodeInput = {
  children?: InputMaybe<Array<FolderTemplateNodeInput>>;
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type FolderTemplatePayload = {
  __typename?: 'FolderTemplatePayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  template?: Maybe<FolderTemplate>;
};

export type FolderTemplateUpdateInput = {
  assignedBranches?: InputMaybe<Array<Scalars['String']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  financialYear?: InputMaybe<FinancialYearInput>;
  id: Scalars['String']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  root?: InputMaybe<FolderTemplateNodeInput>;
};

export type FolderType = {
  __typename?: 'FolderType';
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type GenerateInvoiceInput = {
  amountExclGst?: InputMaybe<Scalars['String']['input']>;
  billingPeriodEnd?: InputMaybe<Scalars['String']['input']>;
  billingPeriodStart?: InputMaybe<Scalars['String']['input']>;
  clientId: Scalars['String']['input'];
  gstRate?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  subscriptionId?: InputMaybe<Scalars['String']['input']>;
};

export type GenericBoolResponse = {
  __typename?: 'GenericBoolResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GenericResponse = {
  __typename?: 'GenericResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IndustryResponse = {
  __typename?: 'IndustryResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type IndustryType = {
  __typename?: 'IndustryType';
  createdAt?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type InvoiceActionResponse = {
  __typename?: 'InvoiceActionResponse';
  invoice?: Maybe<CustomerInvoiceType>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type InvoiceLineInput = {
  amount: Scalars['Float']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  itemId: Scalars['String']['input'];
};

export enum InvoiceLineItemStatusEnum {
  Allocated = 'allocated',
  Partial = 'partial',
  Unallocated = 'unallocated'
}

export type InvoiceLineItemType = {
  __typename?: 'InvoiceLineItemType';
  allocatedQuantity: Scalars['Float']['output'];
  allocations: Array<LineItemAllocationSummaryType>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invoiceDate?: Maybe<Scalars['String']['output']>;
  invoiceId: Scalars['String']['output'];
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  jobProjects: Array<Scalars['String']['output']>;
  outstandingAmount: Scalars['Float']['output'];
  productCode?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  remainingQuantity: Scalars['Float']['output'];
  status: InvoiceLineItemStatusEnum;
  totalAmount: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type InvoiceStatusCountType = {
  __typename?: 'InvoiceStatusCountType';
  cancelled: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  overdue: Scalars['Int']['output'];
  paid: Scalars['Int']['output'];
  sent: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  void: Scalars['Int']['output'];
};

export type InvoiceUploadInviteType = {
  __typename?: 'InvoiceUploadInviteType';
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  inviteUuid?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
};

export type LikeDislikeCommentResult = {
  __typename?: 'LikeDislikeCommentResult';
  comment?: Maybe<DocumentComment>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type LineItemAllocationSummaryType = {
  __typename?: 'LineItemAllocationSummaryType';
  customerId: Scalars['String']['output'];
  customerName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  jobProject?: Maybe<Scalars['String']['output']>;
  quantityAllocated: Scalars['Float']['output'];
};

export type LineItemAllocationType = {
  __typename?: 'LineItemAllocationType';
  createdAt?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['String']['output'];
  customerName: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invoiceId: Scalars['String']['output'];
  invoiceLineItemId?: Maybe<Scalars['String']['output']>;
  isManualCost: Scalars['Boolean']['output'];
  jobProject?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  quantityAllocated: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type LineItemAllocationsResponse = {
  __typename?: 'LineItemAllocationsResponse';
  itemCount: Scalars['Int']['output'];
  items: Array<LineItemAllocationType>;
  totalAmount: Scalars['Float']['output'];
  totalQuantityAllocated: Scalars['Float']['output'];
};

export type ListTagsResponse = {
  __typename?: 'ListTagsResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  tags: Array<Scalars['String']['output']>;
};

export type MyobAccountType = {
  __typename?: 'MYOBAccountType';
  accountType: Scalars['String']['output'];
  accountUid: Scalars['String']['output'];
  classification?: Maybe<Scalars['String']['output']>;
  currentBalance?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  displayId: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isHeader: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  openingBalance?: Maybe<Scalars['Float']['output']>;
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MyobClassGroup = {
  __typename?: 'MYOBClassGroup';
  accounts: Array<MyobFormattedAccount>;
  className: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type MyobConnectionType = {
  __typename?: 'MYOBConnectionType';
  authMethod: Scalars['String']['output'];
  companyFileId: Scalars['String']['output'];
  companyFileName: Scalars['String']['output'];
  connectionId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  lastSyncAt?: Maybe<Scalars['DateTime']['output']>;
  scopes: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tokenExpired: Scalars['Boolean']['output'];
};

export type MyobFormattedAccount = {
  __typename?: 'MYOBFormattedAccount';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type MyobFormattedAccountSummary = {
  __typename?: 'MYOBFormattedAccountSummary';
  activeAccounts: Scalars['Int']['output'];
  byClass: Array<MyobClassGroup>;
  byStatus: MyobStatusGroup;
  byType: Array<MyobTypeGroup>;
  inactiveAccounts: Scalars['Int']['output'];
  totalAccounts: Scalars['Int']['output'];
};

export type MyobJobLinkedCustomerType = {
  __typename?: 'MYOBJobLinkedCustomerType';
  displayId?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  uri?: Maybe<Scalars['String']['output']>;
};

export type MyobJobParentType = {
  __typename?: 'MYOBJobParentType';
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  uid: Scalars['String']['output'];
  uri?: Maybe<Scalars['String']['output']>;
};

export type MyobJobType = {
  __typename?: 'MYOBJobType';
  description?: Maybe<Scalars['String']['output']>;
  displayId: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  jobUid: Scalars['String']['output'];
  linkedCustomer?: Maybe<MyobJobLinkedCustomerType>;
  name: Scalars['String']['output'];
  parentJob?: Maybe<MyobJobParentType>;
  parentJobUid?: Maybe<Scalars['String']['output']>;
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MyobStatusGroup = {
  __typename?: 'MYOBStatusGroup';
  ACTIVE: Scalars['Int']['output'];
  INACTIVE: Scalars['Int']['output'];
};

export type MyobSupplierType = {
  __typename?: 'MYOBSupplierType';
  abn?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  displayId: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  supplierUid: Scalars['String']['output'];
  syncedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type MyobTypeGroup = {
  __typename?: 'MYOBTypeGroup';
  accounts: Array<MyobFormattedAccount>;
  classField: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  typeName: Scalars['String']['output'];
};

export type MarkEmailAsReadResponse = {
  __typename?: 'MarkEmailAsReadResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptStage: AcceptStageResult;
  addComment: AddCommentResult;
  addTagsToFileLink: Scalars['JSON']['output'];
  assignPackageToUser: UserSubscriptionType;
  assignUserToBranch: AssignUserToBranchResponse;
  bulkMoveDocuments: DocumentBulkMoveResult;
  bulkMoveFolders: FolderBulkMoveResult;
  cancelSubscription: Scalars['Boolean']['output'];
  cancelTrial: TrialActionResponse;
  changePassword: GenericResponse;
  changeSubscriptionPackage: SubscriptionActionResponse;
  changeSubscriptionPlan: SubscriptionActionResponse;
  checkUserInCurrentStage: UserInStageCheckResult;
  cleanupDuplicateXeroConnections: XeroCleanupResponse;
  confirmMappings: GenericResponse;
  convertTrialToPaid: TrialActionResponse;
  createAdminUser: AdminUserResponse;
  createAiPrompt: AiPromptType;
  createClassification: ClassificationMutationResponse;
  createContactFormSubmission: ContactFormSubmissionType;
  createCountry: CountryResponse;
  createCustomPackage: UserSubscriptionType;
  createFaq: FaqMutationResponse;
  createFeature: FeatureType;
  createFolderTemplate: FolderTemplatePayload;
  createIndustry: IndustryType;
  createLineItemAllocation: AllocationResponse;
  createLineItemAllocationsBulk: AllocationBulkResponse;
  createManualCost: AllocationResponse;
  createOrUpdateTags: Scalars['JSON']['output'];
  createPackage: PackageType;
  createQuickbooksBill: TransactionResponse;
  createQuickbooksInvoice: TransactionResponse;
  createQuoteRequestFormSubmission: QuoteRequestFormResponse;
  createRole: RoleResponse;
  createSubscriptionCheckout: SubscriptionCheckoutResponse;
  createTaxRate: TaxRateResponse;
  createTempUserWorkflow: CreateTempUserWorkflowResult;
  createToleranceRule: ToleranceRuleType;
  createUser: UserType;
  createUserCheckout: UserCheckoutResponse;
  createXeroConnection: XeroConnectionResponse;
  createXeroMapping: Scalars['JSON']['output'];
  createXeroVendorContact: XeroContactResponse;
  deleteAdminUser: GenericResponse;
  deleteAiPrompt: AiPromptResponse;
  deleteClassification: ClassificationMutationResponse;
  deleteCountry: CountryResponse;
  deleteDocument: DeleteDocumentResult;
  deleteDocumentCommentNotification: NotificationResult;
  deleteDocumentConfiguration: Scalars['Boolean']['output'];
  deleteEmail: DeleteEmailResponse;
  deleteFaq: FaqMutationResponse;
  deleteFolderTemplate: FolderTemplatePayload;
  deleteIndustry: IndustryResponse;
  deleteMessage: DeleteMessageResult;
  deleteMessages: DeleteMessageResult;
  deleteNotification: NotificationResult;
  deleteRole: GenericResponse;
  deleteSharedDocument: DeleteSharedDocumentResult;
  deleteSubscription: SubscriptionActionResponse;
  deleteTags: Scalars['JSON']['output'];
  deleteTaxRate: TaxRateResponse;
  deleteToleranceRule: GenericBoolResponse;
  deleteVendorStatementReconciliationNote: GenericResponse;
  disconnectMyob: MyObStatusResponse;
  disconnectQuickbooks: StatusResponse;
  disconnectXeroConnection: XeroConnectionResponse;
  documentConfiguration: Scalars['Boolean']['output'];
  editSubscription: SubscriptionActionResponse;
  enableGoogleDriveForUser: GenericResponse;
  extractVendorStatement: ExtractVendorStatementResponse;
  forgotPassword: GenericResponse;
  generateEmailApprovalTokens: EmailApprovalTokenResult;
  generateInvoice: InvoiceActionResponse;
  generateOrgCode: Scalars['String']['output'];
  getPaymentMethods: Array<PaymentMethodType>;
  initiateMyobOauth: MyOboAuthResponse;
  initiateQuickbooksOauth: OAuthResponse;
  initiateXeroOauth: XeroOAuthResponse;
  markAllDocumentCommentNotificationsSeen: NotificationResult;
  markAllMessagesAsSeen: SendMessageResult;
  markDocumentCommentNotificationSeen: NotificationResult;
  markEmailAsRead: MarkEmailAsReadResponse;
  markMessageAsSeen: SendMessageResult;
  markNotificationSeen: Scalars['Boolean']['output'];
  moveDocument: DocumentMoveResult;
  moveFolder: FolderMoveResult;
  processStageAction: ProcessStageActionResult;
  reconcileVendorStatement: VendorStatementReconciliationResponse;
  refreshMyobToken: MyObStatusResponse;
  refreshXeroToken: XeroConnectionResponse;
  regenerateGoogleDriveSecretKey: SecretKeyRotationResult;
  rejectStage: RejectStageResult;
  removeAllocations: AllocationBulkResponse;
  removePackageFeatureLimitation: Scalars['Boolean']['output'];
  removeUserBranchAssignment: RemoveUserBranchAssignmentResponse;
  repredictExpenseAccounts: Scalars['JSON']['output'];
  resetPassword: GenericResponse;
  restoreDocument: RestoreDocumentResult;
  resumeRejectedStage: ResumeStageResult;
  retryFailedBranch: FailedBranchOperationResult;
  saveAdditionalChargesConfig: AdditionalChargesConfigType;
  sendInvoiceUploadInvite: SendInvoiceUploadInviteResponse;
  sendMessage: SendMessageResult;
  sendMessageWithMentions: SendMessageWithMentionsResult;
  setCommentReaction: LikeDislikeCommentResult;
  setMainAdmin: AdminUserResponse;
  setMyPreferences: Scalars['Boolean']['output'];
  setPackageFeatureLimitation: PackageFeatureLimitationType;
  shareDocument: ShareDocumentResult;
  startTrial: TrialActionResponse;
  submitDemoRequest: DemoRequestResponse;
  submitSubscriptionForm: SubscriptionFormResponse;
  syncAllPackagesWithStripe: Array<StripeSyncResponse>;
  syncMyobAccounts: MyObSyncResponse;
  syncMyobCustomers: MyObSyncResponse;
  syncMyobJobs: MyObSyncResponse;
  syncMyobSuppliers: MyObSyncResponse;
  syncPackageWithStripe: StripeSyncResponse;
  syncQuickbooksData: SyncResponse;
  syncXeroProjects: XeroProjectsResponse;
  testMyobConnection: MyObStatusResponse;
  testXeroConnection: XeroConnectionResponse;
  toggleFeatureStatus: FeatureType;
  togglePackageStatus: PackageType;
  updateAdminUser: AdminUserResponse;
  updateAiPrompt?: Maybe<AiPromptType>;
  updateClassification: ClassificationMutationResponse;
  updateCountry: CountryResponse;
  updateDemoRequestStatus: UpdateDemoRequestStatusResponse;
  updateDocumentConfiguration: Scalars['Boolean']['output'];
  updateExtractedData: Scalars['JSON']['output'];
  updateFailedBranch: FailedBranchOperationResult;
  updateFaq: FaqMutationResponse;
  updateFeature: FeatureType;
  updateFeatureWithLimitations: FeatureType;
  updateFolderTemplate: FolderTemplatePayload;
  updateIndustry?: Maybe<IndustryType>;
  updateInvoiceStatus: InvoiceActionResponse;
  updateNotificationPreference: GenericResponse;
  updatePackage: PackageType;
  updateRole: RoleResponse;
  updateTaxRate: TaxRateResponse;
  updateToleranceRule?: Maybe<ToleranceRuleType>;
  updateUser?: Maybe<UserUpdateResponse>;
  updateUserBranchAssignment: UpdateUserBranchAssignmentResponse;
  updateVendorStatementReconciliationNotes: GenericResponse;
  uploadChatFile: FileUploadResult;
  uploadFile: FileUploadResponse;
  uploadFileViaInvite: FileUploadResponse;
  validateTaxNumber: TaxNumberValidationResponse;
  voidInvoice: InvoiceActionResponse;
};


export type MutationAcceptStageArgs = {
  comments?: InputMaybe<Scalars['String']['input']>;
  instanceId: Scalars['String']['input'];
};


export type MutationAddCommentArgs = {
  commentText: Scalars['String']['input'];
  externalMentions?: InputMaybe<Array<Scalars['String']['input']>>;
  fileLinkId: Scalars['String']['input'];
  internalMentions?: InputMaybe<Array<Scalars['String']['input']>>;
  pageNumber?: InputMaybe<Scalars['Int']['input']>;
  parentCommentId?: InputMaybe<Scalars['String']['input']>;
  xCoords?: InputMaybe<Scalars['Float']['input']>;
  yCoords?: InputMaybe<Scalars['Float']['input']>;
};


export type MutationAddTagsToFileLinkArgs = {
  action?: InputMaybe<Scalars['String']['input']>;
  fileLinkIds: Array<Scalars['String']['input']>;
  tags: Scalars['JSON']['input'];
};


export type MutationAssignPackageToUserArgs = {
  billingPeriod?: Scalars['String']['input'];
  isTrial?: Scalars['Boolean']['input'];
  packageId: Scalars['String']['input'];
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationAssignUserToBranchArgs = {
  input: AssignUserToBranchInput;
};


export type MutationBulkMoveDocumentsArgs = {
  input: DocumentBulkMoveInput;
};


export type MutationBulkMoveFoldersArgs = {
  input: FolderBulkMoveInput;
};


export type MutationCancelSubscriptionArgs = {
  userId: Scalars['String']['input'];
};


export type MutationChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChangeSubscriptionPackageArgs = {
  input: ChangeSubscriptionInput;
  subscriptionId: Scalars['String']['input'];
};


export type MutationChangeSubscriptionPlanArgs = {
  input: ChangeSubscriptionPlanInput;
};


export type MutationCheckUserInCurrentStageArgs = {
  instanceId: Scalars['String']['input'];
};


export type MutationCleanupDuplicateXeroConnectionsArgs = {
  userId: Scalars['String']['input'];
};


export type MutationConfirmMappingsArgs = {
  invoiceData: Scalars['JSON']['input'];
};


export type MutationConvertTrialToPaidArgs = {
  input: ConvertTrialInput;
};


export type MutationCreateAdminUserArgs = {
  input: CreateAdminUserInput;
};


export type MutationCreateAiPromptArgs = {
  input: CreateAiPromptInput;
};


export type MutationCreateClassificationArgs = {
  input: ClassificationInput;
};


export type MutationCreateContactFormSubmissionArgs = {
  input: CreateContactFormInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationCreateCustomPackageArgs = {
  featureSelections: Array<CustomFeatureSelectionInput>;
  userId: Scalars['String']['input'];
};


export type MutationCreateFaqArgs = {
  input: CreateFaqInput;
};


export type MutationCreateFeatureArgs = {
  input: CreateFeatureInput;
};


export type MutationCreateFolderTemplateArgs = {
  input: FolderTemplateCreateInput;
};


export type MutationCreateIndustryArgs = {
  input: CreateIndustryInput;
};


export type MutationCreateLineItemAllocationArgs = {
  input: CreateLineItemAllocationInput;
};


export type MutationCreateLineItemAllocationsBulkArgs = {
  inputs: Array<CreateLineItemAllocationInput>;
};


export type MutationCreateManualCostArgs = {
  input: CreateManualCostInput;
};


export type MutationCreateOrUpdateTagsArgs = {
  tags: Scalars['JSON']['input'];
};


export type MutationCreatePackageArgs = {
  input: CreatePackageInput;
};


export type MutationCreateQuickbooksBillArgs = {
  connectionId: Scalars['String']['input'];
  docNumber?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  lines: Array<BillLineInput>;
  privateNote?: InputMaybe<Scalars['String']['input']>;
  vendorId: Scalars['String']['input'];
};


export type MutationCreateQuickbooksInvoiceArgs = {
  connectionId: Scalars['String']['input'];
  customerId: Scalars['String']['input'];
  docNumber?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['String']['input']>;
  lines: Array<InvoiceLineInput>;
  privateNote?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateQuoteRequestFormSubmissionArgs = {
  input: CreateQuoteRequestFormInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateSubscriptionCheckoutArgs = {
  input: CreateSubscriptionCheckoutInput;
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateTempUserWorkflowArgs = {
  documentId: Scalars['String']['input'];
  email: Scalars['String']['input'];
  workflowInstanceId: Scalars['String']['input'];
};


export type MutationCreateToleranceRuleArgs = {
  input: CreateToleranceRuleInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserCheckoutArgs = {
  input: CreateUserCheckoutInput;
};


export type MutationCreateXeroConnectionArgs = {
  authorizationCode: Scalars['String']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
  tenantId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationCreateXeroMappingArgs = {
  invoiceDataId: Scalars['String']['input'];
};


export type MutationCreateXeroVendorContactArgs = {
  connectionId: Scalars['String']['input'];
  contactInput: XeroContactInput;
};


export type MutationDeleteAdminUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationDeleteAiPromptArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteClassificationArgs = {
  group: Scalars['String']['input'];
  item: Scalars['String']['input'];
};


export type MutationDeleteCountryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDocumentArgs = {
  deleteFromS3?: Scalars['Boolean']['input'];
  documentId: Scalars['String']['input'];
};


export type MutationDeleteDocumentCommentNotificationArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationDeleteDocumentConfigurationArgs = {
  configId: Scalars['String']['input'];
};


export type MutationDeleteEmailArgs = {
  emailId?: InputMaybe<Scalars['String']['input']>;
  emailIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationDeleteFaqArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFolderTemplateArgs = {
  templateId: Scalars['String']['input'];
};


export type MutationDeleteIndustryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMessageArgs = {
  messageId: Scalars['String']['input'];
};


export type MutationDeleteMessagesArgs = {
  messageIds: Array<Scalars['String']['input']>;
};


export type MutationDeleteNotificationArgs = {
  notificationId?: InputMaybe<Scalars['String']['input']>;
  notificationIds?: InputMaybe<Array<Scalars['String']['input']>>;
  notificationType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteRoleArgs = {
  roleId: Scalars['String']['input'];
};


export type MutationDeleteSharedDocumentArgs = {
  sharedDocumentId: Scalars['String']['input'];
};


export type MutationDeleteSubscriptionArgs = {
  subscriptionId: Scalars['String']['input'];
};


export type MutationDeleteTagsArgs = {
  tags: Scalars['JSON']['input'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteToleranceRuleArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteVendorStatementReconciliationNoteArgs = {
  input: DeleteVendorStatementReconciliationNoteInput;
};


export type MutationDisconnectMyobArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationDisconnectQuickbooksArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationDisconnectXeroConnectionArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationDocumentConfigurationArgs = {
  abnNumber?: InputMaybe<Scalars['String']['input']>;
  branchId: Scalars['String']['input'];
  documentType?: InputMaybe<Array<Scalars['String']['input']>>;
  role?: InputMaybe<Array<Scalars['String']['input']>>;
  userId?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationEditSubscriptionArgs = {
  input: UpdateSubscriptionInput;
  subscriptionId: Scalars['String']['input'];
};


export type MutationEnableGoogleDriveForUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationExtractVendorStatementArgs = {
  input: ExtractVendorStatementInput;
};


export type MutationForgotPasswordArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  orgCode?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGenerateEmailApprovalTokensArgs = {
  instanceId: Scalars['String']['input'];
};


export type MutationGenerateInvoiceArgs = {
  input: GenerateInvoiceInput;
};


export type MutationGenerateOrgCodeArgs = {
  organizationName: Scalars['String']['input'];
};


export type MutationInitiateMyobOauthArgs = {
  scopes?: InputMaybe<Array<Scalars['String']['input']>>;
  userId: Scalars['String']['input'];
};


export type MutationInitiateQuickbooksOauthArgs = {
  scopes?: InputMaybe<Array<Scalars['String']['input']>>;
  userId: Scalars['String']['input'];
};


export type MutationInitiateXeroOauthArgs = {
  scopes?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type MutationMarkAllDocumentCommentNotificationsSeenArgs = {
  notificationType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkAllMessagesAsSeenArgs = {
  roomName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkDocumentCommentNotificationSeenArgs = {
  notificationId: Scalars['String']['input'];
  notificationType?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMarkEmailAsReadArgs = {
  emailId: Scalars['String']['input'];
};


export type MutationMarkMessageAsSeenArgs = {
  messageId: Scalars['String']['input'];
};


export type MutationMarkNotificationSeenArgs = {
  notificationId: Scalars['String']['input'];
};


export type MutationMoveDocumentArgs = {
  input: DocumentMoveInput;
};


export type MutationMoveFolderArgs = {
  input: FolderMoveInput;
};


export type MutationProcessStageActionArgs = {
  action: Scalars['String']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
  instanceId: Scalars['String']['input'];
};


export type MutationReconcileVendorStatementArgs = {
  input: ReconcileVendorStatementInput;
};


export type MutationRefreshMyobTokenArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationRefreshXeroTokenArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationRejectStageArgs = {
  comments?: InputMaybe<Scalars['String']['input']>;
  instanceId: Scalars['String']['input'];
};


export type MutationRemoveAllocationsArgs = {
  allocationIds: Array<Scalars['String']['input']>;
};


export type MutationRemovePackageFeatureLimitationArgs = {
  featureId: Scalars['String']['input'];
  packageId: Scalars['String']['input'];
};


export type MutationRemoveUserBranchAssignmentArgs = {
  assignmentId: Scalars['String']['input'];
};


export type MutationRepredictExpenseAccountsArgs = {
  invoiceDataId: Scalars['String']['input'];
  useFile?: Scalars['Boolean']['input'];
};


export type MutationResetPasswordArgs = {
  req: ResetPasswordRequest;
};


export type MutationRestoreDocumentArgs = {
  documentId: Scalars['String']['input'];
};


export type MutationResumeRejectedStageArgs = {
  comments?: InputMaybe<Scalars['String']['input']>;
  instanceId: Scalars['String']['input'];
};


export type MutationRetryFailedBranchArgs = {
  branchId: Scalars['String']['input'];
};


export type MutationSaveAdditionalChargesConfigArgs = {
  input: AdditionalChargesConfigInput;
};


export type MutationSendInvoiceUploadInviteArgs = {
  input: SendInvoiceUploadInviteInput;
};


export type MutationSendMessageArgs = {
  content: Scalars['String']['input'];
  fileName?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  fileType?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  isAnonymous?: Scalars['Boolean']['input'];
  recipientUserId?: InputMaybe<Scalars['String']['input']>;
  roomName?: Scalars['String']['input'];
  senderEmail?: InputMaybe<Scalars['String']['input']>;
  senderPhone?: InputMaybe<Scalars['String']['input']>;
  userName?: Scalars['String']['input'];
};


export type MutationSendMessageWithMentionsArgs = {
  externalMentions?: InputMaybe<Array<Scalars['String']['input']>>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  fileType?: InputMaybe<Scalars['String']['input']>;
  fileUrl?: InputMaybe<Scalars['String']['input']>;
  internalMentions?: InputMaybe<Array<Scalars['String']['input']>>;
  text: Scalars['String']['input'];
};


export type MutationSetCommentReactionArgs = {
  commentId: Scalars['String']['input'];
  reaction: CommentReaction;
};


export type MutationSetMainAdminArgs = {
  isMainAdmin: Scalars['Boolean']['input'];
  userId: Scalars['String']['input'];
};


export type MutationSetMyPreferencesArgs = {
  createContacts?: InputMaybe<Scalars['Boolean']['input']>;
  documentTypePreferences?: InputMaybe<Array<DocumentTypePreferenceInput>>;
  isGoogleDriveIntegrated?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationSetPackageFeatureLimitationArgs = {
  featureId: Scalars['String']['input'];
  input: SetFeatureLimitationInput;
  packageId: Scalars['String']['input'];
};


export type MutationShareDocumentArgs = {
  fileLinkId: Scalars['String']['input'];
  sharedWith: Array<Scalars['String']['input']>;
};


export type MutationStartTrialArgs = {
  input: StartTrialInput;
};


export type MutationSubmitDemoRequestArgs = {
  input: DemoRequestInput;
};


export type MutationSubmitSubscriptionFormArgs = {
  input: SubscriptionFormInput;
};


export type MutationSyncMyobAccountsArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationSyncMyobCustomersArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationSyncMyobJobsArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationSyncMyobSuppliersArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationSyncPackageWithStripeArgs = {
  input: SyncPackageWithStripeInput;
};


export type MutationSyncQuickbooksDataArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationSyncXeroProjectsArgs = {
  connectionId: Scalars['String']['input'];
  projectIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationTestMyobConnectionArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationTestXeroConnectionArgs = {
  connectionId: Scalars['String']['input'];
};


export type MutationToggleFeatureStatusArgs = {
  featureId: Scalars['String']['input'];
  isActive: Scalars['Boolean']['input'];
};


export type MutationTogglePackageStatusArgs = {
  isActive: Scalars['Boolean']['input'];
  packageId: Scalars['String']['input'];
};


export type MutationUpdateAdminUserArgs = {
  input: UpdateAdminUserInput;
  userId: Scalars['String']['input'];
};


export type MutationUpdateAiPromptArgs = {
  input: UpdateAiPromptInput;
};


export type MutationUpdateClassificationArgs = {
  newInput: ClassificationInput;
  originalGroup: Scalars['String']['input'];
  originalItem: Scalars['String']['input'];
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationUpdateDemoRequestStatusArgs = {
  input: UpdateDemoRequestStatusInput;
};


export type MutationUpdateDocumentConfigurationArgs = {
  abnNumber?: InputMaybe<Scalars['String']['input']>;
  branchId?: InputMaybe<Scalars['String']['input']>;
  configId: Scalars['String']['input'];
  documentType?: InputMaybe<Array<Scalars['String']['input']>>;
  role?: InputMaybe<Array<Scalars['String']['input']>>;
  userId?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationUpdateExtractedDataArgs = {
  fileId: Scalars['String']['input'];
  input: Scalars['JSON']['input'];
};


export type MutationUpdateFailedBranchArgs = {
  branchId: Scalars['String']['input'];
  input: UpdateFailedBranchInput;
};


export type MutationUpdateFaqArgs = {
  id: Scalars['String']['input'];
  input: UpdateFaqInput;
};


export type MutationUpdateFeatureArgs = {
  featureId: Scalars['String']['input'];
  input: UpdateFeatureInput;
};


export type MutationUpdateFeatureWithLimitationsArgs = {
  featureId: Scalars['String']['input'];
  input: UpdateFeatureWithLimitationsInput;
};


export type MutationUpdateFolderTemplateArgs = {
  input: FolderTemplateUpdateInput;
};


export type MutationUpdateIndustryArgs = {
  input: UpdateIndustryInput;
};


export type MutationUpdateInvoiceStatusArgs = {
  input: UpdateInvoiceStatusInput;
};


export type MutationUpdateNotificationPreferenceArgs = {
  receiveNotifications: Scalars['Boolean']['input'];
};


export type MutationUpdatePackageArgs = {
  input: UpdatePackageInput;
  packageId: Scalars['String']['input'];
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
  roleId: Scalars['String']['input'];
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput;
};


export type MutationUpdateToleranceRuleArgs = {
  input: UpdateToleranceRuleInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserBranchAssignmentArgs = {
  input: UpdateUserBranchAssignmentInput;
};


export type MutationUpdateVendorStatementReconciliationNotesArgs = {
  input: UpdateVendorStatementReconciliationNotesInput;
};


export type MutationUploadChatFileArgs = {
  file: Scalars['Upload']['input'];
  roomName?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUploadFileArgs = {
  input: FileUploadInput;
};


export type MutationUploadFileViaInviteArgs = {
  files: Array<Scalars['Upload']['input']>;
  inviteUuid: Scalars['String']['input'];
};


export type MutationValidateTaxNumberArgs = {
  input: TaxNumberInput;
};


export type MutationVoidInvoiceArgs = {
  invoiceId: Scalars['String']['input'];
};

export type MyObAccountsResponse = {
  __typename?: 'MyOBAccountsResponse';
  accounts: Array<MyobAccountType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type MyObConnectionsResponse = {
  __typename?: 'MyOBConnectionsResponse';
  connections: Array<MyobConnectionType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MyObFormattedSummaryResponse = {
  __typename?: 'MyOBFormattedSummaryResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  summary?: Maybe<MyobFormattedAccountSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type MyObJobsResponse = {
  __typename?: 'MyOBJobsResponse';
  jobs: Array<MyobJobType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type MyOboAuthResponse = {
  __typename?: 'MyOBOAuthResponse';
  authorizationUrl?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MyObStatusResponse = {
  __typename?: 'MyOBStatusResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MyObSuppliersResponse = {
  __typename?: 'MyOBSuppliersResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  suppliers: Array<MyobSupplierType>;
  totalCount: Scalars['Int']['output'];
};

export type MyObSyncResponse = {
  __typename?: 'MyOBSyncResponse';
  message?: Maybe<Scalars['String']['output']>;
  newCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  totalProcessed: Scalars['Int']['output'];
  unchangedCount: Scalars['Int']['output'];
  updatedCount: Scalars['Int']['output'];
};

export type NextStageType = {
  __typename?: 'NextStageType';
  assignedTo?: Maybe<Scalars['String']['output']>;
  dueDays?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
};

export type NotificationResult = {
  __typename?: 'NotificationResult';
  deletedCount?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  failedCount?: Maybe<Scalars['Int']['output']>;
  message: Scalars['String']['output'];
  notifications?: Maybe<Array<DocumentCommentNotification>>;
  success: Scalars['Boolean']['output'];
  totalCount?: Maybe<Scalars['Int']['output']>;
};

export type NotificationType = {
  __typename?: 'NotificationType';
  clientId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isSeen: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  recipientEmail?: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  stageInfo?: Maybe<Scalars['String']['output']>;
  workflowDocumentInstanceId: Scalars['String']['output'];
  workflowName: Scalars['String']['output'];
};

export type OAuthResponse = {
  __typename?: 'OAuthResponse';
  authorizationUrl?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type PackageDetailsType = {
  __typename?: 'PackageDetailsType';
  currentBranches?: Maybe<Scalars['Int']['output']>;
  currentDocuments?: Maybe<Scalars['Int']['output']>;
  currentStorageGb?: Maybe<Scalars['Float']['output']>;
  currentUsers?: Maybe<Scalars['Int']['output']>;
  displayName: Scalars['String']['output'];
  features: Array<FeatureLimitationType>;
  maxBranches?: Maybe<Scalars['Int']['output']>;
  maxUsers?: Maybe<Scalars['Int']['output']>;
  packageId: Scalars['String']['output'];
  packageName: Scalars['String']['output'];
  price?: Maybe<Scalars['Float']['output']>;
  storageGb?: Maybe<Scalars['Int']['output']>;
};

export type PackageFeatureItemType = {
  __typename?: 'PackageFeatureItemType';
  featureDescription: Scalars['String']['output'];
  featureDisplayName: Scalars['String']['output'];
  featureId: Scalars['String']['output'];
  featureName: Scalars['String']['output'];
  isIncluded: Scalars['Boolean']['output'];
  limitationValue: Scalars['String']['output'];
  numericLimit?: Maybe<Scalars['String']['output']>;
};

export type PackageFeatureLimitationType = {
  __typename?: 'PackageFeatureLimitationType';
  featureDisplayName: Scalars['String']['output'];
  featureId: Scalars['String']['output'];
  featureName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isIncluded: Scalars['Boolean']['output'];
  limitationType: Scalars['String']['output'];
  limitationValue: Scalars['String']['output'];
  numericLimit?: Maybe<Scalars['String']['output']>;
  packageId: Scalars['String']['output'];
  packageName: Scalars['String']['output'];
};

export type PackageLimitationInput = {
  isIncluded?: Scalars['Boolean']['input'];
  limitationType: Scalars['String']['input'];
  limitationValue: Scalars['String']['input'];
  numericLimit?: InputMaybe<Scalars['String']['input']>;
  packageId: Scalars['String']['input'];
};

export type PackageType = {
  __typename?: 'PackageType';
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  discountPercentage?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isCustom: Scalars['Boolean']['output'];
  lastStripeSync?: Maybe<Scalars['String']['output']>;
  maxUsers: Scalars['String']['output'];
  monthlyPrice: Scalars['String']['output'];
  name: Scalars['String']['output'];
  storageGb: Scalars['String']['output'];
  stripePriceIdMonthly?: Maybe<Scalars['String']['output']>;
  stripePriceIdYearly?: Maybe<Scalars['String']['output']>;
  stripeProductId?: Maybe<Scalars['String']['output']>;
  stripeSynced: Scalars['Boolean']['output'];
  trialDurationDays: Scalars['Int']['output'];
  trialEnabled: Scalars['Boolean']['output'];
  yearlyPrice: Scalars['String']['output'];
};

export type PackageWithFeaturesType = {
  __typename?: 'PackageWithFeaturesType';
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  discountPercentage?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  features: Array<PackageFeatureItemType>;
  id: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  isCustom: Scalars['Boolean']['output'];
  maxUsers: Scalars['String']['output'];
  monthlyPrice: Scalars['String']['output'];
  name: Scalars['String']['output'];
  storageGb: Scalars['String']['output'];
  yearlyPrice: Scalars['String']['output'];
};

export type PaginatedAccounts = {
  __typename?: 'PaginatedAccounts';
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  results: Array<Scalars['JSON']['output']>;
  total: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedBranchResult = {
  __typename?: 'PaginatedBranchResult';
  data: Array<BranchType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedClientSubscriptionsType = {
  __typename?: 'PaginatedClientSubscriptionsType';
  items: Array<ClientSubscriptionType>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedCustomerInvoicesType = {
  __typename?: 'PaginatedCustomerInvoicesType';
  items: Array<CustomerInvoiceType>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedFailedBranchResult = {
  __typename?: 'PaginatedFailedBranchResult';
  data: Array<FailedBranchType>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type PaginatedInvoiceLineItemsResponse = {
  __typename?: 'PaginatedInvoiceLineItemsResponse';
  error?: Maybe<Scalars['String']['output']>;
  lineItems: Array<InvoiceLineItemType>;
  pagination: PaginationInfo;
  success: Scalars['Boolean']['output'];
};

export type PaginatedPermissions = {
  __typename?: 'PaginatedPermissions';
  data: Array<PermissionType>;
  pagination: PaginationInfo;
};

export type PaginatedPriceHistoryType = {
  __typename?: 'PaginatedPriceHistoryType';
  items: Array<PriceHistoryType>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedRoles = {
  __typename?: 'PaginatedRoles';
  data: Array<RoleType>;
  pagination: PaginationInfo;
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
  totalRecords: Scalars['Int']['output'];
};

export enum PaymentDetails {
  Trial = 'TRIAL'
}

export enum PaymentMethodEnum {
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY'
}

export type PaymentMethodType = {
  __typename?: 'PaymentMethodType';
  cardBrand?: Maybe<Scalars['String']['output']>;
  cardExpMonth?: Maybe<Scalars['Int']['output']>;
  cardExpYear?: Maybe<Scalars['Int']['output']>;
  cardLast4?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type PeriodBreakdown = {
  __typename?: 'PeriodBreakdown';
  percentageChange?: Maybe<Scalars['Float']['output']>;
  periodLabel: Scalars['String']['output'];
  totalExpense: Scalars['Float']['output'];
};

export type PermissionType = {
  __typename?: 'PermissionType';
  Id: Scalars['String']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
  roles?: Maybe<Array<Scalars['String']['output']>>;
  status: Scalars['String']['output'];
};

export type PriceHistoryType = {
  __typename?: 'PriceHistoryType';
  changedBy: Scalars['String']['output'];
  discount: Scalars['String']['output'];
  effectiveDate: Scalars['String']['output'];
  entityName: Scalars['String']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  monthlyPrice: Scalars['String']['output'];
  packageId: Scalars['String']['output'];
  yearlyPrice: Scalars['String']['output'];
};

export type ProcessStageActionResult = {
  __typename?: 'ProcessStageActionResult';
  action: Scalars['String']['output'];
  completed?: Maybe<Scalars['Boolean']['output']>;
  documentStatus?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  googleDriveResult?: Maybe<Scalars['String']['output']>;
  nextStage?: Maybe<NextStageType>;
  ok: Scalars['Boolean']['output'];
  onHold?: Maybe<Scalars['Boolean']['output']>;
  rejected?: Maybe<Scalars['Boolean']['output']>;
  resumed?: Maybe<Scalars['Boolean']['output']>;
  workflowStatus?: Maybe<Scalars['String']['output']>;
};

export type ProjectsResponse = {
  __typename?: 'ProjectsResponse';
  message?: Maybe<Scalars['String']['output']>;
  projects: Array<QuickBooksProjectType>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  actionableStagesForUser: Array<WorkflowStageType>;
  additionalChargesConfig?: Maybe<AdditionalChargesConfigType>;
  aiPrompt?: Maybe<AiPromptType>;
  aiPromptByKey?: Maybe<AiPromptType>;
  aiPrompts: Array<AiPromptType>;
  allDocumentTypes: Array<DocumentType>;
  allSubscriptions: PaginatedClientSubscriptionsType;
  allowedFolderTemplateNodes: Array<FolderTemplateNodeDefinition>;
  auditTrail: AuditTrailResultType;
  branchUsersByFileLink: BranchUsersResult;
  branches: Array<BranchWithFolders>;
  checkEmailExists: EmailExistsResponse;
  classificationGroups: ClassificationGroupsResponse;
  classificationItems: ClassificationItemsResponse;
  contactFormSubmission?: Maybe<ContactFormSubmissionType>;
  contactFormSubmissions: Array<ContactFormSubmissionType>;
  conversations: Array<ConversationType>;
  customerInvoice?: Maybe<CustomerInvoiceType>;
  customerInvoices: PaginatedCustomerInvoicesType;
  decryptAndDownloadFile: DecryptedFileResponse;
  decryptAndStreamFile: DecryptedFileResponse;
  demoRequest?: Maybe<DemoRequestType>;
  demoRequests: DemoRequestListResponse;
  directMessages: Array<ChatMessageType>;
  documentClassifications: Array<Scalars['String']['output']>;
  documentMetaFields: Array<Scalars['String']['output']>;
  documentQuickStats: QuickStatsType;
  documentsByStatus: DocumentTrackingResultType;
  email?: Maybe<EmailType>;
  emailThread: Array<EmailType>;
  emails: EmailListResponse;
  expenseTrends: ExpenseTrendsResponse;
  expensesByCategory: ExpensesByCategoryResponse;
  expensesBySupplier: ExpensesBySupplierResponse;
  faq?: Maybe<FaqType>;
  faqs: FaqListResponse;
  feature?: Maybe<FeatureType>;
  features: Array<FeatureType>;
  fileLinkWithComments: FileLinkWithComments;
  filesByFolderId: Array<File>;
  financeSystems: Array<FinanceSystemEnum>;
  folderById?: Maybe<Folder>;
  folderMoveHealthCheck: Scalars['String']['output'];
  folderTemplateById?: Maybe<FolderTemplate>;
  folderTemplates: Array<FolderTemplate>;
  foldersByBranch: Array<Folder>;
  getAllXeroAccounts: PaginatedAccounts;
  getBasicReExtraction: Scalars['JSON']['output'];
  getBranchManagers: Array<UserType>;
  getBusinessDetails: BusinessDetailsResponse;
  getBusinessValidationLogs: BusinessValidationLogsResponse;
  getClientConfigs: Array<ClientDocumentConfigType>;
  getConfig: ConfigData;
  getDeepExtractedData: Scalars['JSON']['output'];
  getDocsClassification: Scalars['JSON']['output'];
  getExractedData: Scalars['JSON']['output'];
  getFailedBranches?: Maybe<PaginatedFailedBranchResult>;
  getFileDownloadUrl?: Maybe<Scalars['String']['output']>;
  getFileLinkData: FileLinkDataResponse;
  getMyPreferences: UserPreferencesType;
  getMyProfile: UserProfileType;
  getUser?: Maybe<UserType>;
  getUserRoleAssignments: Array<UserRoleAssignmentType>;
  getUsersByBranchId: Array<UserType>;
  industries: Array<IndustryType>;
  industry?: Maybe<IndustryType>;
  invoiceLineItems: PaginatedInvoiceLineItemsResponse;
  invoiceLineItemsAllocationSummary: AllocationSummaryResponse;
  invoiceStatusCounts: InvoiceStatusCountType;
  invoiceUploadInvites: Array<InvoiceUploadInviteType>;
  lineItemAllocations: LineItemAllocationsResponse;
  listAdminUsers: Array<AdminUserType>;
  listCountries: Array<CountryType>;
  listPermissions: PaginatedPermissions;
  listRoles: PaginatedRoles;
  listTags: ListTagsResponse;
  listTaxRates: Array<TaxRateType>;
  listUsers: Array<UserType>;
  messages: Array<ChatMessageType>;
  messagesByRoom: Array<ChatMessageType>;
  multipleTasksStatus: Array<TaskStatus>;
  myNotifications: Array<UnifiedNotification>;
  myNotificationsGrouped: UserBellNotificationGroup;
  myobChartOfAccounts: MyObAccountsResponse;
  myobConnections: MyObConnectionsResponse;
  myobFormattedAccountSummary: MyObFormattedSummaryResponse;
  myobJobs: MyObJobsResponse;
  myobSupplierByAbn: MyObSuppliersResponse;
  myobSuppliers: MyObSuppliersResponse;
  myobSyncInfo?: Maybe<Scalars['String']['output']>;
  notificationCount: Scalars['Int']['output'];
  notificationsForUser: Array<NotificationType>;
  overdueStagesForUser: Array<WorkflowStageType>;
  package?: Maybe<PackageType>;
  packageFeatureLimitations: Array<PackageFeatureLimitationType>;
  packageFeatures: Array<FeatureWithLimitationsType>;
  packages: Array<PackageType>;
  packagesWithFeatures: Array<PackageWithFeaturesType>;
  paymentMethods: Array<PaymentMethodEnum>;
  priceHistory: PaginatedPriceHistoryType;
  quickbooksAccounts: AccountsResponse;
  quickbooksConnections: ConnectionsResponse;
  quickbooksFormattedAccountSummary: QuickBooksFormattedSummaryResponse;
  quickbooksProjects: ProjectsResponse;
  quickbooksRecentAccountChangesAfterSync: QuickBooksRecentAccountChangesResponse;
  quickbooksRecentVendorChangesAfterSync: QuickBooksRecentVendorChangesResponse;
  quickbooksVendors: VendorsResponse;
  reMapZeroContacts: Scalars['JSON']['output'];
  roomExists: Scalars['Boolean']['output'];
  roomStats: RoomStatsType;
  rooms: Array<RoomType>;
  searchBranches?: Maybe<PaginatedBranchResult>;
  searchText: SearchResult;
  sharedDocumentDetails?: Maybe<SharedDocumentType>;
  sharedDocumentsByMe: SharedDocumentsResultType;
  sharedDocumentsWithMe: SharedDocumentsResultType;
  softDeletedDocuments: SoftDeletedDocumentsResultType;
  taskStatus: TaskStatus;
  toleranceRules: Array<ToleranceRuleType>;
  trialEligibility: Scalars['Boolean']['output'];
  trialStatus?: Maybe<TrialStatusType>;
  userSubscription?: Maybe<UserSubscriptionType>;
  vendorStatementReconciliation: VendorStatementReconciliationResponse;
  workflowInstancesForUser: Array<WorkflowInstanceType>;
  workflowInstancesOnHold: Array<WorkflowInstanceType>;
  xeroAccountTypes: XeroAccountTypesResponse;
  xeroAccountsByClass: XeroClassSpecificResponse;
  xeroAccountsByType: XeroTypeSpecificResponse;
  xeroChartOfAccounts: XeroAccountsResponse;
  xeroComprehensiveAccountSummary: XeroComprehensiveSummaryResponse;
  xeroConnections: XeroConnectionResponse;
  xeroFormattedAccountSummary: XeroFormattedSummaryResponse;
  xeroRecentChangesAfterSync: XeroRecentChangesResponse;
  xeroSearchAccount: XeroSearchResponse;
  xeroSearchAccounts: XeroSearchResponse;
  xeroStoredProjects: XeroProjectsResponse;
};


export type QueryAiPromptArgs = {
  id: Scalars['String']['input'];
};


export type QueryAiPromptByKeyArgs = {
  key: Scalars['String']['input'];
};


export type QueryAllSubscriptionsArgs = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAuditTrailArgs = {
  documentId?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  trailName?: InputMaybe<Scalars['String']['input']>;
  workflowDocumentInstanceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryBranchUsersByFileLinkArgs = {
  fileLinkId: Scalars['String']['input'];
};


export type QueryCheckEmailExistsArgs = {
  input: CheckEmailExistsInput;
};


export type QueryClassificationItemsArgs = {
  groupName?: InputMaybe<Scalars['String']['input']>;
};


export type QueryContactFormSubmissionArgs = {
  id: Scalars['String']['input'];
};


export type QueryContactFormSubmissionsArgs = {
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
};


export type QueryCustomerInvoiceArgs = {
  invoiceId: Scalars['String']['input'];
};


export type QueryCustomerInvoicesArgs = {
  clientId?: InputMaybe<Scalars['String']['input']>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDecryptAndDownloadFileArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryDecryptAndStreamFileArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryDemoRequestArgs = {
  requestId: Scalars['String']['input'];
};


export type QueryDemoRequestsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};


export type QueryDirectMessagesArgs = {
  limit?: Scalars['Int']['input'];
  otherUserId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDocumentMetaFieldsArgs = {
  documentType: Scalars['String']['input'];
};


export type QueryDocumentQuickStatsArgs = {
  isArchive?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryDocumentsByStatusArgs = {
  filterByDate?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  isArchive?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  period?: InputMaybe<Scalars['String']['input']>;
  q?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['String']['input']>;
  stageStatus?: InputMaybe<StringFilter>;
  status?: InputMaybe<StringFilter>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  toDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmailArgs = {
  emailId: Scalars['String']['input'];
};


export type QueryEmailThreadArgs = {
  emailId: Scalars['String']['input'];
};


export type QueryEmailsArgs = {
  branchEmail?: InputMaybe<Scalars['String']['input']>;
  branchId?: InputMaybe<Scalars['String']['input']>;
  clientId?: InputMaybe<Scalars['String']['input']>;
  hasAttachments?: InputMaybe<Scalars['Boolean']['input']>;
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
};


export type QueryExpenseTrendsArgs = {
  period?: Scalars['String']['input'];
};


export type QueryExpensesByCategoryArgs = {
  fromDate?: InputMaybe<Scalars['String']['input']>;
  period?: Scalars['String']['input'];
  toDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryExpensesBySupplierArgs = {
  fromDate?: InputMaybe<Scalars['String']['input']>;
  period?: Scalars['String']['input'];
  toDate?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFaqArgs = {
  id: Scalars['String']['input'];
};


export type QueryFaqsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFeatureArgs = {
  featureId: Scalars['String']['input'];
};


export type QueryFeaturesArgs = {
  includeInactive?: Scalars['Boolean']['input'];
};


export type QueryFileLinkWithCommentsArgs = {
  fileLinkId: Scalars['String']['input'];
};


export type QueryFilesByFolderIdArgs = {
  folderId: Scalars['String']['input'];
};


export type QueryFolderByIdArgs = {
  folderId: Scalars['String']['input'];
};


export type QueryFolderTemplateByIdArgs = {
  templateId: Scalars['String']['input'];
};


export type QueryFoldersByBranchArgs = {
  branchId: Scalars['String']['input'];
};


export type QueryGetAllXeroAccountsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetBasicReExtractionArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryGetBusinessDetailsArgs = {
  filterInput?: InputMaybe<BusinessDetailsFilterInput>;
};


export type QueryGetBusinessValidationLogsArgs = {
  filterInput?: InputMaybe<BusinessValidationLogsFilterInput>;
};


export type QueryGetConfigArgs = {
  configName: Scalars['String']['input'];
};


export type QueryGetDeepExtractedDataArgs = {
  fileId: Scalars['String']['input'];
};


export type QueryGetExractedDataArgs = {
  invoiceId: Scalars['String']['input'];
};


export type QueryGetFailedBranchesArgs = {
  input: FailedBranchSearchInput;
};


export type QueryGetFileDownloadUrlArgs = {
  expiration?: Scalars['Int']['input'];
  s3Url: Scalars['String']['input'];
};


export type QueryGetFileLinkDataArgs = {
  fileLinkId: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserRoleAssignmentsArgs = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUsersByBranchIdArgs = {
  branchId: Scalars['String']['input'];
};


export type QueryIndustriesArgs = {
  promtKey?: InputMaybe<Scalars['String']['input']>;
};


export type QueryIndustryArgs = {
  id: Scalars['String']['input'];
};


export type QueryInvoiceLineItemsArgs = {
  filters?: InputMaybe<Scalars['String']['input']>;
  invoiceId?: InputMaybe<Scalars['String']['input']>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  status?: InputMaybe<InvoiceLineItemStatusEnum>;
};


export type QueryInvoiceLineItemsAllocationSummaryArgs = {
  invoiceId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInvoiceStatusCountsArgs = {
  clientId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryLineItemAllocationsArgs = {
  allocationType?: InputMaybe<AllocationTypeFilter>;
  customerId: Scalars['String']['input'];
};


export type QueryListPermissionsArgs = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QueryListRolesArgs = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QueryListTagsArgs = {
  q?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMessagesArgs = {
  limit?: Scalars['Int']['input'];
};


export type QueryMessagesByRoomArgs = {
  limit?: Scalars['Int']['input'];
  roomName: Scalars['String']['input'];
};


export type QueryMultipleTasksStatusArgs = {
  taskIds: Array<Scalars['String']['input']>;
};


export type QueryMyNotificationsArgs = {
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
  onlyUnseen?: Scalars['Boolean']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryMyNotificationsGroupedArgs = {
  onlyUnseen?: Scalars['Boolean']['input'];
};


export type QueryMyobChartOfAccountsArgs = {
  activeOnly?: Scalars['Boolean']['input'];
  connectionId: Scalars['String']['input'];
};


export type QueryMyobConnectionsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryMyobFormattedAccountSummaryArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryMyobJobsArgs = {
  activeOnly?: Scalars['Boolean']['input'];
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryMyobSupplierByAbnArgs = {
  abn: Scalars['String']['input'];
  connectionId: Scalars['String']['input'];
};


export type QueryMyobSuppliersArgs = {
  activeOnly?: Scalars['Boolean']['input'];
  connectionId: Scalars['String']['input'];
  contactType?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryMyobSyncInfoArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryNotificationCountArgs = {
  onlyUnseen?: Scalars['Boolean']['input'];
};


export type QueryNotificationsForUserArgs = {
  onlyUnseen?: Scalars['Boolean']['input'];
};


export type QueryPackageArgs = {
  packageId: Scalars['String']['input'];
};


export type QueryPackageFeatureLimitationsArgs = {
  packageId: Scalars['String']['input'];
};


export type QueryPackagesArgs = {
  includeInactive?: Scalars['Boolean']['input'];
};


export type QueryPackagesWithFeaturesArgs = {
  includeInactive?: Scalars['Boolean']['input'];
};


export type QueryPriceHistoryArgs = {
  entityFilter?: InputMaybe<Scalars['String']['input']>;
  packageId?: InputMaybe<Scalars['String']['input']>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QueryQuickbooksAccountsArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryQuickbooksConnectionsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryQuickbooksFormattedAccountSummaryArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryQuickbooksProjectsArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryQuickbooksRecentAccountChangesAfterSyncArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};


export type QueryQuickbooksRecentVendorChangesAfterSyncArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};


export type QueryQuickbooksVendorsArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
  offset?: Scalars['Int']['input'];
};


export type QueryReMapZeroContactsArgs = {
  invoiceDataId: Scalars['String']['input'];
};


export type QueryRoomExistsArgs = {
  roomName: Scalars['String']['input'];
};


export type QuerySearchBranchesArgs = {
  input: BranchSearchInput;
};


export type QuerySearchTextArgs = {
  branchId?: InputMaybe<Scalars['String']['input']>;
  folderId?: InputMaybe<Scalars['String']['input']>;
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
  q: Scalars['String']['input'];
};


export type QuerySharedDocumentDetailsArgs = {
  sharedDocumentId: Scalars['String']['input'];
};


export type QuerySharedDocumentsByMeArgs = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QuerySharedDocumentsWithMeArgs = {
  page?: Scalars['Int']['input'];
  pageSize?: Scalars['Int']['input'];
};


export type QuerySoftDeletedDocumentsArgs = {
  clientId?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<Scalars['String']['input']>;
  folderId?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  skip?: Scalars['Int']['input'];
  workflowStatus?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTaskStatusArgs = {
  taskId: Scalars['String']['input'];
};


export type QueryTrialStatusArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserSubscriptionArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryXeroAccountTypesArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryXeroAccountsByClassArgs = {
  className: Scalars['String']['input'];
  connectionId: Scalars['String']['input'];
};


export type QueryXeroAccountsByTypeArgs = {
  accountType: Scalars['String']['input'];
  connectionId: Scalars['String']['input'];
};


export type QueryXeroChartOfAccountsArgs = {
  connectionId: Scalars['String']['input'];
  filters?: InputMaybe<XeroAccountFilterInput>;
};


export type QueryXeroComprehensiveAccountSummaryArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryXeroConnectionsArgs = {
  userId: Scalars['String']['input'];
};


export type QueryXeroFormattedAccountSummaryArgs = {
  connectionId: Scalars['String']['input'];
};


export type QueryXeroRecentChangesAfterSyncArgs = {
  connectionId: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};


export type QueryXeroSearchAccountArgs = {
  connectionId: Scalars['String']['input'];
  q: Scalars['String']['input'];
};


export type QueryXeroSearchAccountsArgs = {
  connectionId: Scalars['String']['input'];
  searchInput: XeroSearchInput;
};


export type QueryXeroStoredProjectsArgs = {
  connectionId: Scalars['String']['input'];
};

export type QuickBooksAccountType = {
  __typename?: 'QuickBooksAccountType';
  accountId: Scalars['String']['output'];
  accountSubType?: Maybe<Scalars['String']['output']>;
  accountType: Scalars['String']['output'];
  active: Scalars['Boolean']['output'];
  classification?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  qbAccountId: Scalars['String']['output'];
};

export type QuickBooksClassGroup = {
  __typename?: 'QuickBooksClassGroup';
  accounts: Array<QuickBooksFormattedAccount>;
  className: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type QuickBooksConnectionType = {
  __typename?: 'QuickBooksConnectionType';
  authMethod: Scalars['String']['output'];
  companyName?: Maybe<Scalars['String']['output']>;
  connectionId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  lastSyncAt?: Maybe<Scalars['DateTime']['output']>;
  realmId: Scalars['String']['output'];
  scopes: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tokenExpired: Scalars['Boolean']['output'];
};

export type QuickBooksFormattedAccount = {
  __typename?: 'QuickBooksFormattedAccount';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type QuickBooksFormattedAccountSummary = {
  __typename?: 'QuickBooksFormattedAccountSummary';
  activeAccounts: Scalars['Int']['output'];
  archivedAccounts: Scalars['Int']['output'];
  byClass: Array<QuickBooksClassGroup>;
  byStatus: QuickBooksStatusGroup;
  byType: Array<QuickBooksTypeGroup>;
  totalAccounts: Scalars['Int']['output'];
};

export type QuickBooksFormattedSummaryResponse = {
  __typename?: 'QuickBooksFormattedSummaryResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  summary?: Maybe<QuickBooksFormattedAccountSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type QuickBooksProjectType = {
  __typename?: 'QuickBooksProjectType';
  active: Scalars['Boolean']['output'];
  endDate?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  projectId: Scalars['String']['output'];
  qbProjectId: Scalars['String']['output'];
  startDate?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type QuickBooksRecentAccountChange = {
  __typename?: 'QuickBooksRecentAccountChange';
  accountId: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  actionType: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  datetime: Scalars['String']['output'];
  details: Scalars['String']['output'];
  hasDetails: Scalars['Boolean']['output'];
  historyId?: Maybe<Scalars['String']['output']>;
  isRecent: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type QuickBooksRecentAccountChangesResponse = {
  __typename?: 'QuickBooksRecentAccountChangesResponse';
  changes?: Maybe<Array<QuickBooksRecentAccountChange>>;
  connectionId: Scalars['String']['output'];
  count?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  mode?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type QuickBooksRecentVendorChange = {
  __typename?: 'QuickBooksRecentVendorChange';
  actionType: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  datetime: Scalars['String']['output'];
  details: Scalars['String']['output'];
  hasDetails: Scalars['Boolean']['output'];
  historyId?: Maybe<Scalars['String']['output']>;
  isRecent: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
  user: Scalars['String']['output'];
  vendorId: Scalars['String']['output'];
  vendorName: Scalars['String']['output'];
  vendorType: Scalars['String']['output'];
};

export type QuickBooksRecentVendorChangesResponse = {
  __typename?: 'QuickBooksRecentVendorChangesResponse';
  changes?: Maybe<Array<QuickBooksRecentVendorChange>>;
  connectionId: Scalars['String']['output'];
  count?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  mode?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type QuickBooksStatusGroup = {
  __typename?: 'QuickBooksStatusGroup';
  ACTIVE: Scalars['Int']['output'];
  ARCHIVED: Scalars['Int']['output'];
};

export type QuickBooksTypeGroup = {
  __typename?: 'QuickBooksTypeGroup';
  accounts: Array<QuickBooksFormattedAccount>;
  classField: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  typeName: Scalars['String']['output'];
};

export type QuickBooksVendorType = {
  __typename?: 'QuickBooksVendorType';
  acctNum?: Maybe<Scalars['String']['output']>;
  active: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  qbVendorId: Scalars['String']['output'];
  taxIdentifier?: Maybe<Scalars['String']['output']>;
  vendorId: Scalars['String']['output'];
};

export type QuickStatsType = {
  __typename?: 'QuickStatsType';
  onHold: Scalars['Int']['output'];
  overdue: Scalars['Int']['output'];
  pendingApproval: Scalars['Int']['output'];
  processedThisMonth: Scalars['Int']['output'];
};

export enum QuoteRequestCompanySize {
  Size_1_10 = 'SIZE_1_10',
  Size_11_50 = 'SIZE_11_50',
  Size_51_200 = 'SIZE_51_200',
  Size_200Plus = 'SIZE_200_PLUS'
}

export type QuoteRequestFormResponse = {
  __typename?: 'QuoteRequestFormResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ReconcileVendorStatementInput = {
  fromDate: Scalars['String']['input'];
  statementLines: Array<VendorStatementLineInput>;
  toDate: Scalars['String']['input'];
  vendorName: Scalars['String']['input'];
};

export type RejectStageResult = {
  __typename?: 'RejectStageResult';
  documentStatus?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  rejected: Scalars['Boolean']['output'];
  workflowStatus?: Maybe<Scalars['String']['output']>;
};

export type RemoveUserBranchAssignmentResponse = {
  __typename?: 'RemoveUserBranchAssignmentResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ResetPasswordRequest = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type RestoreDocumentResult = {
  __typename?: 'RestoreDocumentResult';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  restored: Scalars['Boolean']['output'];
};

export type ResumeStageResult = {
  __typename?: 'ResumeStageResult';
  documentStatus?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  resumed: Scalars['Boolean']['output'];
  workflowStatus?: Maybe<Scalars['String']['output']>;
};

export type RoleBranchAssignmentType = {
  __typename?: 'RoleBranchAssignmentType';
  assignAll: Scalars['Boolean']['output'];
  branchIds: Array<Scalars['String']['output']>;
  branchInfo: Array<BranchInfoType>;
  permissions: Array<Scalars['String']['output']>;
  roleId: Scalars['String']['output'];
  roleName: Scalars['String']['output'];
};

export type RoleResponse = {
  __typename?: 'RoleResponse';
  message?: Maybe<Scalars['String']['output']>;
  role?: Maybe<RoleType>;
  success: Scalars['Boolean']['output'];
};

export type RoleType = {
  __typename?: 'RoleType';
  Id: Scalars['String']['output'];
  clientId?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  isGlobal?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userCount?: Maybe<Scalars['Int']['output']>;
  users?: Maybe<Array<UserType>>;
};

export type RoomStatsType = {
  __typename?: 'RoomStatsType';
  activeRooms: Array<Scalars['String']['output']>;
  totalMessages: Scalars['Int']['output'];
  totalRooms: Scalars['Int']['output'];
};

export type RoomType = {
  __typename?: 'RoomType';
  createdAt: Scalars['String']['output'];
  lastMessage?: Maybe<ChatMessageType>;
  messageCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  highlights?: Maybe<Array<Scalars['JSON']['output']>>;
  items: Array<Scalars['JSON']['output']>;
  total: Scalars['Int']['output'];
};

export type SecretKeyRotationResult = {
  __typename?: 'SecretKeyRotationResult';
  failedFiles: Array<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  secretKey?: Maybe<Scalars['String']['output']>;
  skippedFiles: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  totalFiles: Scalars['Int']['output'];
  updatedFiles: Scalars['Int']['output'];
};

export type SendInvoiceUploadInviteInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  sentInviteBy: SentInviteByEnum;
};

export type SendInvoiceUploadInviteResponse = {
  __typename?: 'SendInvoiceUploadInviteResponse';
  error?: Maybe<Scalars['String']['output']>;
  inviteId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SendMessageResult = {
  __typename?: 'SendMessageResult';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<ChatMessageType>;
  success: Scalars['Boolean']['output'];
};

export type SendMessageWithMentionsResult = {
  __typename?: 'SendMessageWithMentionsResult';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  externalMentionsSent: Scalars['Int']['output'];
  internalMentionsSent: Scalars['Int']['output'];
  messages?: Maybe<Array<ChatMessageType>>;
  success: Scalars['Boolean']['output'];
};

export enum SentInviteByEnum {
  Email = 'email',
  Sms = 'sms'
}

export type SetFeatureLimitationInput = {
  isIncluded?: Scalars['Boolean']['input'];
  limitationType: Scalars['String']['input'];
  limitationValue: Scalars['String']['input'];
  numericLimit?: InputMaybe<Scalars['String']['input']>;
};

export type ShareDocumentResult = {
  __typename?: 'ShareDocumentResult';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  sharedDocumentId?: Maybe<Scalars['String']['output']>;
};

export type SharedDocumentType = {
  __typename?: 'SharedDocumentType';
  branchId?: Maybe<Scalars['String']['output']>;
  clientId: Scalars['String']['output'];
  documentHighLevelType?: Maybe<Scalars['String']['output']>;
  documentName: Scalars['String']['output'];
  documentType: Scalars['String']['output'];
  fileLinkId: Scalars['String']['output'];
  fileType?: Maybe<Scalars['String']['output']>;
  folderId?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  invoiceDataId?: Maybe<Scalars['String']['output']>;
  s3FileUrl: Scalars['String']['output'];
  sharedBy: Scalars['String']['output'];
  sharedWith: Array<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
};

export type SharedDocumentsResultType = {
  __typename?: 'SharedDocumentsResultType';
  documents: Array<SharedDocumentType>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type SoftDeletedDocumentType = {
  __typename?: 'SoftDeletedDocumentType';
  businessName?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Scalars['String']['output']>;
  classification?: Maybe<Scalars['String']['output']>;
  clientId?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['String']['output']>;
  fileType?: Maybe<Scalars['String']['output']>;
  folderId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  invoiceData?: Maybe<SoftDeletedInvoiceDataType>;
  orgName?: Maybe<Scalars['String']['output']>;
  s3Urls?: Maybe<Scalars['String']['output']>;
  workflowStatus?: Maybe<Scalars['String']['output']>;
};

export type SoftDeletedDocumentsResultType = {
  __typename?: 'SoftDeletedDocumentsResultType';
  archiveStatistics?: Maybe<ArchiveStatisticsType>;
  documents: Array<SoftDeletedDocumentType>;
  oldestDeletedAt?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
  totalStorageUsedBytes: Scalars['Int']['output'];
};

export type SoftDeletedInvoiceDataType = {
  __typename?: 'SoftDeletedInvoiceDataType';
  extractedData?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['String']['output'];
  invoiceNumber?: Maybe<Scalars['String']['output']>;
};

export type StartTrialInput = {
  packageId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type StatusResponse = {
  __typename?: 'StatusResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  notEquals?: InputMaybe<Scalars['String']['input']>;
};

export type StripeSyncResponse = {
  __typename?: 'StripeSyncResponse';
  message: Scalars['String']['output'];
  packageName?: Maybe<Scalars['String']['output']>;
  stripePriceIdMonthly?: Maybe<Scalars['String']['output']>;
  stripePriceIdYearly?: Maybe<Scalars['String']['output']>;
  stripeProductId?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageAdded: ChatMessageType;
  notificationAdded: UnifiedNotification;
  roomActivity: ChatMessageType;
};


export type SubscriptionMessageAddedArgs = {
  roomName?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionNotificationAddedArgs = {
  notificationType?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionRoomActivityArgs = {
  roomName: Scalars['String']['input'];
};

export type SubscriptionActionResponse = {
  __typename?: 'SubscriptionActionResponse';
  message: Scalars['String']['output'];
  subscription?: Maybe<UserSubscriptionType>;
  success: Scalars['Boolean']['output'];
};

export type SubscriptionCheckoutResponse = {
  __typename?: 'SubscriptionCheckoutResponse';
  clientSecret?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  requiresAction: Scalars['Boolean']['output'];
  subscriptionId?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type SubscriptionFormInput = {
  billingPeriod?: InputMaybe<PaymentMethodEnum>;
  businessNumber?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  financeSystem?: InputMaybe<FinanceSystemEnum>;
  firstName: Scalars['String']['input'];
  industryId?: InputMaybe<Scalars['String']['input']>;
  isTrial?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  organizationName: Scalars['String']['input'];
  packageId?: InputMaybe<Scalars['String']['input']>;
  paymentDetails?: InputMaybe<PaymentDetails>;
  phone?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionFormResponse = {
  __typename?: 'SubscriptionFormResponse';
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type SupplierExpense = {
  __typename?: 'SupplierExpense';
  invoiceCount: Scalars['Int']['output'];
  percentageChange?: Maybe<Scalars['Float']['output']>;
  percentageOfTotal: Scalars['Float']['output'];
  supplierName: Scalars['String']['output'];
  totalExpense: Scalars['Float']['output'];
};

export type SyncPackageWithStripeInput = {
  forceRecreate?: Scalars['Boolean']['input'];
  packageId: Scalars['String']['input'];
};

export type SyncResponse = {
  __typename?: 'SyncResponse';
  accountsCount: Scalars['Int']['output'];
  message?: Maybe<Scalars['String']['output']>;
  newCount: Scalars['Int']['output'];
  projectsCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  unchangedCount: Scalars['Int']['output'];
  updatedCount: Scalars['Int']['output'];
  vendorsCount: Scalars['Int']['output'];
};

export type TaskProgressInfo = {
  __typename?: 'TaskProgressInfo';
  current: Scalars['Int']['output'];
  stage: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type TaskStatus = {
  __typename?: 'TaskStatus';
  error?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  progress?: Maybe<TaskProgressInfo>;
  result?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  taskId: Scalars['String']['output'];
};

export type TaxNumberInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  taxNumber: Scalars['String']['input'];
};

export type TaxNumberValidationResponse = {
  __typename?: 'TaxNumberValidationResponse';
  acn?: Maybe<Scalars['String']['output']>;
  addressPostcode?: Maybe<Scalars['String']['output']>;
  addressState?: Maybe<Scalars['String']['output']>;
  businessName?: Maybe<Scalars['String']['output']>;
  entityName?: Maybe<Scalars['String']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  gstDate?: Maybe<Scalars['String']['output']>;
  isValid: Scalars['Boolean']['output'];
  status?: Maybe<Scalars['String']['output']>;
  statusEffectiveFrom?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  taxNumber?: Maybe<Scalars['String']['output']>;
};

export type TaxRateResponse = {
  __typename?: 'TaxRateResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type TaxRateType = {
  __typename?: 'TaxRateType';
  countryId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  taxRatePercent: Scalars['Float']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type ToleranceRuleType = {
  __typename?: 'ToleranceRuleType';
  action: Scalars['String']['output'];
  basedOn: Scalars['String']['output'];
  calculationMethod?: Maybe<Scalars['String']['output']>;
  clientId: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  operator: Scalars['String']['output'];
  purchaseType: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  value: Scalars['Float']['output'];
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type TrialActionResponse = {
  __typename?: 'TrialActionResponse';
  daysRemaining?: Maybe<Scalars['Int']['output']>;
  message: Scalars['String']['output'];
  subscription?: Maybe<UserSubscriptionType>;
  success: Scalars['Boolean']['output'];
  trialExpiresAt?: Maybe<Scalars['String']['output']>;
};

export type TrialStatusType = {
  __typename?: 'TrialStatusType';
  daysRemaining: Scalars['Int']['output'];
  hasUsedTrial: Scalars['Boolean']['output'];
  isEligibleForTrial: Scalars['Boolean']['output'];
  isOnTrial: Scalars['Boolean']['output'];
  shouldShowWarning: Scalars['Boolean']['output'];
  trialExpiresAt?: Maybe<Scalars['String']['output']>;
  trialStartedAt?: Maybe<Scalars['String']['output']>;
};

export type UnifiedNotification = {
  __typename?: 'UnifiedNotification';
  approval?: Maybe<WorkflowNotificationType>;
  chatMessage?: Maybe<ChatMessageNotificationType>;
  comment?: Maybe<DocumentCommentNotification>;
  createdAt: Scalars['String']['output'];
  email?: Maybe<EmailNotificationType>;
  id: Scalars['String']['output'];
  isSeen: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  share?: Maybe<DocumentShareNotification>;
  title?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type UpdateAiPromptInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  industryId?: InputMaybe<Scalars['String']['input']>;
  promptText?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAdminUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isMainAdmin?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCountryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateDemoRequestStatusInput = {
  isActive: Scalars['Boolean']['input'];
  requestId: Scalars['String']['input'];
};

export type UpdateDemoRequestStatusResponse = {
  __typename?: 'UpdateDemoRequestStatusResponse';
  message: Scalars['String']['output'];
  request?: Maybe<DemoRequestType>;
  success: Scalars['Boolean']['output'];
};

export type UpdateFaqInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFailedBranchInput = {
  additionalFields?: InputMaybe<Scalars['JSON']['input']>;
  branchManagerUserId?: InputMaybe<Scalars['String']['input']>;
  branchName?: InputMaybe<Scalars['String']['input']>;
  branchNum?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFeatureInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  featureType?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFeatureWithLimitationsInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  featureType?: InputMaybe<Scalars['String']['input']>;
  packageLimitations?: InputMaybe<Array<PackageLimitationInput>>;
};

export type UpdateIndustryInput = {
  description: Scalars['String']['input'];
  id: Scalars['String']['input'];
};

export type UpdateInvoiceStatusInput = {
  invoiceId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type UpdatePackageInput = {
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discountPercentage?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  isCustom?: InputMaybe<Scalars['Boolean']['input']>;
  maxUsers?: InputMaybe<Scalars['String']['input']>;
  monthlyPrice?: InputMaybe<Scalars['String']['input']>;
  storageGb?: InputMaybe<Scalars['String']['input']>;
  trialDurationDays?: InputMaybe<Scalars['Int']['input']>;
  trialEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  yearlyPrice?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isGlobal?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateSubscriptionInput = {
  billingPeriod?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxRateInput = {
  countryId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  taxRatePercent?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateToleranceRuleInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  basedOn?: InputMaybe<Scalars['String']['input']>;
  calculationMethod?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  operator?: InputMaybe<Scalars['String']['input']>;
  purchaseType?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateUserBranchAssignmentInput = {
  assignmentId: Scalars['String']['input'];
  branchId?: InputMaybe<Scalars['String']['input']>;
  roleId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserBranchAssignmentResponse = {
  __typename?: 'UpdateUserBranchAssignmentResponse';
  assignment?: Maybe<UserRoleAssignmentType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  profileImage?: InputMaybe<Scalars['Upload']['input']>;
};

export type UpdateVendorStatementReconciliationNotesInput = {
  notes: Scalars['String']['input'];
};

export type UserBellNotificationGroup = {
  __typename?: 'UserBellNotificationGroup';
  approvals: Array<WorkflowNotificationType>;
  comments: Array<DocumentCommentNotification>;
  messages: Array<ChatMessageNotificationType>;
  shares: Array<DocumentShareNotification>;
};

export type UserCheckoutResponse = {
  __typename?: 'UserCheckoutResponse';
  checkoutUrl?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type UserInStageCheckResult = {
  __typename?: 'UserInStageCheckResult';
  canApprove?: Maybe<Scalars['Boolean']['output']>;
  canHold?: Maybe<Scalars['Boolean']['output']>;
  canReject?: Maybe<Scalars['Boolean']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  isInStage: Scalars['Boolean']['output'];
  ok: Scalars['Boolean']['output'];
};

export type UserPreferencesType = {
  __typename?: 'UserPreferencesType';
  documentTypePreferences: Array<DocumentTypePreference>;
  googleDriveSecretKey?: Maybe<Scalars['String']['output']>;
  isGoogleDriveIntegrated: Scalars['Boolean']['output'];
};

export type UserProfileType = {
  __typename?: 'UserProfileType';
  branches?: Maybe<Array<BranchInfoType>>;
  clientId?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  folders?: Maybe<Array<FolderType>>;
  hasUsedTrial?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  isEligibleForTrial?: Maybe<Scalars['Boolean']['output']>;
  isOnboardingComplete?: Maybe<Scalars['Boolean']['output']>;
  isOnboardingEmailSent?: Maybe<Scalars['Boolean']['output']>;
  isTrial?: Maybe<Scalars['Boolean']['output']>;
  isTrialExpired?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  licenses?: Maybe<Scalars['JSON']['output']>;
  organizationCode: Scalars['String']['output'];
  organizationName: Scalars['String']['output'];
  organizationNumber: Scalars['String']['output'];
  packageDetails?: Maybe<PackageDetailsType>;
  profileImage?: Maybe<Scalars['String']['output']>;
  receiveNotifications?: Maybe<Scalars['Boolean']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  roleBranchAssignments?: Maybe<Array<RoleBranchAssignmentType>>;
  subscription?: Maybe<Scalars['JSON']['output']>;
  subscriptionStatus?: Maybe<Scalars['String']['output']>;
  trialDaysRemaining?: Maybe<Scalars['Int']['output']>;
  trialExpiresAt?: Maybe<Scalars['String']['output']>;
  trialShouldShowWarning?: Maybe<Scalars['Boolean']['output']>;
  trialStartedAt?: Maybe<Scalars['String']['output']>;
};

export type UserRoleAssignmentType = {
  __typename?: 'UserRoleAssignmentType';
  Id: Scalars['String']['output'];
  assignedAt: Scalars['String']['output'];
  assignedBy: Scalars['String']['output'];
  branchId: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  roleId: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UserSubscriptionType = {
  __typename?: 'UserSubscriptionType';
  billingPeriod?: Maybe<Scalars['String']['output']>;
  convertedFromTrial: Scalars['Boolean']['output'];
  currentUsage?: Maybe<CurrentUsageType>;
  customFeatures?: Maybe<Array<CustomFeatureType>>;
  expiresAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isTrial: Scalars['Boolean']['output'];
  isTrialExpired?: Maybe<Scalars['Boolean']['output']>;
  package: PackageType;
  paymentMethod?: Maybe<Scalars['String']['output']>;
  startedAt: Scalars['String']['output'];
  subscriptionStatus: Scalars['String']['output'];
  trialExpiresAt?: Maybe<Scalars['String']['output']>;
  trialStartedAt?: Maybe<Scalars['String']['output']>;
  trialStatus?: Maybe<TrialStatusType>;
  userId: Scalars['String']['output'];
};

export type UserType = {
  __typename?: 'UserType';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserUpdateResponse = {
  __typename?: 'UserUpdateResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type VendorStatementLineInput = {
  amount: Scalars['Float']['input'];
  invoiceDate: Scalars['String']['input'];
  invoiceNumber: Scalars['String']['input'];
};

export type VendorStatementReconciliationResponse = {
  __typename?: 'VendorStatementReconciliationResponse';
  error?: Maybe<Scalars['String']['output']>;
  flagged: Array<VendorStatementReconciliationRow>;
  fromDate: Scalars['String']['output'];
  matchRatePercent?: Maybe<Scalars['Float']['output']>;
  matched: Array<VendorStatementReconciliationRow>;
  notes?: Maybe<Array<Scalars['String']['output']>>;
  success: Scalars['Boolean']['output'];
  toDate: Scalars['String']['output'];
  totalMatched: Scalars['Int']['output'];
  totalStatementLines: Scalars['Int']['output'];
  totalUnmatched: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  vendorName: Scalars['String']['output'];
};

export type VendorStatementReconciliationRow = {
  __typename?: 'VendorStatementReconciliationRow';
  invoiceAmount?: Maybe<Scalars['Float']['output']>;
  invoiceDate?: Maybe<Scalars['String']['output']>;
  invoiceNumber?: Maybe<Scalars['String']['output']>;
  statementAmount?: Maybe<Scalars['Float']['output']>;
  status: Scalars['String']['output'];
  systemInvoiceId?: Maybe<Scalars['String']['output']>;
  variance?: Maybe<Scalars['Float']['output']>;
  vendorName?: Maybe<Scalars['String']['output']>;
};

export type VendorsResponse = {
  __typename?: 'VendorsResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  totalCount: Scalars['Int']['output'];
  vendors: Array<QuickBooksVendorType>;
};

export type WorkflowInstanceType = {
  __typename?: 'WorkflowInstanceType';
  clientId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  currentStage: Scalars['Int']['output'];
  documentId: Scalars['String']['output'];
  documentStatus: Scalars['String']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  workflowId: Scalars['String']['output'];
  workflowStatus: Scalars['String']['output'];
};

export type WorkflowNotificationType = {
  __typename?: 'WorkflowNotificationType';
  clientId: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  documentName?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  documentUrl?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isSeen: Scalars['Boolean']['output'];
  message: Scalars['String']['output'];
  recipientEmail?: Maybe<Scalars['String']['output']>;
  recipientUserId: Scalars['String']['output'];
  seenAt?: Maybe<Scalars['String']['output']>;
  stageInfo?: Maybe<Scalars['String']['output']>;
  stageName?: Maybe<Scalars['String']['output']>;
  stageOrder?: Maybe<Scalars['Int']['output']>;
  stageStatus?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
  workflowDocumentInstanceId: Scalars['String']['output'];
  workflowName: Scalars['String']['output'];
};

export type WorkflowStageType = {
  __typename?: 'WorkflowStageType';
  clientId: Scalars['String']['output'];
  documentId: Scalars['String']['output'];
  dueDate?: Maybe<Scalars['String']['output']>;
  instanceId: Scalars['String']['output'];
  isOverdue?: Maybe<Scalars['Boolean']['output']>;
  stageName: Scalars['String']['output'];
  stageOrder: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  workflowId: Scalars['String']['output'];
};

export type XeroAccount = {
  __typename?: 'XeroAccount';
  accountId?: Maybe<Scalars['String']['output']>;
  bankAccountNumber?: Maybe<Scalars['String']['output']>;
  class?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enablePaymentsToAccount?: Maybe<Scalars['Boolean']['output']>;
  hasAttachments?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  taxType?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedDateUtc?: Maybe<Scalars['DateTime']['output']>;
};

export type XeroAccountFilterInput = {
  accountType?: InputMaybe<Scalars['String']['input']>;
  className?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type XeroAccountType = {
  __typename?: 'XeroAccountType';
  description: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type XeroAccountTypesResponse = {
  __typename?: 'XeroAccountTypesResponse';
  accountTypes?: Maybe<Array<XeroAccountType>>;
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroAccountsResponse = {
  __typename?: 'XeroAccountsResponse';
  accounts?: Maybe<Array<XeroAccount>>;
  connectionId: Scalars['String']['output'];
  dataStored: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  filteredByType?: Maybe<Scalars['String']['output']>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  syncDetails?: Maybe<XeroSyncDetails>;
  tokenRefreshed: Scalars['Boolean']['output'];
  totalStoredAccounts?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type XeroClassGroup = {
  __typename?: 'XeroClassGroup';
  accounts: Array<XeroFormattedAccount>;
  className: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type XeroClassSpecificResponse = {
  __typename?: 'XeroClassSpecificResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  summary?: Maybe<XeroClassSpecificSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroClassSpecificSummary = {
  __typename?: 'XeroClassSpecificSummary';
  accounts: Array<XeroAccount>;
  activeCount: Scalars['Int']['output'];
  archivedCount: Scalars['Int']['output'];
  className: Scalars['String']['output'];
  connectionId: Scalars['String']['output'];
  fetchedAt: Scalars['DateTime']['output'];
  totalCount: Scalars['Int']['output'];
  typeStatistics: Array<XeroTypeStatistics>;
};

export type XeroClassStatistics = {
  __typename?: 'XeroClassStatistics';
  activeCount: Scalars['Int']['output'];
  archivedCount: Scalars['Int']['output'];
  className: Scalars['String']['output'];
  count: Scalars['Int']['output'];
};

export type XeroCleanupResponse = {
  __typename?: 'XeroCleanupResponse';
  cleanupSummary?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  totalDuplicatesDeleted: Scalars['Int']['output'];
};

export type XeroComprehensiveAccountSummary = {
  __typename?: 'XeroComprehensiveAccountSummary';
  activeAccounts: Scalars['Int']['output'];
  archivedAccounts: Scalars['Int']['output'];
  classStatistics: Array<XeroClassStatistics>;
  connectionId: Scalars['String']['output'];
  fetchedAt: Scalars['DateTime']['output'];
  recentUpdates: Array<XeroRecentUpdate>;
  totalAccounts: Scalars['Int']['output'];
  typeStatistics: Array<XeroTypeStatistics>;
};

export type XeroComprehensiveSummaryResponse = {
  __typename?: 'XeroComprehensiveSummaryResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  summary?: Maybe<XeroComprehensiveAccountSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroConnection = {
  __typename?: 'XeroConnection';
  connectionId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  lastSyncAt?: Maybe<Scalars['DateTime']['output']>;
  lastSyncType?: Maybe<Scalars['String']['output']>;
  longevityInfo?: Maybe<XeroLongevityInfo>;
  scopes: Scalars['String']['output'];
  status: Scalars['String']['output'];
  tenantId: Scalars['String']['output'];
  tenantName: Scalars['String']['output'];
  tokenInfo?: Maybe<XeroTokenInfo>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type XeroConnectionResponse = {
  __typename?: 'XeroConnectionResponse';
  connection?: Maybe<XeroConnection>;
  connections?: Maybe<Array<XeroConnection>>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type XeroContact = {
  __typename?: 'XeroContact';
  accountNumber?: Maybe<Scalars['String']['output']>;
  addresses?: Maybe<Scalars['String']['output']>;
  contactId: Scalars['String']['output'];
  contactNumber?: Maybe<Scalars['String']['output']>;
  contactStatus?: Maybe<Scalars['String']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  isCustomer?: Maybe<Scalars['Boolean']['output']>;
  isSupplier?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  phones?: Maybe<Scalars['String']['output']>;
  taxNumber?: Maybe<Scalars['String']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

export type XeroContactInput = {
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  bankAccountDetails?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contactNumber?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isCustomer?: InputMaybe<Scalars['Boolean']['input']>;
  isSupplier?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  purchasesDefaultAccountCode?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  taxNumber?: InputMaybe<Scalars['String']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type XeroContactResponse = {
  __typename?: 'XeroContactResponse';
  connectionId: Scalars['String']['output'];
  contact?: Maybe<XeroContact>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type XeroFormattedAccount = {
  __typename?: 'XeroFormattedAccount';
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type XeroFormattedAccountSummary = {
  __typename?: 'XeroFormattedAccountSummary';
  activeAccounts: Scalars['Int']['output'];
  archivedAccounts: Scalars['Int']['output'];
  byClass: Array<XeroClassGroup>;
  byStatus: XeroStatusGroup;
  byType: Array<XeroTypeGroup>;
  totalAccounts: Scalars['Int']['output'];
};

export type XeroFormattedSummaryResponse = {
  __typename?: 'XeroFormattedSummaryResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  summary?: Maybe<XeroFormattedAccountSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroLongevityInfo = {
  __typename?: 'XeroLongevityInfo';
  explanation: Scalars['String']['output'];
  needsReconnection: Scalars['Boolean']['output'];
  remainingDays: Scalars['Int']['output'];
  totalDuration: Scalars['String']['output'];
};

export type XeroOAuthResponse = {
  __typename?: 'XeroOAuthResponse';
  authorizationUrl?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  scopes?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  tokenInfo?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type XeroProject = {
  __typename?: 'XeroProject';
  contactId?: Maybe<Scalars['String']['output']>;
  creditNoteAmount?: Maybe<Scalars['Float']['output']>;
  currencyCode?: Maybe<Scalars['String']['output']>;
  deadlineUtc?: Maybe<Scalars['DateTime']['output']>;
  deposit?: Maybe<Scalars['Float']['output']>;
  depositApplied?: Maybe<Scalars['Float']['output']>;
  expenseAmountInvoiced?: Maybe<Scalars['Float']['output']>;
  expenseAmountToBeInvoiced?: Maybe<Scalars['Float']['output']>;
  minutesLogged?: Maybe<Scalars['Int']['output']>;
  minutesToBeInvoiced?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  projectAmountInvoiced?: Maybe<Scalars['Float']['output']>;
  projectId: Scalars['String']['output'];
  status?: Maybe<Scalars['String']['output']>;
  taskAmountInvoiced?: Maybe<Scalars['Float']['output']>;
  taskAmountToBeInvoiced?: Maybe<Scalars['Float']['output']>;
  totalExpenseAmount?: Maybe<Scalars['Float']['output']>;
  totalInvoiced?: Maybe<Scalars['Float']['output']>;
  totalTaskAmount?: Maybe<Scalars['Float']['output']>;
  totalToBeInvoiced?: Maybe<Scalars['Float']['output']>;
  updatedDateUtc?: Maybe<Scalars['DateTime']['output']>;
};

export type XeroProjectsResponse = {
  __typename?: 'XeroProjectsResponse';
  connectionId: Scalars['String']['output'];
  dataStored: Scalars['Boolean']['output'];
  error?: Maybe<Scalars['String']['output']>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  message: Scalars['String']['output'];
  projects?: Maybe<Array<XeroProject>>;
  success: Scalars['Boolean']['output'];
  syncDetails?: Maybe<XeroSyncDetailsProjects>;
  tokenRefreshed: Scalars['Boolean']['output'];
  totalStoredProjects?: Maybe<Scalars['Int']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
};

export type XeroRecentAccountChange = {
  __typename?: 'XeroRecentAccountChange';
  accountId: Scalars['String']['output'];
  accountName: Scalars['String']['output'];
  accountType: Scalars['String']['output'];
  actionType: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  datetime: Scalars['String']['output'];
  details: Scalars['String']['output'];
  hasDetails: Scalars['Boolean']['output'];
  historyId?: Maybe<Scalars['String']['output']>;
  isRecent: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type XeroRecentChange = {
  __typename?: 'XeroRecentChange';
  actionType: Scalars['String']['output'];
  changes: Scalars['String']['output'];
  contactId: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactType: Scalars['String']['output'];
  datetime: Scalars['String']['output'];
  details: Scalars['String']['output'];
  hasDetails: Scalars['Boolean']['output'];
  historyId?: Maybe<Scalars['String']['output']>;
  isRecent: Scalars['Boolean']['output'];
  timestamp: Scalars['String']['output'];
  user: Scalars['String']['output'];
};

export type XeroRecentChangesResponse = {
  __typename?: 'XeroRecentChangesResponse';
  accountChanges?: Maybe<Array<XeroRecentAccountChange>>;
  changes?: Maybe<Array<XeroRecentChange>>;
  connectionId: Scalars['String']['output'];
  contactChanges?: Maybe<Array<XeroRecentChange>>;
  count?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  mode?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type XeroRecentUpdate = {
  __typename?: 'XeroRecentUpdate';
  accountId?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedDate: Scalars['DateTime']['output'];
};

export type XeroSearchInput = {
  accountType?: InputMaybe<Scalars['String']['input']>;
  className?: InputMaybe<Scalars['String']['input']>;
  searchTerm: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type XeroSearchResponse = {
  __typename?: 'XeroSearchResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  searchResult?: Maybe<XeroSearchResult>;
  success: Scalars['Boolean']['output'];
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroSearchResult = {
  __typename?: 'XeroSearchResult';
  activeMatches: Scalars['Int']['output'];
  archivedMatches: Scalars['Int']['output'];
  connectionId: Scalars['String']['output'];
  fetchedAt: Scalars['DateTime']['output'];
  filtersApplied: Scalars['String']['output'];
  searchResults: Array<XeroAccount>;
  searchTerm: Scalars['String']['output'];
  totalMatches: Scalars['Int']['output'];
};

export type XeroStatusGroup = {
  __typename?: 'XeroStatusGroup';
  ACTIVE: Scalars['Int']['output'];
  ARCHIVED: Scalars['Int']['output'];
};

export type XeroSyncDetails = {
  __typename?: 'XeroSyncDetails';
  newAccounts: Scalars['Int']['output'];
  syncSuccess: Scalars['Boolean']['output'];
  totalProcessed: Scalars['Int']['output'];
  unchangedAccounts: Scalars['Int']['output'];
  updatedAccounts: Scalars['Int']['output'];
};

export type XeroSyncDetailsProjects = {
  __typename?: 'XeroSyncDetailsProjects';
  newProjects: Scalars['Int']['output'];
  syncSuccess: Scalars['Boolean']['output'];
  totalProcessed: Scalars['Int']['output'];
  unchangedProjects: Scalars['Int']['output'];
  updatedProjects: Scalars['Int']['output'];
};

export type XeroTokenInfo = {
  __typename?: 'XeroTokenInfo';
  accessTokenExpiresAt?: Maybe<Scalars['DateTime']['output']>;
  autoRefreshEnabled: Scalars['Boolean']['output'];
  connectionAgeDays: Scalars['Int']['output'];
  hasLongLastingRefresh: Scalars['Boolean']['output'];
  isExpired: Scalars['Boolean']['output'];
  minutesUntilExpiry: Scalars['Int']['output'];
  refreshBufferMinutes: Scalars['Int']['output'];
};

export type XeroTypeGroup = {
  __typename?: 'XeroTypeGroup';
  accounts: Array<XeroFormattedAccount>;
  class: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  typeName: Scalars['String']['output'];
};

export type XeroTypeSpecificResponse = {
  __typename?: 'XeroTypeSpecificResponse';
  connectionId: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  summary?: Maybe<XeroTypeSpecificSummary>;
  tokenRefreshed: Scalars['Boolean']['output'];
};

export type XeroTypeSpecificSummary = {
  __typename?: 'XeroTypeSpecificSummary';
  accountType: Scalars['String']['output'];
  accounts: Array<XeroAccount>;
  activeCount: Scalars['Int']['output'];
  archivedCount: Scalars['Int']['output'];
  classStatistics: Array<XeroClassStatistics>;
  connectionId: Scalars['String']['output'];
  description: Scalars['String']['output'];
  fetchedAt: Scalars['DateTime']['output'];
  totalCount: Scalars['Int']['output'];
};

export type XeroTypeStatistics = {
  __typename?: 'XeroTypeStatistics';
  activeCount: Scalars['Int']['output'];
  archivedCount: Scalars['Int']['output'];
  count: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type DeleteDocumentMutationVariables = Exact<{
  documentId: Scalars['String']['input'];
  deleteFromS3: Scalars['Boolean']['input'];
}>;


export type DeleteDocumentMutation = { __typename?: 'Mutation', deleteDocument: { __typename?: 'DeleteDocumentResult', ok: boolean, deleted: boolean, error?: string | null, message?: string | null } };

export type ProcessStageActionMutationVariables = Exact<{
  instanceId: Scalars['String']['input'];
  action: Scalars['String']['input'];
  comments?: InputMaybe<Scalars['String']['input']>;
}>;


export type ProcessStageActionMutation = { __typename?: 'Mutation', processStageAction: { __typename?: 'ProcessStageActionResult', ok: boolean, action: string, completed?: boolean | null, rejected?: boolean | null, resumed?: boolean | null, workflowStatus?: string | null, documentStatus?: string | null, error?: string | null, googleDriveResult?: string | null, nextStage?: { __typename?: 'NextStageType', name: string, order: number, assignedTo?: string | null, dueDays?: number | null } | null } };

export type UpdateExtractedDataMutationVariables = Exact<{
  fileId: Scalars['String']['input'];
  input: Scalars['JSON']['input'];
}>;


export type UpdateExtractedDataMutation = { __typename?: 'Mutation', updateExtractedData: any };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'Mutation', updateUser?: { __typename?: 'UserUpdateResponse', success: boolean, message?: string | null } | null };

export type UploadFileViaInviteMutationVariables = Exact<{
  inviteUuid: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
}>;


export type UploadFileViaInviteMutation = { __typename?: 'Mutation', uploadFileViaInvite: { __typename?: 'FileUploadResponse', success: boolean, message: string, branchId?: string | null, folderId?: string | null, uploadedFiles?: Array<string> | null, duplicateFiles?: Array<string> | null, uploadedCount?: number | null, duplicateCount?: number | null, taskIds?: Array<string> | null } };

export type UploadMultipleMutationVariables = Exact<{
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
  branchId: Scalars['String']['input'];
}>;


export type UploadMultipleMutation = { __typename?: 'Mutation', uploadFile: { __typename?: 'FileUploadResponse', success: boolean, message: string, branchId?: string | null, folderId?: string | null, taskIds?: Array<string> | null } };

export type GetCurrentUserDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserDataQuery = { __typename?: 'Query', getMyProfile: { __typename?: 'UserProfileType', id: string, email?: string | null, role?: string | null, licenses?: any | null, subscription?: any | null, isTrial?: boolean | null, trialStartedAt?: string | null, isTrialExpired?: boolean | null, trialDaysRemaining?: number | null, trialShouldShowWarning?: boolean | null, first_name?: string | null, last_name?: string | null, profile_image?: string | null, organization_name: string, organization_number: string, organization_code: string, is_onboarding_complete?: boolean | null, is_onboarding_email_sent?: boolean | null, folders?: Array<{ __typename?: 'FolderType', id: string, name: string, isActive: boolean }> | null, packageDetails?: { __typename?: 'PackageDetailsType', packageName: string, features: Array<{ __typename?: 'FeatureLimitationType', featureName: string, isIncluded: boolean }> } | null, roleBranchAssignments?: Array<{ __typename?: 'RoleBranchAssignmentType', roleId: string, roleName: string, permissions: Array<string>, assignAll: boolean, branchInfo: Array<{ __typename?: 'BranchInfoType', id: string, name: string }> }> | null } };

export type GetExtractedDataQueryVariables = Exact<{
  invoiceId: Scalars['String']['input'];
}>;


export type GetExtractedDataQuery = { __typename?: 'Query', getExractedData: any };

export type GetProcessedDocumentsQueryVariables = Exact<{
  status?: InputMaybe<StringFilter>;
  stageStatus?: InputMaybe<StringFilter>;
  query?: InputMaybe<Scalars['String']['input']>;
  fromDate?: InputMaybe<Scalars['String']['input']>;
  filterByDate?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetProcessedDocumentsQuery = { __typename?: 'Query', documentsByStatus: { __typename?: 'DocumentTrackingResultType', noWorkflowCount: number, totalDocuments: number, inProgressCount: number, completedCount: number, onHoldCount: number, pendingCount: number, stageCount?: any | null, rejectedCount?: number | null, totalPages?: number | null, totalAmount?: number | null, documents: Array<{ __typename?: 'DocumentTrackingType', id: string, extraData?: any | null, googleDriveUrl?: string | null, googleDriveUploaded: boolean, currentStageName?: string | null, currentStageType?: string | null, folderId: string, createdAt: string, invoiceDataId: string, s3Urls: string, updatedAt: string, workflowStatus: string, documentName?: string | null, fileFormat?: string | null, businessName?: string | null, orgName?: string | null, clientName?: string | null, documentType?: string | null, documentHighLevelType?: string | null, workflowName?: string | null, workflowDocumentInstanceId?: string | null, commentCount?: number | null, uploadedByDetails?: any | null, issueDate?: string | null, tags?: Array<string> | null, isMappingConfirmed?: boolean | null, nextStage?: string | null, wfStageStatus?: string | null, documentStatus?: string | null, amount?: string | null, invoiceNumber?: string | null, reconciled: boolean }> } };

export type GetUploadedInvoiceStatusQueryVariables = Exact<{
  taskIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetUploadedInvoiceStatusQuery = { __typename?: 'Query', multipleTasksStatus: Array<{ __typename?: 'TaskStatus', taskId: string, status: string, result?: string | null, error?: string | null, progress?: { __typename?: 'TaskProgressInfo', current: number, total: number, stage: string } | null }> };

export type SearchXeroAccountsQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchXeroAccountsQuery = { __typename?: 'Query', getAllXeroAccounts: { __typename?: 'PaginatedAccounts', results: Array<any>, total: number, page: number, pageSize: number, totalPages: number, hasNext: boolean, hasPrevious: boolean } };


export const DeleteDocumentDocument = gql`
    mutation DeleteDocument($documentId: String!, $deleteFromS3: Boolean!) {
  deleteDocument(documentId: $documentId, deleteFromS3: $deleteFromS3) {
    ok
    deleted
    error
    message
  }
}
    `;
export type DeleteDocumentMutationFn = Apollo.MutationFunction<DeleteDocumentMutation, DeleteDocumentMutationVariables>;

/**
 * __useDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDocumentMutation, { data, loading, error }] = useDeleteDocumentMutation({
 *   variables: {
 *      documentId: // value for 'documentId'
 *      deleteFromS3: // value for 'deleteFromS3'
 *   },
 * });
 */
export function useDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(DeleteDocumentDocument, options);
      }
export type DeleteDocumentMutationHookResult = ReturnType<typeof useDeleteDocumentMutation>;
export type DeleteDocumentMutationResult = Apollo.MutationResult<DeleteDocumentMutation>;
export type DeleteDocumentMutationOptions = Apollo.BaseMutationOptions<DeleteDocumentMutation, DeleteDocumentMutationVariables>;
export const ProcessStageActionDocument = gql`
    mutation ProcessStageAction($instanceId: String!, $action: String!, $comments: String) {
  processStageAction(
    instanceId: $instanceId
    action: $action
    comments: $comments
  ) {
    ok
    action
    completed
    rejected
    resumed
    nextStage {
      name
      order
      assignedTo
      dueDays
    }
    workflowStatus
    documentStatus
    error
    googleDriveResult
  }
}
    `;
export type ProcessStageActionMutationFn = Apollo.MutationFunction<ProcessStageActionMutation, ProcessStageActionMutationVariables>;

/**
 * __useProcessStageActionMutation__
 *
 * To run a mutation, you first call `useProcessStageActionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useProcessStageActionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [processStageActionMutation, { data, loading, error }] = useProcessStageActionMutation({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *      action: // value for 'action'
 *      comments: // value for 'comments'
 *   },
 * });
 */
export function useProcessStageActionMutation(baseOptions?: Apollo.MutationHookOptions<ProcessStageActionMutation, ProcessStageActionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ProcessStageActionMutation, ProcessStageActionMutationVariables>(ProcessStageActionDocument, options);
      }
export type ProcessStageActionMutationHookResult = ReturnType<typeof useProcessStageActionMutation>;
export type ProcessStageActionMutationResult = Apollo.MutationResult<ProcessStageActionMutation>;
export type ProcessStageActionMutationOptions = Apollo.BaseMutationOptions<ProcessStageActionMutation, ProcessStageActionMutationVariables>;
export const UpdateExtractedDataDocument = gql`
    mutation UpdateExtractedData($fileId: String!, $input: JSON!) {
  updateExtractedData(fileId: $fileId, input: $input)
}
    `;
export type UpdateExtractedDataMutationFn = Apollo.MutationFunction<UpdateExtractedDataMutation, UpdateExtractedDataMutationVariables>;

/**
 * __useUpdateExtractedDataMutation__
 *
 * To run a mutation, you first call `useUpdateExtractedDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateExtractedDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateExtractedDataMutation, { data, loading, error }] = useUpdateExtractedDataMutation({
 *   variables: {
 *      fileId: // value for 'fileId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateExtractedDataMutation(baseOptions?: Apollo.MutationHookOptions<UpdateExtractedDataMutation, UpdateExtractedDataMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateExtractedDataMutation, UpdateExtractedDataMutationVariables>(UpdateExtractedDataDocument, options);
      }
export type UpdateExtractedDataMutationHookResult = ReturnType<typeof useUpdateExtractedDataMutation>;
export type UpdateExtractedDataMutationResult = Apollo.MutationResult<UpdateExtractedDataMutation>;
export type UpdateExtractedDataMutationOptions = Apollo.BaseMutationOptions<UpdateExtractedDataMutation, UpdateExtractedDataMutationVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($input: UpdateUserInput!) {
  updateUser(input: $input) {
    success
    message
  }
}
    `;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UploadFileViaInviteDocument = gql`
    mutation UploadFileViaInvite($inviteUuid: String!, $files: [Upload!]!) {
  uploadFileViaInvite(inviteUuid: $inviteUuid, files: $files) {
    success
    message
    branchId
    folderId
    uploadedFiles
    duplicateFiles
    uploadedCount
    duplicateCount
    taskIds
  }
}
    `;
export type UploadFileViaInviteMutationFn = Apollo.MutationFunction<UploadFileViaInviteMutation, UploadFileViaInviteMutationVariables>;

/**
 * __useUploadFileViaInviteMutation__
 *
 * To run a mutation, you first call `useUploadFileViaInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadFileViaInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadFileViaInviteMutation, { data, loading, error }] = useUploadFileViaInviteMutation({
 *   variables: {
 *      inviteUuid: // value for 'inviteUuid'
 *      files: // value for 'files'
 *   },
 * });
 */
export function useUploadFileViaInviteMutation(baseOptions?: Apollo.MutationHookOptions<UploadFileViaInviteMutation, UploadFileViaInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadFileViaInviteMutation, UploadFileViaInviteMutationVariables>(UploadFileViaInviteDocument, options);
      }
export type UploadFileViaInviteMutationHookResult = ReturnType<typeof useUploadFileViaInviteMutation>;
export type UploadFileViaInviteMutationResult = Apollo.MutationResult<UploadFileViaInviteMutation>;
export type UploadFileViaInviteMutationOptions = Apollo.BaseMutationOptions<UploadFileViaInviteMutation, UploadFileViaInviteMutationVariables>;
export const UploadMultipleDocument = gql`
    mutation UploadMultiple($files: [Upload!]!, $branchId: String!) {
  uploadFile(input: {files: $files, branchId: $branchId}) {
    success
    message
    branchId
    folderId
    taskIds
  }
}
    `;
export type UploadMultipleMutationFn = Apollo.MutationFunction<UploadMultipleMutation, UploadMultipleMutationVariables>;

/**
 * __useUploadMultipleMutation__
 *
 * To run a mutation, you first call `useUploadMultipleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadMultipleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadMultipleMutation, { data, loading, error }] = useUploadMultipleMutation({
 *   variables: {
 *      files: // value for 'files'
 *      branchId: // value for 'branchId'
 *   },
 * });
 */
export function useUploadMultipleMutation(baseOptions?: Apollo.MutationHookOptions<UploadMultipleMutation, UploadMultipleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadMultipleMutation, UploadMultipleMutationVariables>(UploadMultipleDocument, options);
      }
export type UploadMultipleMutationHookResult = ReturnType<typeof useUploadMultipleMutation>;
export type UploadMultipleMutationResult = Apollo.MutationResult<UploadMultipleMutation>;
export type UploadMultipleMutationOptions = Apollo.BaseMutationOptions<UploadMultipleMutation, UploadMultipleMutationVariables>;
export const GetCurrentUserDataDocument = gql`
    query GetCurrentUserData {
  getMyProfile {
    id
    first_name: firstName
    last_name: lastName
    email
    role
    profile_image: profileImage
    organization_name: organizationName
    organization_number: organizationNumber
    organization_code: organizationCode
    is_onboarding_complete: isOnboardingComplete
    is_onboarding_email_sent: isOnboardingEmailSent
    folders {
      id
      name
      isActive
    }
    packageDetails {
      packageName
      features {
        featureName
        isIncluded
      }
    }
    roleBranchAssignments {
      roleId
      roleName
      permissions
      branchInfo {
        id
        name
      }
      assignAll
    }
    licenses
    subscription
    isTrial
    trialStartedAt
    isTrialExpired
    trialDaysRemaining
    trialShouldShowWarning
  }
}
    `;

/**
 * __useGetCurrentUserDataQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserDataQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserDataQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>(GetCurrentUserDataDocument, options);
      }
export function useGetCurrentUserDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>(GetCurrentUserDataDocument, options);
        }
// @ts-ignore
export function useGetCurrentUserDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>;
export function useGetCurrentUserDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetCurrentUserDataQuery | undefined, GetCurrentUserDataQueryVariables>;
export function useGetCurrentUserDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>(GetCurrentUserDataDocument, options);
        }
export type GetCurrentUserDataQueryHookResult = ReturnType<typeof useGetCurrentUserDataQuery>;
export type GetCurrentUserDataLazyQueryHookResult = ReturnType<typeof useGetCurrentUserDataLazyQuery>;
export type GetCurrentUserDataSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserDataSuspenseQuery>;
export type GetCurrentUserDataQueryResult = Apollo.QueryResult<GetCurrentUserDataQuery, GetCurrentUserDataQueryVariables>;
export const GetExtractedDataDocument = gql`
    query GetExtractedData($invoiceId: String!) {
  getExractedData(invoiceId: $invoiceId)
}
    `;

/**
 * __useGetExtractedDataQuery__
 *
 * To run a query within a React component, call `useGetExtractedDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetExtractedDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetExtractedDataQuery({
 *   variables: {
 *      invoiceId: // value for 'invoiceId'
 *   },
 * });
 */
export function useGetExtractedDataQuery(baseOptions: Apollo.QueryHookOptions<GetExtractedDataQuery, GetExtractedDataQueryVariables> & ({ variables: GetExtractedDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetExtractedDataQuery, GetExtractedDataQueryVariables>(GetExtractedDataDocument, options);
      }
export function useGetExtractedDataLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetExtractedDataQuery, GetExtractedDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetExtractedDataQuery, GetExtractedDataQueryVariables>(GetExtractedDataDocument, options);
        }
// @ts-ignore
export function useGetExtractedDataSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetExtractedDataQuery, GetExtractedDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetExtractedDataQuery, GetExtractedDataQueryVariables>;
export function useGetExtractedDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExtractedDataQuery, GetExtractedDataQueryVariables>): Apollo.UseSuspenseQueryResult<GetExtractedDataQuery | undefined, GetExtractedDataQueryVariables>;
export function useGetExtractedDataSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetExtractedDataQuery, GetExtractedDataQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetExtractedDataQuery, GetExtractedDataQueryVariables>(GetExtractedDataDocument, options);
        }
export type GetExtractedDataQueryHookResult = ReturnType<typeof useGetExtractedDataQuery>;
export type GetExtractedDataLazyQueryHookResult = ReturnType<typeof useGetExtractedDataLazyQuery>;
export type GetExtractedDataSuspenseQueryHookResult = ReturnType<typeof useGetExtractedDataSuspenseQuery>;
export type GetExtractedDataQueryResult = Apollo.QueryResult<GetExtractedDataQuery, GetExtractedDataQueryVariables>;
export const GetProcessedDocumentsDocument = gql`
    query GetProcessedDocuments($status: StringFilter, $stageStatus: StringFilter, $query: String, $fromDate: String, $filterByDate: String = "processing_date", $toDate: String, $tags: [String!]) {
  documentsByStatus(
    filterByDate: $filterByDate
    status: $status
    stageStatus: $stageStatus
    q: $query
    fromDate: $fromDate
    toDate: $toDate
    tags: $tags
  ) {
    documents {
      id
      extraData
      googleDriveUrl
      googleDriveUploaded
      currentStageName
      currentStageType
      folderId
      createdAt
      invoiceDataId
      s3Urls
      updatedAt
      workflowStatus
      documentName
      fileFormat
      businessName
      orgName
      clientName
      documentType
      documentHighLevelType
      workflowName
      documentHighLevelType
      workflowDocumentInstanceId
      commentCount
      uploadedByDetails
      currentStageType
      issueDate
      tags
      isMappingConfirmed
      nextStage
      workflowStatus
      wfStageStatus
      documentStatus
      amount
      invoiceNumber
      reconciled
    }
    noWorkflowCount
    totalDocuments
    inProgressCount
    completedCount
    onHoldCount
    pendingCount
    stageCount
    rejectedCount
    totalPages
    totalAmount
  }
}
    `;

/**
 * __useGetProcessedDocumentsQuery__
 *
 * To run a query within a React component, call `useGetProcessedDocumentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProcessedDocumentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProcessedDocumentsQuery({
 *   variables: {
 *      status: // value for 'status'
 *      stageStatus: // value for 'stageStatus'
 *      query: // value for 'query'
 *      fromDate: // value for 'fromDate'
 *      filterByDate: // value for 'filterByDate'
 *      toDate: // value for 'toDate'
 *      tags: // value for 'tags'
 *   },
 * });
 */
export function useGetProcessedDocumentsQuery(baseOptions?: Apollo.QueryHookOptions<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>(GetProcessedDocumentsDocument, options);
      }
export function useGetProcessedDocumentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>(GetProcessedDocumentsDocument, options);
        }
// @ts-ignore
export function useGetProcessedDocumentsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>;
export function useGetProcessedDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>): Apollo.UseSuspenseQueryResult<GetProcessedDocumentsQuery | undefined, GetProcessedDocumentsQueryVariables>;
export function useGetProcessedDocumentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>(GetProcessedDocumentsDocument, options);
        }
export type GetProcessedDocumentsQueryHookResult = ReturnType<typeof useGetProcessedDocumentsQuery>;
export type GetProcessedDocumentsLazyQueryHookResult = ReturnType<typeof useGetProcessedDocumentsLazyQuery>;
export type GetProcessedDocumentsSuspenseQueryHookResult = ReturnType<typeof useGetProcessedDocumentsSuspenseQuery>;
export type GetProcessedDocumentsQueryResult = Apollo.QueryResult<GetProcessedDocumentsQuery, GetProcessedDocumentsQueryVariables>;
export const GetUploadedInvoiceStatusDocument = gql`
    query GetUploadedInvoiceStatus($taskIds: [String!]!) {
  multipleTasksStatus(taskIds: $taskIds) {
    taskId
    status
    progress {
      current
      total
      stage
    }
    result
    error
  }
}
    `;

/**
 * __useGetUploadedInvoiceStatusQuery__
 *
 * To run a query within a React component, call `useGetUploadedInvoiceStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUploadedInvoiceStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUploadedInvoiceStatusQuery({
 *   variables: {
 *      taskIds: // value for 'taskIds'
 *   },
 * });
 */
export function useGetUploadedInvoiceStatusQuery(baseOptions: Apollo.QueryHookOptions<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables> & ({ variables: GetUploadedInvoiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>(GetUploadedInvoiceStatusDocument, options);
      }
export function useGetUploadedInvoiceStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>(GetUploadedInvoiceStatusDocument, options);
        }
// @ts-ignore
export function useGetUploadedInvoiceStatusSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>): Apollo.UseSuspenseQueryResult<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>;
export function useGetUploadedInvoiceStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>): Apollo.UseSuspenseQueryResult<GetUploadedInvoiceStatusQuery | undefined, GetUploadedInvoiceStatusQueryVariables>;
export function useGetUploadedInvoiceStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>(GetUploadedInvoiceStatusDocument, options);
        }
export type GetUploadedInvoiceStatusQueryHookResult = ReturnType<typeof useGetUploadedInvoiceStatusQuery>;
export type GetUploadedInvoiceStatusLazyQueryHookResult = ReturnType<typeof useGetUploadedInvoiceStatusLazyQuery>;
export type GetUploadedInvoiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetUploadedInvoiceStatusSuspenseQuery>;
export type GetUploadedInvoiceStatusQueryResult = Apollo.QueryResult<GetUploadedInvoiceStatusQuery, GetUploadedInvoiceStatusQueryVariables>;
export const SearchXeroAccountsDocument = gql`
    query SearchXeroAccounts($query: String, $page: Int, $pageSize: Int) {
  getAllXeroAccounts(query: $query, page: $page, pageSize: $pageSize) {
    results
    total
    page
    pageSize
    totalPages
    hasNext
    hasPrevious
  }
}
    `;

/**
 * __useSearchXeroAccountsQuery__
 *
 * To run a query within a React component, call `useSearchXeroAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchXeroAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchXeroAccountsQuery({
 *   variables: {
 *      query: // value for 'query'
 *      page: // value for 'page'
 *      pageSize: // value for 'pageSize'
 *   },
 * });
 */
export function useSearchXeroAccountsQuery(baseOptions?: Apollo.QueryHookOptions<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>(SearchXeroAccountsDocument, options);
      }
export function useSearchXeroAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>(SearchXeroAccountsDocument, options);
        }
// @ts-ignore
export function useSearchXeroAccountsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>;
export function useSearchXeroAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>): Apollo.UseSuspenseQueryResult<SearchXeroAccountsQuery | undefined, SearchXeroAccountsQueryVariables>;
export function useSearchXeroAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>(SearchXeroAccountsDocument, options);
        }
export type SearchXeroAccountsQueryHookResult = ReturnType<typeof useSearchXeroAccountsQuery>;
export type SearchXeroAccountsLazyQueryHookResult = ReturnType<typeof useSearchXeroAccountsLazyQuery>;
export type SearchXeroAccountsSuspenseQueryHookResult = ReturnType<typeof useSearchXeroAccountsSuspenseQuery>;
export type SearchXeroAccountsQueryResult = Apollo.QueryResult<SearchXeroAccountsQuery, SearchXeroAccountsQueryVariables>;