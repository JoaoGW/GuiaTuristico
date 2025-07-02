export interface Place {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  photos?: { photo_reference: string }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}