import { useState } from 'react';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@routes/auth.routes';

import { VStack, Image, Center, Text, Heading, ScrollView, Box } from "@gluestack-ui/themed"
import BackgroundImg from "@assets/background.webp";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <VStack flex={1} px="$8">
        <Image
          h="$full"
          w={screenWidth}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="pessoaCarregandoMala"
          position="absolute"/>
        <Box
          h="$full"
          w={screenWidth}
          bg="rgba(0, 0, 0, 0.4)" // Semi-transparent black
          position="absolute"
        />

        <Center my="$24">
          <Heading color="$trueGray50" fontSize="$3xl" mt="$40">Welcome to</Heading>
          <Heading color="$info600" fontSize="$4xl" mt="$3" mb="$5">EZ TRIP AI</Heading>
          <Input placeholder="Email" keyboardType='email-address' autoCapitalize='none'/>
          <Input placeholder="Senha" secureTextEntry/>
          <Button title="LOGIN"/> {/* Adicione isLoading pra mostrar q ta carregando*/}
          <Text color="$trueGray50" fontSize="$md" mt="$10">Don't have an account?</Text>
          <Button
            title="Create an account"
            variant="outline"
            onPress={() => navigation.navigate('Home')}
            ></Button>
        </Center>
        
      </VStack>
    </ScrollView>
    
    
    // <ImageBackground source={} style={styles.background}>
    //   <View style={styles.overlay}>
    //     <View style={styles.container}>
    //       <Text style={styles.title}>Welcome to</Text>
    //       <Text style={styles.subtitle}>EZ TRIP AI</Text>

    //       <View style={styles.inputContainer}>
    //         <FontAwesome name="user" size={20} color="#555" style={styles.icon} />
    //         <TextInput
    //           placeholder="Email"
    //           placeholderTextColor="#999"
    //           value={email}
    //           onChangeText={setEmail}
    //           style={styles.input}
    //         />
    //       </View>

    //       <View style={styles.inputContainer}>
    //         <FontAwesome name="lock" size={20} color="#555" style={styles.icon} />
    //         <TextInput
    //           placeholder="Password"
    //           placeholderTextColor="#999"
    //           value={password}
    //           onChangeText={setPassword}
    //           secureTextEntry
    //           style={styles.input}
    //         />
    //       </View>

    //       <View style={styles.rememberContainer}>
    //         <TouchableOpacity onPress={() => setRememberMe(!rememberMe)}>
    //           <FontAwesome name={rememberMe ? 'check-square' : 'square-o'} size={20} color="#0062ff" />
    //         </TouchableOpacity>
    //         <Text style={styles.rememberText}>Remember Me</Text>
    //         <TouchableOpacity>
    //           <Text style={styles.forgotPassword}>Forgot Password?</Text>
    //         </TouchableOpacity>
    //       </View>

    //       <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Home')}>
    //         <Text style={styles.loginText}>LOGIN</Text>
    //       </TouchableOpacity>

    //       <Text style={styles.signupText}>Don't have an account?</Text>
    //       <TouchableOpacity>
    //         <Text style={styles.createAccount}>Create an account</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity style={styles.socialButton}>
    //         <FontAwesome name="google" size={20} color="red" />
    //         <Text style={styles.socialText}>Fazer login com Google</Text>
    //       </TouchableOpacity>

    //       <TouchableOpacity style={styles.socialButton}>
    //         <FontAwesome name="facebook" size={20} color="blue" />
    //         <Text style={styles.socialText}>Fazer login com Facebook</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </ImageBackground>
  );
}

// const styles = StyleSheet.create({
//   background: { flex: 1, resizeMode: 'cover', justifyContent: 'center', height:'100%' },
//   overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center' },
//   container: { alignItems: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
//   subtitle: { fontSize: 26, fontWeight: 'bold', color: '#0062ff', marginBottom: 20 },
//   inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, marginVertical: 10, width: '90%', paddingHorizontal: 10 },
//   input: { flex: 1, padding: 10, color: '#000' },
//   icon: { marginRight: 10 },
//   rememberContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '90%', marginBottom: 10 },
//   rememberText: { marginLeft: 5, color: '#fff' },
//   forgotPassword: { color: '#0062ff' },
//   loginButton: { backgroundColor: '#0062ff', padding: 12, borderRadius: 10, width: '90%', alignItems: 'center', marginTop: 10 },
//   loginText: { color: '#fff', fontWeight: 'bold' },
//   signupText: { color: '#fff', marginTop: 10 },
//   createAccount: { color: '#0062ff', fontWeight: 'bold' },
//   socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10, width: '90%', marginTop: 10, justifyContent: 'center' },
//   socialText: { marginLeft: 10, fontWeight: 'bold', color: '#000' },
// });