import { useNavigation } from '@react-navigation/native';

import { LinearGradient } from 'expo-linear-gradient';

import { Text, Button, View, ButtonGroup, ButtonText } from '@gluestack-ui/themed';

import { AuthNavigationProp } from '@routes/auth.routes';

import FelipeMascotPremium from '@assets/Mascot/Felipe_Mascot_GoPremium.svg';

type GoPremiumTypes = {
  styles?: Object
}

export function GoPremium({ styles }: GoPremiumTypes) {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <LinearGradient
      colors={['#b6e0c7', '#93deb4']}
      style={{ padding: 20, borderRadius: 15, ...(styles as Object) }}
    >
      <View flexDirection="row">
        <View maxWidth="50%">
          <Text fontSize="$2xl" fontWeight="$bold" mb={7} w="120%">Plano Premium</Text>
          <Text fontWeight="$semibold">Desbloqueie todos os recursos com o Premium</Text>
          <ButtonGroup justifyContent='center' alignItems='center' mt={20} ml={-20}>
            <LinearGradient
              colors={['#E9AD2D', '#f2d16e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '80%',
                borderRadius: 20,
                shadowColor: '#f2da95',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Button w="100%" borderRadius={20} bgColor="transparent" size='lg' onPress={() => navigation.navigate("PremiumPlans")} $pressed={{ opacity: 0.8, transform: [{ scale: 0.98 }] }}>
                <ButtonText textAlign="center" fontSize="$xl">Upgrade</ButtonText>
              </Button>
            </LinearGradient>
          </ButtonGroup>
        </View>
        <FelipeMascotPremium
          width={180}
          height={180}
          style={{
            marginLeft: 10,
            marginBottom: -30,
            zIndex: 2
          }}
        />
      </View>
    </LinearGradient>
  )
}