type Location = {
  id: number;
  abbreviation: string | null;
  name: string;
  address: string;
  lat: number;
  lon: number;
  type: "pickup" | "dropoff";
};

export default Location;
