import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { getColors, typography } from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";
import authService from "../src/lib/services/auth.service";
import guestInviteService from "../src/lib/services/guest-invite.service";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const SpinnerAnimation = ({ color, borderColor }: { color: string; borderColor: string }) => {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={[styles.spinner, { borderColor: borderColor, borderTopColor: color }]} />
    </Animated.View>
  );
};

export default function Index() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [loading, setLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const minSplashTime = 3000; // Minimum 3 seconds splash screen

  useEffect(() => {
    // Animate splash screen
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  useEffect(() => {
    const startTime = Date.now();

    const checkAuth = async () => {
      try {
        // Check if user has remember me enabled
        const hasRememberMe = await authService.hasRememberMe();
        const isAuthenticated = await authService.isAuthenticated();

        // If remember me is enabled, validate and refresh token
        if (hasRememberMe && isAuthenticated) {
          const isValid = await authService.validateAndRefreshToken();
          if (isValid) {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minSplashTime - elapsed);
            setTimeout(() => {
              router.replace("/(tabs)/dashboard");
            }, remainingTime);
            return;
          }
        } else if (isAuthenticated) {
          // Token exists but remember me is not enabled
          const elapsed = Date.now() - startTime;
          const remainingTime = Math.max(0, minSplashTime - elapsed);
          setTimeout(() => {
            router.replace("/(tabs)/dashboard");
          }, remainingTime);
          return;
        }

        // No valid authentication: prefer guest upload if invite code is stored
        const hasGuestInvite = await guestInviteService.hasInviteCode();
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsed);
        setTimeout(() => {
          router.replace(hasGuestInvite ? "/guest-upload" : "/login");
        }, remainingTime);
      } catch (error) {
        console.error("Auth check failed:", error);
        const hasGuestInvite = await guestInviteService.hasInviteCode();
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsed);
        setTimeout(() => {
          router.replace(hasGuestInvite ? "/guest-upload" : "/login");
        }, remainingTime);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}
    >
      {/* Animated Background Elements */}
      {/* <Animated.View
        style={[
          styles.backgroundCircle1,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      /> */}

      {/* Main Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo/Brand */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.logoIcon, { backgroundColor: colors.stats.blue.bg, borderColor: colors.border.DEFAULT }]}>
            <Ionicons
              name="document-text"
              size={56}
              color={colors.primary.DEFAULT}
            />
          </View>
          <Text style={[styles.brandName, { color: colors.text.primary }]}>Encodrix</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: fadeAnim,
              backgroundColor: colors.stats.blue.bg,
              borderColor: colors.border.DEFAULT,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.pulseDot, { backgroundColor: colors.primary.DEFAULT }]} />
          <Text style={[styles.tagline, { color: colors.stats.blue.text }]}>AI-Powered Document Management</Text>
        </Animated.View>

        {/* Main Message */}
        <Animated.View
          style={[
            styles.messageContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={[styles.message, { color: colors.text.primary }]}>
            Transforming documents into{"\n"}
            <Text style={[styles.highlightText, { color: colors.primary.DEFAULT }]}>intelligent insights</Text>
          </Text>
        </Animated.View>

        {/* Loading Spinner */}
        <Animated.View
          style={[
            styles.spinnerContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <SpinnerAnimation 
            color={colors.primary.DEFAULT} 
            borderColor={colors.border.DEFAULT} 
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 24,
    zIndex: 10,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  brandName: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 32,
    borderWidth: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: typography.fontFamily.medium,
    letterSpacing: 0.5,
  },
  messageContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: typography.fontFamily.bold,
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.3,
  },
  highlightText: {
    fontWeight: "600",
    fontFamily: typography.fontFamily.semibold,
  },
  spinnerContainer: {
    marginTop: 32,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
  },
});
