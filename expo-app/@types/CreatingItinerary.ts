import type { ExistingContact } from "expo-contacts";

import { VisaModelTypes } from "./VisaModelTypes";

/**
 * Represents the structure for creating a travel itinerary.
 *
 * @property id - Optional unique identifier for the itinerary.
 * @property title - Title of the itinerary.
 * @property dateBegin - Start date of the itinerary.
 * @property dateEnd - End date of the itinerary.
 * @property days - Total number of days for the itinerary.
 * @property continent - Optional continent of travel.
 * @property countries - Optional list of countries included in the itinerary.
 * @property userOrigin - Optional origin of the user.
 * @property visa - Optional country code for indicating if a visa is required.
 * @property originCountry - Country of origin of the user for the trip and visa check.
 * @property contacts - Optional list of contacts related to the itinerary.
 * @property budget - Budget allocated for the trip.
 * @property peopleQuantity - Number of people participating in the trip.
 * @property acconpanying - Type of company during the trip ("Family" or "Friends").
 * @property tripStyleTypes - Optional style of the trip ("Urban" or "Countryside").
 * @property tripStyle - Array of trip styles.
 * @property vehiclesTypes - Optional types of vehicles used ("Car", "Motorcycle", "Foot", "Train", "Boat", "Bicycle").
 * @property locomotionMethod - Array of locomotion methods used during the trip.
 * @property specialWish - Special wishes or requests for the trip.
 * @property visitPreferences - Optional list of visit preferences.
 * @property itinerary - Optional object representing the detailed itinerary.
 * @property status - Status of the itinerary ("Planejado", "Rascunho", or "Passado").
 * @property coverImage - Optional cover image URI for the itinerary.
 * @property isNew - Optional flag to indicate if this is a newly created itinerary.
 * @property isSurpriseMode - Optional flag to indicate if this is a surprise mode itinerary (skips visa check).
 */
export type CreatingItinerary = {
  title: string, 
  dateBegin: Date | string, 
  dateEnd: Date | string, 
  days: number, 
  continent?: string, 
  countries?: string[],
  visa?: boolean | VisaModelTypes["results"],
  originCountry: string,
  contacts?: ExistingContact[],
  budget: number,
  peopleQuantity: number,
  acconpanying: "Family" | "Friends",
  tripStyleTypes?: "Urban" | "Countryside",
  tripStyle: CreatingItinerary["tripStyleTypes"][]
  vehiclesTypes?: "Car" | "Motorcycle" | "Foot" | "Train" | "Boat" | "Bicycle"
  locomotionMethod: CreatingItinerary["vehiclesTypes"][],
  specialWish: string,
  visitPreferences?: string[],
  itinerary?: object,
  pixabayTags?: string,
  images?: object,
  status?: "Planejado" | "Rascunho" | "Passado",
  coverImage?: string,
  isNew?: boolean,
  isSurpriseMode?: boolean
}