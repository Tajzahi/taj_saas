import { pgTable, uuid, text, integer, boolean, timestamp, numeric, jsonb, varchar, index, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
// 1. Better Auth Tables
// ==========================================

export const user = pgTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: varchar("role", { length: 50 }).default("kasir"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: varchar("identifier", { length: 255 }).notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

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
    primaryColor: string;
    secondaryColor: string;
    businessName: string;
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
  }>(),
  packageType: text('package_type').notNull().default('startup'), // startup | professional | enterprise
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: varchar('id', { length: 36 }).primaryKey(), // matches auth user id (user.id)
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull().default('kasir'), // owner | manager | kasir
  salary: numeric('salary', { precision: 12, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("profiles_tenantId_idx").on(table.tenantId)
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
  orderingMethods: jsonb('ordering_methods').$type<string[]>(),
  paymentMethods: jsonb('payment_methods').$type<string[]>(),
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
}, (table) => [
  index("categories_tenantId_idx").on(table.tenantId)
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
  variants: jsonb('variants').$type<{
    label: string;
    required: boolean;
    options: { id: string; name: string; priceModifier: number }[];
  }[]>(),
}, (table) => [
  index("menuItems_tenantId_idx").on(table.tenantId),
  index("menuItems_categoryId_idx").on(table.categoryId)
]);

export const menuVariants = pgTable('menu_variants', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  label: text('label').notNull(),
  required: boolean('required').default(false).notNull(),
  options: jsonb('options').$type<{ id: string; name: string; priceModifier: number }[]>().notNull(),
}, (table) => [
  index("menuVariants_tenantId_idx").on(table.tenantId),
  index("menuVariants_menuItemId_idx").on(table.menuItemId)
]);

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
  deliveryType: text('delivery_type').notNull(), // pickup | delivery
  deliveryAddress: text('delivery_address'),
  deliveryFee: decimal('deliveryFee', { mode: 'number' }).default(0),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('received'), // received | processing | ready | completed | cancelled
  paymentMethod: text('payment_method').default('cod').notNull(), // cod | qris
  paymentStatus: text('payment_status').default('pending').notNull(), // pending | waiting_verification | paid | failed
  paymentProofUrl: text('payment_proof_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("orders_tenantId_idx").on(table.tenantId),
  index("orders_branchId_idx").on(table.branchId)
]);

export const orderItems = pgTable('order_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id'),
  menuItemName: text('menu_item_name').notNull(),
  variantName: text('variant_name'),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric('total_price', { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  index("orderItems_orderId_idx").on(table.orderId)
]);

export const shifts = pgTable('shifts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  branchId: uuid('branch_id').references(() => branches.id, { onDelete: 'cascade' }),
  operatorId: uuid('operator_id'),
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
// 2.5 Additional Tables (Promos, Files)
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
  index("promos_code_idx").on(table.code)
]);

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id, { onDelete: 'cascade' }).notNull(),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  content: text('content').notNull(), // base64 string
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index("files_tenantId_idx").on(table.tenantId)
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

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ many }) => ({
  profiles: many(profiles),
  branches: many(branches),
  categories: many(categories),
  menuItems: many(menuItems),
  menuVariants: many(menuVariants),
  toppings: many(toppings),
  recipes: many(recipes),
  orders: many(orders),
  shifts: many(shifts),
  shiftLogs: many(shiftLogs),
  auditLogs: many(auditLogs),
  inventory: many(inventory),
  inventoryTransactions: many(inventoryTransactions),
  approvals: many(approvals),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  tenant: one(tenants, {
    fields: [profiles.tenantId],
    references: [tenants.id],
  }),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [branches.tenantId],
    references: [tenants.id],
  }),
  inventory: many(inventory),
  inventoryTransactions: many(inventoryTransactions),
  orders: many(orders),
  shifts: many(shifts),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [categories.tenantId],
    references: [tenants.id],
  }),
  menuItems: many(menuItems),
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [menuItems.tenantId],
    references: [tenants.id],
  }),
  category: one(categories, {
    fields: [menuItems.categoryId],
    references: [categories.id],
  }),
  recipes: many(recipes),
  menuVariants: many(menuVariants),
}));

export const menuVariantsRelations = relations(menuVariants, ({ one }) => ({
  tenant: one(tenants, {
    fields: [menuVariants.tenantId],
    references: [tenants.id],
  }),
  menuItem: one(menuItems, {
    fields: [menuVariants.menuItemId],
    references: [menuItems.id],
  }),
}));

export const toppingsRelations = relations(toppings, ({ one }) => ({
  tenant: one(tenants, {
    fields: [toppings.tenantId],
    references: [tenants.id],
  }),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [recipes.tenantId],
    references: [tenants.id],
  }),
  menuItem: one(menuItems, {
    fields: [recipes.menuItemId],
    references: [menuItems.id],
  }),
  ingredients: many(recipeIngredients),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeIngredients.recipeId],
    references: [recipes.id],
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

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
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

export const ordersRelations = relations(orders, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [orders.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [orders.branchId],
    references: [branches.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
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

export const shiftLogsRelations = relations(shiftLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [shiftLogs.tenantId],
    references: [tenants.id],
  }),
  shift: one(shifts, {
    fields: [shiftLogs.shiftId],
    references: [shifts.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [auditLogs.tenantId],
    references: [tenants.id],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  tenant: one(tenants, {
    fields: [approvals.tenantId],
    references: [tenants.id],
  }),
  branch: one(branches, {
    fields: [approvals.branchId],
    references: [branches.id],
  }),
}));

export type Tenant = typeof tenants.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Branch = typeof branches.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type MenuVariant = typeof menuVariants.$inferSelect;
export type Topping = typeof toppings.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Inventory = typeof inventory.$inferSelect;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Shift = typeof shifts.$inferSelect;
export type ShiftLog = typeof shiftLogs.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type Promo = typeof promos.$inferSelect;
export type FileRecord = typeof files.$inferSelect;
export type Approval = typeof approvals.$inferSelect;
