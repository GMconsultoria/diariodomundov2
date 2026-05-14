import { serial, pgEnum, pgTable, text, timestamp, varchar, boolean, index, integer } from "drizzle-orm/pg-core";
const CATEGORIES = ["Política", "Economia", "Investimentos", "Ciência e Tecnologia", "Curiosidade"] as const;

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: text("role").default("reader").notNull(), // PostgreSQL handles enums differently or use text with check
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const categoryEnum = pgEnum("category", CATEGORIES as [string, ...string[]]);

/**
 * Posts table for news articles
 */
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 255 }),
  category: categoryEnum("category").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  authorId: integer("author_id"),
  published: boolean("published").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  publishedAt: timestamp("publishedAt"),
}, (table) => {
  return {
    categoryIdx: index("category_idx").on(table.category),
    publishedIdx: index("published_idx").on(table.published),
    publishedAtIdx: index("published_at_idx").on(table.publishedAt),
  };
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Historical views tracking for detailed dashboard metrics
 */
export const postViews = pgTable("post_views", {
  id: serial("id").primaryKey(),
  postId: integer("postId").notNull(),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
}, (table) => {
  return {
    postIdIdx: index("post_id_idx").on(table.postId),
    viewedAtIdx: index("viewed_at_idx").on(table.viewedAt),
  };
});

export type PostView = typeof postViews.$inferSelect;
export type InsertPostView = typeof postViews.$inferInsert;

/**
 * Contact messages from the contact form
 */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
