import { alias, int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const locations = sqliteTable("locations", {
  id: int("id").primaryKey(),
  abbreviation: text("abbreviation"),
  name: text("name").notNull(),
  address: text("address").notNull(),
  lat: real("lat").notNull(),
  lon: real("lon").notNull(),
  type: text("type", { enum: ["pickup", "dropoff"] }).notNull(),
});

export const pickupLocations = alias(locations, "pickupLocations");
export const dropoffLocations = alias(locations, "dropoffLocations");

export type Location = typeof locations.$inferSelect;
