import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.muted,
        headerStyle: {
          backgroundColor: colors.primary.brandGradient[0], // Match TopBar logo-bar gradient start
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: colors.background.light,
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 70 + insets.bottom : 70,
          paddingBottom:
            Platform.OS === "ios" ? Math.max(insets.bottom, 12) : 12,
          paddingTop: 12,
          paddingHorizontal: spacing.lg,
          ...shadows.lg,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.medium,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return (
                <View style={styles.tabIconWrapper}>
                  <View
                    style={[
                      styles.tabIconContainer,
                      styles.tabIconContainerActive,
                    ]}
                  >
                    <Ionicons
                      name="home"
                      size={20}
                      color={colors.background.light}
                    />
                  </View>
                  {/* <View style={styles.tabLabelPill}>
                    <Text style={styles.tabLabelText}>Home</Text>
                  </View> */}
                </View>
              );
            }
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={colors.text.muted}
                />
              </View>
            );
          },
          tabBarLabel: "",
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                size={24}
                color={focused ? colors.primary.DEFAULT : colors.text.muted}
              />
            </View>
          ),
          tabBarLabel: "",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    justifyContent: "center",
    flexShrink: 0,
  },
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  tabIconContainerActive: {
    backgroundColor: colors.primary.DEFAULT,
  },
  tabLabelPill: {
    backgroundColor: colors.background.gray,
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    minWidth: 80,
    flexShrink: 0,
  },
  tabLabelText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    letterSpacing: 0.3,
    includeFontPadding: false,
  },
});
