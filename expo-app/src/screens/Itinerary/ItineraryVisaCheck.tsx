import { useEffect, useState } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { VisaModel } from "@components/Itinerary/VisaModel";

import { AuthNavigationProp } from "@routes/auth.routes";

import { getCountryCode } from '@data/countryCodes';

import { utilsGetSelectedTags } from "@utils/selectedTagsStore";

import { CreatingItinerary } from "../../../@types/CreatingItinerary";
import { VisaModelTypes } from "../../../@types/VisaModelTypes";

export function ItineraryVisaCheck(){
  const [isVisaNecessary, setIsVisaNecessary] = useState<VisaModelTypes["results"]>();
  const [hasVisaIssueFound, setHasVisaIssueFound] = useState<boolean>(false);
  const [lastCheckedCountryCode, setLastCheckedCountryCode] = useState<string>("PT");
  const [isCheckingVisa, setIsCheckingVisa] = useState<boolean>(false);
  const [problematicCountryCode, setProblematicCountryCode] = useState<string>("");

  const navigation = useNavigation<AuthNavigationProp>();
  const route = useRoute<RouteProp<{ params: { itineraryData: CreatingItinerary, userPreferences: string[] } }, 'params'>>();
  const { itineraryData } = route.params;

  // Verificação de segurança para garantir que os dados existem
  if (!itineraryData || !itineraryData.originCountry) {
    console.warn("Dados do itinerário não encontrados ou incompletos");
    return (
      <VisaModel
        results="Unknown"
        origin="ERROR"
        destination={["ERROR"]}
        action={ () => navigation.goBack() }
      />
    );
  }

  useEffect(() => {
    const checkVisaInformation = async (currentCountry: string) => {
      try{
        const originCode = getCountryCode(itineraryData.originCountry);
        setLastCheckedCountryCode(currentCountry);
        const response = await fetch(`http://SEU-IP-AQUI:3000/api/passportVisa?origin=${originCode}&destination=${currentCountry}`);

        if(!response.ok){
          throw new Error("Failed to fetch Visa Information");
        }

        const data = await response.json();

        if(data.category.code === "VR" || data.category.code === "VOA" || data.category.code === "EV"){
          setIsVisaNecessary("Negative");
          setHasVisaIssueFound(true);
          setProblematicCountryCode(currentCountry);
          return true;
        }else if(data.category.code === "VF"){
          setIsVisaNecessary("Positive");
          return false;
        }else {
          setIsVisaNecessary("Unknown");
          setHasVisaIssueFound(true);
          setProblematicCountryCode(currentCountry);
          return true;
        }
      }catch(error){
        console.log("Erro encontrado ao fazer este fetch de informações de visto: ", error);
        setIsVisaNecessary("Unknown");
        setHasVisaIssueFound(true);
        return true;
      }
    }

    const checkAllCountries = async () => {
      if (hasVisaIssueFound || !itineraryData.countries || itineraryData.countries.length === 0) {
        return;
      }

      setIsCheckingVisa(true);

      for (const country of itineraryData.countries) {
        const currentCountryCode = getCountryCode(country);
        if (currentCountryCode) {
          const hasIssue = await checkVisaInformation(currentCountryCode);
          if (hasIssue) {
            break;
          }
        }
      }

      setIsCheckingVisa(false);
    };

    checkAllCountries();
  }, [hasVisaIssueFound]);

  return (
    <VisaModel
      results={ isCheckingVisa ? "Positive" : isVisaNecessary }
      origin={ getCountryCode(itineraryData.originCountry) || "BR" }
      destination={ 
        hasVisaIssueFound && problematicCountryCode 
          ? [problematicCountryCode] 
          : [lastCheckedCountryCode] 
      }
      action={ () => {
        if (!isCheckingVisa) {
          navigation.navigate("ItineraryMapMenu", { 
            itineraryData: itineraryData, 
            userPreferences: utilsGetSelectedTags(), 
            visaIssue: isVisaNecessary 
          });
        }
      }}
    />
  )
}