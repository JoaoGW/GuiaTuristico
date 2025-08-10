import { createContext, useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Animated, Dimensions } from 'react-native';

import { useNavigation, useNavigationState } from '@react-navigation/native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View, Text } from '@gluestack-ui/themed';

import { MessageCircle, Home, Gamepad2, User, BookMarked } from 'lucide-react-native';

import { AuthNavigationProp } from "@routes/auth.routes";

type NavbarContextType = {
  currentActive: string;
  setCurrentActive: (value: string) => void;
};

export const NavbarContext = createContext<NavbarContextType>({ currentActive: "Home", setCurrentActive: () => {} });

export function NavigationBar() {
  const navItems = [
    { 
      key: 'GenerateItinerary', 
      icon: BookMarked, 
      label: 'Roteiros',
      action: () => navigation.navigate('GenerateItinerary')
    },
    { 
      key: 'AIChat', 
      icon: MessageCircle, 
      label: 'Chat IA',
      action: () => navigation.navigate('AIMascotIntroduction')
    },
    { 
      key: 'Home', 
      icon: Home, 
      label: 'Início',
      action: () => navigation.navigate('Home')
    },
    { 
      key: 'Games', 
      icon: Gamepad2, 
      label: 'Gaming',
      action: () => setCurrentActive('Games')
    },
    { 
      key: 'Settings', 
      icon: User, 
      label: 'Perfil',
      action: () => navigation.navigate('Profile')
    }
  ];
  
  const [currentActive, setCurrentActive] = useState<NavbarContextType["currentActive"]>('Home');
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const navigation = useNavigation<AuthNavigationProp>();
  const navigationState = useNavigationState((state) => state);
  const insets = useSafeAreaInsets();
  
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  
  const { width } = Dimensions.get('window');
  const containerWidth = width - 32;
  const availableWidth = containerWidth - 12;

  const activeIndex = navItems.findIndex(item => item.key === currentActive);
  const inactiveItemWidth = availableWidth * 0.12;
  const activeItemWidth = availableWidth * 0.48;
  
  const getItemPosition = (index: number) => {
    if (index < activeIndex) {
      return index * inactiveItemWidth + 6;
    } else if (index === activeIndex) {
      return activeIndex * inactiveItemWidth + 6;
    } else {
      return activeIndex * inactiveItemWidth + activeItemWidth + (index - activeIndex - 1) * inactiveItemWidth + 6;
    }
  };

  const routeMapping: Record<string, string[]> = {
    Home: ['Home', 'DestinationDetails', 'MapsExpanded', 'Notifications'],
    GenerateItinerary: ['GenerateItinerary'],
    AIChat: ['AIChat', 'AIChatMenu', 'AIMascotIntroduction', 'AIVoiceChat'],
    Games: ['Games'],
    Settings: ['Profile', 'EditProfile', 'Settings', 'UserPreferences'],
  };

  useEffect(() => {
    if (navigationState && navigationState.routes) {
      const currentRoute = navigationState.routes[navigationState.index]?.name;

      if (currentRoute) {
        const mainRoute = Object.keys(routeMapping).find((key) =>
          routeMapping[key].includes(currentRoute)
        );

        if (mainRoute && mainRoute !== currentActive) {
          setCurrentActive(mainRoute);
        }
      }
    }

    const loadTimeout = setTimeout(() => {
      setIsPageLoaded(true);
    }, 300);

    return () => clearTimeout(loadTimeout);
  }, [navigationState]);

  useEffect(() => {
    if (activeIndex !== -1 && isPageLoaded) {
      const targetPosition = getItemPosition(activeIndex);
      Animated.spring(slideAnimation, {
        toValue: targetPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [activeIndex, availableWidth, isPageLoaded]);

  const handleItemPress = (item: typeof navItems[0]) => {
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();

    setCurrentActive(item.key);
    item.action();
  };

  return (
    <View
      position="absolute"
      bottom={ Math.max(insets.bottom, 10) - 5 }
      left={16}
      right={16}
      bgColor='rgba(255, 255, 255, 0.925)'
      borderRadius={20}
      shadowColor='#000'
      shadowOffset={{ width: 0, height: 6 }}
      shadowOpacity={0.1}
      shadowRadius={12}
      elevation={10}
      borderWidth={0.5}
      borderColor='rgba(255, 255, 255, 0.4)'
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          width: activeItemWidth,
          height: 50,
          backgroundColor: '#2752B7',
          borderRadius: 16,
          transform: [{ translateX: slideAnimation }],
          opacity: isPageLoaded ? 1 : 0
        }}
      />
      
      <View
        flexDirection="row"
        alignItems="center"
        paddingHorizontal={6}
        paddingVertical={4}
        minHeight={58}
      >
        { navItems.map((item) => {
          const isActive = currentActive === item.key;
          const IconComponent = item.icon;
          
          return (
            <TouchableOpacity
              key={ item.key }
              onPress={ () => handleItemPress(item) }
              style={{
                width: isActive ? activeItemWidth : inactiveItemWidth,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                paddingHorizontal: isActive ? 8 : 2,
              }}
            >
              <Animated.View
                style={{
                  transform: [{ scale: scaleAnimation }],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                { isActive ? (
                  <View
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{ gap: 6 }}
                  >
                    <IconComponent 
                      size={24} 
                      color="white"
                      strokeWidth={2.5}
                    />
                    <Text
                      color="white"
                      fontSize={16}
                      fontWeight="600"
                      numberOfLines={1}
                      style={{ maxWidth: 65 }}
                    >
                      { item.label }
                    </Text>
                  </View>
                ) : (
                  <IconComponent 
                    size={23} 
                    color="#6B7280"
                    strokeWidth={2}
                  />
                )}
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}