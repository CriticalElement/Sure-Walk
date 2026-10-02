import { DROPOFF_LOCATIONS } from "@sure-walk/utils/dropoff-locations";
import Location from "@sure-walk/utils/types/location";
import { sql } from "drizzle-orm";

import { getDB } from "../db";
import { locations } from "../db/schema/locations";

export const addLocations = async () => {
  const chunkLocations = (locations: Location[], size: number) => {
    const chunkedLocations = [];
    for (let i = 0; i < locations.length; i += size) {
      chunkedLocations.push(locations.slice(i, i + size));
    }
    return chunkedLocations;
  };

  const totalLocations = chunkLocations(DROPOFF_LOCATIONS, 5);
  totalLocations.forEach(
    async (locationChunk) =>
      await getDB()
        .insert(locations)
        .values(locationChunk)
        .onConflictDoUpdate({
          target: locations.id,
          set: {
            abbreviation: sql`excluded.abbreviation`,
            name: sql`excluded.name`,
            address: sql`excluded.address`,
            lat: sql`excluded.lat`,
            lon: sql`excluded.lon`,
            type: sql`excluded.type`,
          },
        }),
  );
};
