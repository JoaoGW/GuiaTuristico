import { View, Box, Text } from "@gluestack-ui/themed";

import { TriangleAlert } from 'lucide-react-native';

export function LocalFetchError(){
  return(
    <Box flex={1} px={4} py={20} alignItems="center" justifyContent="center">
      <TriangleAlert color="red" size={50} />
      <Text textAlign="center" mt={10}>
        Ocorreu um erro ao mostrar os locais próximos.{"\n"}Por favor tente novamente mais tarde!
      </Text>
    </Box>
  )
}