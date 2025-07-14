export interface GlobalPlaces {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  country: string;
  continent: string;
  rating: number;
  averageCost: string;
  currency: string;
  language: string;
  timeZone: string;
  bestTimeToVisit: string;
  climate: string;
  temperature: {
    min: number;
    max: number;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attractions: string[];
  activities: string[];
  transportation: string[];
  accommodation: {
    budget: string;
    midRange: string;
    luxury: string;
  };
  foodSpecialties: string[];
  tips: string[];
  safety: number;
  familyFriendly: boolean;
  tags: string[];
}