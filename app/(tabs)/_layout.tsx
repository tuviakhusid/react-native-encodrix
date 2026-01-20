import { Tabs } from "expo-router";
import { Home, ScanLine } from "lucide-react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.card,
          borderTopWidth: 1,
          borderTopColor: colors.border.DEFAULT,
          height: (Platform.OS === "ios" ? 65 : 65) + insets.bottom,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 10 : 10),
          paddingTop: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: -4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Scan",
          tabBarIcon: ({ size, color }) => (
            <ScanLine size={size} color={color} strokeWidth={2.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="invoice-detail"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
