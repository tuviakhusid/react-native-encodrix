import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";
import {
  Home,
  ScanLine,
  Settings,
  FileText,
  DollarSign,
} from "lucide-react-native";
import {
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_CONFIG = [
  { name: "dashboard", label: "Home", icon: Home },
  // { name: "documents", label: "Docs", icon: FileText },
  { name: "upload", label: "Scan", icon: ScanLine, isCenter: true },
  // { name: "cost-manager", label: "Costs", icon: DollarSign },
  { name: "settings", label: "Settings", icon: Settings },
];

// Hidden screens that should not appear in tab bar
const HIDDEN_SCREENS = ["invoice-detail"];

interface TabItemProps {
  route: any;
  index: number;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  colors: ReturnType<typeof getColors>;
  config: (typeof TAB_CONFIG)[0];
}

function TabItem({
  isFocused,
  onPress,
  onLongPress,
  colors,
  config,
}: TabItemProps) {
  const scale = useSharedValue(1);
  const iconTranslateY = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: iconTranslateY.value },
      ] as ViewStyle["transform"],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onPress();
  };

  // Animate when focus changes
  if (isFocused) {
    iconTranslateY.value = withSpring(-2, { damping: 15 });
  } else {
    iconTranslateY.value = withSpring(0, { damping: 15 });
  }

  const Icon = config.icon;

  // Center button (Scan) - Special styling
  if (config.isCenter) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={onLongPress}
        style={styles.centerButtonContainer}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.centerButton,
            {
              backgroundColor: colors.primary.DEFAULT,
              shadowColor: colors.primary.DEFAULT,
            },
            animatedIconStyle as ViewStyle,
          ]}
        >
          <Icon size={28} color="#ffffff" strokeWidth={2.5} />
        </Animated.View>
        <Text
          style={[
            styles.centerLabel,
            { color: isFocused ? colors.primary.DEFAULT : colors.text.secondary },
          ]}
        >
          {config.label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Regular tab items
  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.iconContainer, animatedIconStyle as ViewStyle]}>
        <Icon
          size={24}
          color={isFocused ? colors.primary.DEFAULT : colors.text.secondary}
          strokeWidth={isFocused ? 2.5 : 2}
        />
        {/* Active indicator dot */}
        {isFocused && (
          <View
            style={[styles.activeIndicator, { backgroundColor: colors.primary.DEFAULT }]}
          />
        )}
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: isFocused ? colors.primary.DEFAULT : colors.text.secondary,
            fontWeight: isFocused ? "600" : "500",
          },
        ]}
      >
        {config.label}
      </Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const insets = useSafeAreaInsets();

  // Filter out hidden screens (like invoice-detail)
  const visibleRoutes = state.routes.filter((route) => {
    return !HIDDEN_SCREENS.includes(route.name);
  });

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 8 : 12),
        },
      ]}
    >
      <View
        style={[
          styles.tabBarContainer,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.light,
            shadowColor: theme === "dark" ? "#000" : "#1e3a8a",
          },
        ]}
      >
        {visibleRoutes.map((route, index) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const config = TAB_CONFIG.find((t) => t.name === route.name);

          if (!config) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabItem
              key={route.key}
              route={route}
              index={index}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              colors={colors}
              config={config}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Home" }} />
      {/* <Tabs.Screen name="documents" options={{ title: "Docs" }} /> */}
      <Tabs.Screen name="upload" options={{ title: "Scan" }} />
      {/* <Tabs.Screen name="cost-manager" options={{ title: "Costs" }} /> */}
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
      <Tabs.Screen
        name="invoice-detail"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: 70,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 8,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  label: {
    fontSize: 11,
    marginTop: 2,
  },
  centerButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  centerLabel: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: "600",
  },
});
