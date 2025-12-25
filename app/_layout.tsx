import { Stack } from "expo-router";
import { ApolloProvider } from "@apollo/client";
import { StatusBar } from "expo-status-bar";
import { apolloClient } from "../src/lib/apollo/apolloClient";
import { colors } from "../src/constants/theme";

// Import gesture handler at the top level (required for React Native)
import "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary.brandGradient[0],
          },
          headerTintColor: colors.background.light,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ApolloProvider>
  );
}
