import { pickupBoundaryPolygons } from "@sure-walk/utils/boundary-info";
import { readFile, writeFile } from "fs/promises";

type PartialLocation = {
  id: number;
  abbreviation: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  type: "pickup" | "dropoff";
};

function isPointInPolygon(
  point: { latitude: number; longitude: number },
  polygon: { latitude: number; longitude: number }[],
) {
  const x = point.latitude,
    y = point.longitude;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    const xj = polygon[j].latitude,
      yj = polygon[j].longitude;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

async function read() {
  const file = await readFile("./campus.geojson", "utf-8");
  const json = JSON.parse(file);
  return json;
}

async function parseLocations() {
  const json = await read();
  const locations: PartialLocation[] = json.features.map(
    (feature: {
      properties: {
        "@id": string;
        "addr:housenumber": string;
        "addr:street": string;
        "addr:postcode": string;
        ref: string;
        name: string;
      };
      geometry: {
        coordinates: [[]];
      };
    }) => {
      let address: string | undefined = undefined;
      address = `${feature.properties["addr:housenumber"]} ${feature.properties["addr:street"]}, Austin, TX ${feature.properties["addr:postcode"]}`;

      let lat = 0;
      let lon = 0;
      let coordCount = 0;

      for (const coordinates of feature.geometry.coordinates) {
        if (Array.isArray(coordinates)) {
          for (const coordinate of coordinates) {
            lat += coordinate[1];
            lon += coordinate[0];
            coordCount++;
          }
        } else {
          lat += coordinates[1];
          lon += coordinates[0];
          coordCount++;
        }
      }

      lat /= coordCount;
      lon /= coordCount;

      return {
        id: parseInt(feature.properties["@id"].split("/")[1]),
        abbreviation: feature.properties.ref,
        name: feature.properties.name,
        address: address,
        lat: lat,
        lon: lon,
        type: "pickup",
      };
    },
  );

  return locations;
}

async function validatedLocations() {
  const locations = await parseLocations();
  const locationsWithin = locations.filter((loc) =>
    pickupBoundaryPolygons.some((boundary) =>
      isPointInPolygon({ latitude: loc.lat, longitude: loc.lon }, boundary),
    ),
  );

  return locationsWithin;
}

async function analyzeLocations() {
  const locations = await validatedLocations();

  await writeFile(
    "./pickupLocations.json",
    JSON.stringify(locations, undefined, 4),
  );
}

analyzeLocations();
