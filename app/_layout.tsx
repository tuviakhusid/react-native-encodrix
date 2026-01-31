import { ApolloProvider } from "@apollo/client";
import {
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    useFonts,
} from "@expo-google-fonts/manrope";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { getColors } from "../src/constants/theme";
import { ThemeProvider, useTheme } from "../src/context/theme-context";
import { apolloClient } from "../src/lib/apollo/apolloClient";

// Import gesture handler at the top level (required for React Native)
import "react-native-gesture-handler";
import "react-native-reanimated";

// Prevent auto-hide so we can control when to hide it
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Manrope-Regular": Manrope_400Regular,
    "Manrope-Medium": Manrope_500Medium,
    "Manrope-SemiBold": Manrope_600SemiBold,
    "Manrope-Bold": Manrope_700Bold,
  });

  useEffect(() => {
    // Hide Expo splash screen immediately to show custom splash screen
    // This happens as soon as fonts are loaded or there's an error
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const colors = getColors(theme);

  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary.brandGradient[0],
          },
          headerTintColor: colors.background.light,
          headerTitleStyle: {
            fontWeight: "600",
            fontFamily: "Manrope-SemiBold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  );
}
