import React, { useEffect, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { Box, Text, Input, Button, Image, HStack, VStack, styled } from '@gluestack-ui/themed';
import { MaterialIcons } from '@expo/vector-icons';
import { loadImage } from "../../assets/imageLoader";
import { loadDestinations } from '../../assets/imageLoader';


interface Destinations{
    id: number;
    name: string;
    description: string;
    image: any;
}

export function Home() {
    const [destinations, setDestinations] = useState<Destinations[]>([]);

    useEffect(() => {
        loadDestinations().then(setDestinations);
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList showsVerticalScrollIndicator={false}
                data={destinations}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                ListHeaderComponent={
                    <>
                        {/* Header */}
                        <HStack justifyContent="space-between" alignItems="center" p="$4" width='95%' mt={10}>
                            <VStack flex={1}>
                                <HStack alignItems="center">
                                    <MaterialIcons name='place' size={24} color="$gray600" />
                                    <Text fontSize="$md" fontWeight="$bold" ml="$1">São Paulo, Brazil</Text>
                                </HStack>
                            </VStack>
                            <MaterialIcons name='notifications' size={24} color={"$gray600"} />
                        </HStack>

                        {/* User Info */}
                        <Text fontSize={'$sm'} fontWeight={'$bold'} textAlign='left'> Welcome Back, </Text>
                        <HStack mt={-9} mb={15} alignItems="center">
                            <VStack flex={1}>
                                <Text fontSize="$lg" fontWeight="$bold" textAlign='left'> Usuário Default </Text>
                                <Text fontSize={'$sm'} fontWeight={'$semibold'} color="$gray500" textAlign='left'> Free User • Since 2024 </Text>
                            </VStack>
                            <Image source={loadImage('profile.png')} alt='User photo' width={60} height={60} borderRadius={25} ml={'auto'} />
                        </HStack>

                        {/* Premium Section */}
                        <Box mb={10} bg="$blue300" p={1} borderRadius={10}>
                            <Text color="$white" fontSize="$sm" textAlign='center' mb={2}>Get exclusive travel guides & VIP deals!</Text>
                            <Button bg='$blue500' p={2} borderRadius={10}>
                                <Text fontSize="$sm" fontWeight="$bold" color="$white">Upgrade to Pro</Text>
                            </Button>
                        </Box>

                        {/* Popular Destinations */}
                        <Text fontSize="$lg" fontWeight="$bold"> Popular Destinations </Text>
                    </>
                }
                renderItem={({ item }) => (
                    <Box flex={1} m={2}  flexDirection='column' bg="$gray200" borderRadius={10} overflow="hidden">

                        <Image source={item.image} alt='Pictures Destinations'borderRadius={10} size= "2xl" height={100} />
                        <Box p={3}>
                            <Text fontSize="$sm" fontWeight="$bold" textAlign='center' mb={1}>{item.name}</Text>
                            
                        </Box>
                    </Box>
                )}
                contentContainerStyle={{ paddingBottom: 100 }} 
                />

                {/* Navigation Bar */}
                    <HStack flex={1} justifyContent="space-between" alignItems="center" bg="$blue500" borderRadius={20}  p={4} position="absolute" bottom={10} left={0} right={0}>
                        <HStack alignItems="center">
                            <Button size='xs' width={'$16'} height={60} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700" >
                                <MaterialIcons name='public' size={30} color={'white'}/>
                            </Button>
                            <Text color="#fff" fontSize="$md" fontWeight="$bold" ml={10}> Discover </Text>
                        </HStack>

                        <Box width={1} height={"80%"} bg="#fff" mx={3} />
                        <HStack space='md' alignItems='center'>
                            <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignContent='center' alignItems="center" bg="$blue700">
                                <MaterialIcons name='home' size={27} color={'white'} > </MaterialIcons>
                            </Button>
                            <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
                                <MaterialIcons name='search' size={27} color={'white'}></MaterialIcons>
                            </Button>
                            <Button size='xs' width={55} height={55} borderRadius={50} justifyContent="center" alignItems="center" bg="$blue700">
                                <MaterialIcons name='settings' size={27} color={'white'}></MaterialIcons>
                            </Button>
                        </HStack>
                    </HStack>   
        </View>
    );
}
