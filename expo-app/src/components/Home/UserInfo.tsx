import { useState, useEffect } from 'react';

import { Text, Image, View } from '@gluestack-ui/themed';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function UserInfo() {
  const [userName, setUserName] = useState<string>("");
  const [userMail, setUserMail] = useState<string>("");
  const [userPhoto, setUserPhoto] = useState<string>("");

  useEffect(() => {
    async function checkCurrentUser() {
      const userInfo = await GoogleSignin.getCurrentUser();
      
      setUserName(userInfo?.user.name || "Usuário");
      setUserMail(userInfo?.user.email || "email failed");
      
      const photoUrl = userInfo?.user.photo;
      if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim() !== '') {
        setUserPhoto(photoUrl);
      } else {
        setUserPhoto("https://cdn.pixabay.com/photo/2022/07/16/04/19/biker-7324421_640.jpg");
      }
    }

    checkCurrentUser();
  }, []);

  return (
    <View p={10} mt={20} mb={10}>
      <Text fontSize="$lg" textAlign="left" mt={5} mb={-15}>
        Olá! Seja Bem-Vindo(a),
      </Text>
      <View flexDirection='row' mb={15} alignItems="center">
        <View flexDirection='column' flex={1} pt={15}>
          <Text fontSize="$2xl" fontWeight="$bold" textAlign="left">
            { userName }
          </Text>
          <Text fontSize="$md" fontWeight="$semibold" color="$gray500" textAlign="left">
            Usuário FREE • Desde 2025
          </Text>
        </View>
        { userPhoto && (
          <Image
            source={{ uri: userPhoto }}
            alt="User photo"
            width={100}
            height={100}
            borderRadius={40}
            ml="auto"
            borderWidth={3}
            borderColor="#2752B7"
            mt={-15}
          />
        )}
      </View>
    </View>
  );
}