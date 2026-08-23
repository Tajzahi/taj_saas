import { pgTable, text, timestamp, boolean, varchar, uuid, numeric, integer, jsonb, decimal, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. Better Auth Core Tables
// ==========================================

export const user = pgTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role').default('kasir'), // owner | manager | kasir
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const session = pgTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: varchar('id', { length: 36 }).primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const verification = pgTable('verification', {
  id: varchar('id', { length: 36 }).primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==========================================
// 2. F&B Multi-Tenant Business Tables
// ==========================================

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain').notNull().unique(),
  adminSubdomain: text('admin_subdomain').notNull(),
  ownerSubdomain: text('owner_subdomain').notNull(),
  branding: jsonb('branding').$type<{
    logoUrl?: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    businessName?: string;
    whatsappNumber?: string;
    flatDeliveryFee?: number;
    minimumOrderAmount?: number;
    storeAddress?: string;
    googleMapsUrl?: string;
    openingHours?: string;
    qrisImageUrl?: string;
    bankInfo?: string;
    heroBannerUrl?: string;
    storeOpen?: boolean;
    cogsRate?: number;
    outletLat?: number;
    outletLng?: number;
    receiptHeader?: string;
    receiptFooter?: string;
    receiptPaperWidth?: string | number;
    taxRate?: number;
    taxRateBps?: number;
    serviceChargeRate?: number;
    serviceChargeRateBps?: number;
    enableQris?: boolean;
    enableBankTransfer?: boolean;
    enableCash?: boolean;
    brandName?: string;
  }>(),
  packageType: text('package_type').notNull().default('startup'), // startup | professional | enterprise
  isActive: boolean('is_active').default(true),
  settingsVersion: integer('settings_version').default(1).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 36 }).primaryKey(), // matches auth user id (user.id)
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'set null' }),
  email: text('email').notNull(),
  phone: text('phone'),
  bankAccount: text('bank_account'),
  shift: text('shift').default('Pagi'),
  role: text('role').notNull().default('kasir'), // owner | manager | kasir
  salary: numeric('salary', { precision: 12, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("profiles_tenantId_idx").on(table.tenantId),
  index("profiles_branchId_idx").on(table.branchId)
]);

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  address: text('address'),
  phone: text('phone'),
  picName: text('pic_name'),
  googleMapsUrl: text('google_maps_url'),
  outletLat: numeric('outlet_lat', { precision: 10, scale: 7 }),
  outletLng: numeric('outlet_lng', { precision: 10, scale: 7 }),
  isPrimary: boolean('is_primary').default(false).notNull(),
  acceptsOnlineOrders: boolean('accepts_online_orders').default(true).notNull(),
  deliveryZones: jsonb('delivery_zones').$type<{ maxDistanceKm: number; baseFee: number; perKmFee: number }[]>(),
  orderingMethods: jsonb('ordering_methods').$type<string[]>(),
  paymentMethods: jsonb('payment_methods').$type<string[]>(),
  operationalHours: text('operational_hours').default('08:00 - 22:00'),
  status: text('status').default('active').notNull(), // active | maintenance
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index("branches_tenantId_idx").on(table.tenantId)
]);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("categories_tenantId_idx").on(table.tenantId),
  uniqueIndex("categories_tenant_slug_idx").on(table.tenantId, table.slug)
]);

export const menuItems = pgTable('menu_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isAvailable: boolean('is_available').default(true).notNull(),
  isBestSeller: boolean('is_best_seller').default(false).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
  variants: jsonb('variants'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index("menuItems_tenantId_idx").on(table.tenantId),
  index("menuItems_categoryId_idx").on(table.categoryId),
  uniqueIndex("menu_items_tenant_slug_idx").on(table.tenantId, table.slug)
]);

export const menuVariants = pgTable('menu_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(),
  required: boolean('required').default(false).notNull(),
  options: jsonb('options').$type<{ name: string; price: number }[]>().notNull(),
}, (table) => [
  index("menuVariants_tenantId_idx").on(table.tenantId),
  index("menuVariants_menuItemId_idx").on(table.menuItemId)
]);

export const itemVariants = menuVariants;

export const toppings = pgTable('toppings', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').notNull(),
  name: text('name').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
}, (table) => [
  index("toppings_tenantId_idx").on(table.tenantId)
]);

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
}, (table) => [
  index("recipes_tenantId_idx").on(table.tenantId),
  index("recipes_menuItemId_idx").on(table.menuItemId)
]);

export const recipeIngredients = pgTable('recipe_ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
  ingredientName: text('ingredient_name').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  unit: text('unit').notNull(),
  costPerUnit: numeric('cost_per_unit', { precision: 10, scale: 2 }),
}, (table) => [
  index("recipeIngredients_recipeId_idx").on(table.recipeId)
]);

export const inventory = pgTable('inventory', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category').notNull(),
  stock: numeric('stock', { precision: 10, scale: 2 }).default('0').notNull(),
  minStock: numeric('min_stock', { precision: 10, scale: 2 }).default('0').notNull(),
  unit: text('unit').notNull(),
  cost: numeric('cost', { precision: 10, scale: 2 }).default('0').notNull(),
  supplier: text('supplier'),
  expiryDate: timestamp('expiry_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index("inventory_tenantId_idx").on(table.tenantId),
  index("inventory_branchId_idx").on(table.branchId)
]);

export const inventoryTransactions = pgTable('inventory_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  inventoryId: uuid('inventory_id').references(() => inventory.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  cost: numeric('cost', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  operatorName: text('operator_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("inv_trans_tenantId_idx").on(table.tenantId),
  index("inv_trans_inventoryId_idx").on(table.inventoryId)
]);

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  orderCode: text('order_code').notNull().unique(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerTokenHash: text('customer_token_hash'),
  idempotencyKey: text('idempotency_key'),
  idempotencyRequestHash: text('idempotency_request_hash'),
  deliveryType: text('delivery_type').notNull(), // pickup | delivery | dine_in | takeaway
  deliveryAddress: text('delivery_address'),
  deliveryDistance: numeric('delivery_distance', { precision: 8, scale: 2 }),
  deliveryLat: numeric('delivery_lat', { precision: 10, scale: 7 }),
  deliveryLng: numeric('delivery_lng', { precision: 10, scale: 7 }),
  deliveryFee: decimal('deliveryFee', { mode: 'number' }).default(0),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  taxAmount: numeric('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  serviceChargeAmount: numeric('service_charge_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('received'), // received | processing | ready | completed | cancelled
  paymentMethod: text('payment_method').default('cod').notNull(), // cod | transfer | qris | cash
  paymentStatus: text('payment_status').default('pending').notNull(), // pending | waiting_verification | paid | failed
  paymentProofUrl: text('payment_proof_url'),
  pricingSnapshot: jsonb('pricing_snapshot').$type<Record<string, unknown>>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index("orders_tenantId_idx").on(table.tenantId),
  index("orders_branchId_idx").on(table.branchId),
  index("orders_tenant_created_idx").on(table.tenantId, table.createdAt),
  index("orders_tenant_status_payment_idx").on(table.tenantId, table.status, table.paymentStatus),
  uniqueIndex("orders_tenant_idempotency_idx").on(table.tenantId, table.idempotencyKey)
]);

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id'),
  menuItemName: text('menu_item_name').notNull(),
  variantName: text('variant_name'),
  variantSelection: jsonb('variant_selection').$type<Record<string, unknown>>(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  note: text('note'),
}, (table) => [
  index("orderItems_orderId_idx").on(table.orderId)
]);

export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  operatorId: varchar('operator_id', { length: 36 }),
  operatorName: text('operator_name').notNull(),
  openedAt: timestamp('opened_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  startingCash: numeric('starting_cash', { precision: 10, scale: 2 }).notNull(),
  actualCash: numeric('actual_cash', { precision: 10, scale: 2 }),
  drift: numeric('drift', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('open'), // open | closed
}, (table) => [
  index("shifts_tenantId_idx").on(table.tenantId)
]);

export const shiftLogs = pgTable('shift_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  shiftId: uuid('shift_id').references(() => shifts.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(), // open, close, cash_in, cash_out
  amount: numeric('amount', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("shiftLogs_tenantId_idx").on(table.tenantId)
]);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("auditLogs_tenantId_idx").on(table.tenantId)
]);

// ==========================================
// 2.5 Additional Tables (Promos, Files, Approvals, Invitations, Outbox, Cancellation)
// ==========================================

export const promos = pgTable('promos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').notNull(),
  type: text('type').notNull(), // 'percent' | 'fixed'
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  minOrder: numeric('min_order', { precision: 10, scale: 2 }).default('0').notNull(),
  targetCategory: text('target_category').default('all').notNull(), // Category slug or 'all'
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("promos_tenantId_idx").on(table.tenantId),
  uniqueIndex("promos_tenant_code_idx").on(table.tenantId, table.code)
]);

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  content: text('content').notNull(), // base64 string
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("files_tenantId_idx").on(table.tenantId),
  index("files_orderId_idx").on(table.orderId)
]);

export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // purchase_order | discount | refund
  title: text('title').notNull(),
  requestedBy: text('requested_by').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).default('0').notNull(),
  priority: text('priority').notNull(), // low | medium | high | critical
  status: text('status').notNull().default('pending'), // pending | approved | rejected
  requestedAt: timestamp('requested_at').defaultNow().notNull(),
  notes: text('notes'),
}, (table) => [
  index("approvals_tenantId_idx").on(table.tenantId),
  index("approvals_branchId_idx").on(table.branchId)
]);

export const employeeInvitations = pgTable('employee_invitations', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // manager | kasir | kitchen
  salary: numeric('salary', { precision: 12, scale: 2 }).default('0'),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  invitedBy: varchar('invited_by', { length: 36 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("invitations_tenantId_idx").on(table.tenantId),
  index("invitations_tokenHash_idx").on(table.tokenHash)
]);

export const customRoles = pgTable('custom_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("custom_roles_tenantId_idx").on(table.tenantId),
  uniqueIndex("custom_roles_tenant_code_idx").on(table.tenantId, table.code)
]);

export const orderCancellationRequests = pgTable('order_cancellation_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  reason: text('reason').notNull(),
  bankName: text('bank_name'),
  accountNumber: text('account_number'),
  accountHolder: text('account_holder'),
  status: text('status').default('pending').notNull(), // pending | approved | rejected
  reviewedBy: varchar('reviewed_by', { length: 36 }),
  reviewedAt: timestamp('reviewed_at'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("cancellation_tenantId_idx").on(table.tenantId),
  index("cancellation_orderId_idx").on(table.orderId)
]);

export const outboxEvents = pgTable('outbox_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  aggregateType: text('aggregate_type').notNull(), // order | payment | shift
  aggregateId: text('aggregate_id').notNull(),
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  status: text('status').default('pending').notNull(), // pending | processing | published | failed
  retryCount: integer('retry_count').default(0).notNull(),
  lastError: text('last_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => [
  index("outbox_tenant_status_idx").on(table.tenantId, table.status),
  index("outbox_status_created_idx").on(table.status, table.createdAt)
]);

export const paymentTransactions = pgTable('payment_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(), // qris | transfer | cod | cash
  status: text('status').notNull(), // pending | success | failed | refunded
  referenceNumber: text('reference_number'),
  proofUrl: text('proof_url'),
  verifiedBy: varchar('verified_by', { length: 36 }),
  verifiedAt: timestamp('verified_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("pay_trans_tenantId_idx").on(table.tenantId),
  index("pay_trans_orderId_idx").on(table.orderId)
]);

export const productionPlans = pgTable('production_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  planDate: text('plan_date').notNull(), // YYYY-MM-DD
  status: text('status').default('draft').notNull(), // draft | in_progress | completed
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  index("prod_plans_tenantId_idx").on(table.tenantId),
  index("prod_plans_branchId_idx").on(table.branchId)
]);

export const productionPlanItems = pgTable('production_plan_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  planId: uuid('plan_id').references(() => productionPlans.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  targetQuantity: integer('target_quantity').notNull(),
  actualQuantity: integer('actual_quantity').default(0).notNull(),
  status: text('status').default('pending').notNull(), // pending | completed
}, (table) => [
  index("prod_plan_items_planId_idx").on(table.planId),
]);

export const shiftTypes = pgTable('shift_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  isOff: boolean('is_off').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("shift_types_tenantId_idx").on(table.tenantId)
]);

// ==========================================
// 3. Relationships Definitions
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const tenantRelations = relations(tenants, ({ many }) => ({
  profiles: many(profiles),
  branches: many(branches),
  categories: many(categories),
  menuItems: many(menuItems),
  inventory: many(inventory),
  orders: many(orders),
  shifts: many(shifts),
  promos: many(promos),
  files: many(files),
  approvals: many(approvals),
  employeeInvitations: many(employeeInvitations),
  outboxEvents: many(outboxEvents),
  paymentTransactions: many(paymentTransactions),
  productionPlans: many(productionPlans),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemRelations = relations(menuItems, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [menuItems.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  variants: many(itemVariants),
  recipes: many(recipes),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [orders.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  items: many(orderItems),
  files: many(files),
  cancellationRequests: many(orderCancellationRequests),
  paymentTransactions: many(paymentTransactions),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}));

export const shiftRelations = relations(shifts, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [shifts.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [shifts.branchId],
    references: [branches.id],
  }),
  logs: many(shiftLogs),
}));

export const shiftLogRelations = relations(shiftLogs, ({ one }) => ({
  shift: one(shifts, {
    fields: [shiftLogs.shiftId],
    references: [shifts.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [inventory.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [inventory.branchId],
    references: [branches.id],
  }),
  transactions: many(inventoryTransactions),
}));

export const inventoryTransactionRelations = relations(inventoryTransactions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [inventoryTransactions.tenantId],
    references: [tenants.id],
  }),
  inventory: one(inventory, {
    fields: [inventoryTransactions.inventoryId],
    references: [inventory.id],
  }),
  branch: one(branches, {
    fields: [inventoryTransactions.branchId],
    references: [branches.id],
  }),
}));

export const productionPlanRelations = relations(productionPlans, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [productionPlans.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [productionPlans.branchId],
    references: [branches.id],
  }),
  items: many(productionPlanItems),
}));

export const productionPlanItemRelations = relations(productionPlanItems, ({ one }) => ({
  plan: one(productionPlans, {
    fields: [productionPlanItems.planId],
    references: [productionPlans.id],
  }),
  menuItem: one(menuItems, {
    fields: [productionPlanItems.menuItemId],
    references: [menuItems.id],
  }),
}));
