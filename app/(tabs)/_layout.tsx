import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary.DEFAULT,
        tabBarInactiveTintColor: colors.text.secondary,
        headerStyle: {
          backgroundColor: colors.primary.brandGradient[0], // Match TopBar logo-bar gradient start
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor:
            theme === "dark"
              ? colors.background.card
              : colors.background.DEFAULT,
          borderTopWidth: 0,
          height: 70 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
          paddingHorizontal: spacing.lg,
          ...shadows.lg,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: typography.sizes.xs,
          fontWeight: typography.weights.medium,
          fontFamily: typography.fontFamily.medium,
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
                </View>
              );
            }
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons
                  name="home-outline"
                  size={24}
                  color={colors.text.secondary}
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
                      name="camera"
                      size={20}
                      color={colors.background.light}
                    />
                  </View>
                </View>
              );
            }
            return (
              <View style={styles.tabIconContainer}>
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={colors.text.secondary}
                />
              </View>
            );
          },
          tabBarLabel: "",
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

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
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
      fontFamily: typography.fontFamily.semibold,
      color: colors.text.primary,
      letterSpacing: 0.3,
      includeFontPadding: false,
    },
  });

const styles = getStyles(getColors("light")); // Default
