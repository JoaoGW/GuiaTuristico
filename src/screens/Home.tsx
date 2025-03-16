import React from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Box, Text, Input, Button, Image, HStack, VStack, styled } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

const destinations = [
    { id: '1', title: 'Av.Paulista', description: '', image: require('../../assets/av_paulista.png') },
    { id: '2', title: 'Ibirapuera', description: '', image: require('../../assets/ibirapuera.png') },
    { id: '3', title: 'Shopping JK', description: '', image: require('../../assets/shopping_jk.png') },
    { id: '4', title: 'Teatro Municipal', description: '', image: require('../../assets/teatro_municipal.png') },
    { id: '5', title: 'Masp', description: '', image: require('../../assets/masp.png') },
    { id: '6', title: 'Aquario São Paulo', description: '', image: require('../../assets/aquario_sao_paulo.png') },
    { id: '7', title: 'Liberdade', description: '', image: require('../../assets/liberdade.png') },
    { id: '8', title: 'Pinacoteca', description: '', image: require('../../assets/pinacoteca.png') },
    { id: '9', title: 'Farol Santander', description: '', image: require('../../assets/farol_santander.png') },
    { id: '10', title: 'Estádio do Pacaembu', description: '', image: require('../../assets/pacaembu.png') },
    

];

export function Home() {
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={destinations}
                numColumns={2}
                keyExtractor={(item) => item.id}
                nestedScrollEnabled={true}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <HStack justifyContent="space-between" alignItems="center" p="$4" width='95%' mt={10}>
                            <VStack flex={1}>
                                <HStack alignItems="center">
                                    <MaterialIcons name='pin-drop' size={24} color="$gray600" />
                                    <Text fontSize="$md" fontWeight="$bold" ml="$1">São Paulo, Brazil</Text>
                                </HStack>
                            </VStack>
                            <Entypo name="bell" size={24} color="black" />
                        </HStack>

                        {/* User Info */}
                        <Text fontSize={'$sm'} fontWeight={'$bold'} textAlign='left'> Welcome Back, </Text>
                        <HStack mt={-9} mb={15} alignItems="center">
                            <VStack flex={1}>
                                <Text fontSize="$lg" fontWeight="$bold" textAlign='left'> Usuário Default </Text>
                                <Text fontSize={'$sm'} fontWeight={'$semibold'} color="$gray500" textAlign='left'> Free User • Since 2024 </Text>
                            </VStack>
                            <Image source={require('../../assets/profile.png')} width={60} height={60} borderRadius={25} ml={'auto'} />
                        </HStack>

                        {/* Premium Section */}
                        <Box mb={10} bg="$blue300" p={1} borderRadius={10}>
                            <Text color="$white" fontSize="$sm" textAlign='center' mb={2}>Get exclusive travel guides & VIP deals!</Text>
                            <Button bg='$blue500' p={2} borderRadius={10}>
                                <Text fontSize="$sm" fontWeight="$bold" color="$white">Upgrade to Pro</Text>
                            </Button>
                        </Box>

                        {/* Popular Destinations */}
                        <Text fontSize="$lg" fontWeight="$bold">🌎 Popular Destinations</Text>
                    </>
                }
                    renderItem={({ item }) => (
                        <Box flex={1} m={2}  flexDirection='column' bg="$gray200" borderRadius={10} overflow="hidden">
                            <Image source={item.image} borderRadius={10} size= "2xl" height={100} />
                            <Box p={3}>
                                <Text fontSize="$sm" fontWeight="$bold" textAlign='center' mb={1}>{item.title}</Text>
                                <Text color="$gray500">{item.description}</Text>
                            </Box>
                        </Box>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }} 
                />

                        {/* Navigation Bar */}
                        <HStack flex={1} justifyContent="space-around" bg="$blue500" borderRadius={20} alignItems="center" p={4} position="absolute" bottom={10} left={0} right={0}>
                            <HStack alignItems="center">
                                <Button size='md' width={60} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700" >
                                    <Image source={require('../../assets/explore.png')} size='2xl' width={20} height={20} />
                                </Button>
                                <Text color="#fff" fontSize="$md" fontWeight="$bold" ml={10}> Discover </Text>
                            </HStack>
                            <Box width={1} height={60} bg="#fff" mx={2} />
                                <Button size='md' width={60} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
                                    <Image source={require('../../assets/home.png')} size='2xl' width={20} height={20} />
                                </Button>
                                <Button size='md' width={60} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
                                    <Image source={require('../../assets/search.png')} size='2xl' width={20} height={20} />
                                </Button>
                                <Button size='md' width={60} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
                                    <Image source={require('../../assets/configurations.png')} size='2xl' width={20} height={20} />
                                </Button>
                        </HStack>   
        </View>
    );
}