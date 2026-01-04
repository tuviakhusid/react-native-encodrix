import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../src/constants/theme";
import authService from "../src/lib/services/auth.service";

const { width, height } = Dimensions.get("window");

const SpinnerAnimation = () => {
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
      <View style={styles.spinner} />
    </Animated.View>
  );
};

export default function Index() {
  const router = useRouter();
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

        // No valid authentication, go to login
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsed);
        setTimeout(() => {
          router.replace("/login");
        }, remainingTime);
      } catch (error) {
        console.error("Auth check failed:", error);
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, minSplashTime - elapsed);
        setTimeout(() => {
          router.replace("/login");
        }, remainingTime);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <LinearGradient
      colors={colors.primary.splashGradient as [string, string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
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
      <Animated.View
        style={[
          styles.backgroundCircle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
            transform: [
              {
                scale: scaleAnim.interpolate({
                  inputRange: [0.8, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      />

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
          <View style={styles.logoIcon}>
            <Ionicons
              name="document-text"
              size={56}
              color={colors.primary.light}
            />
          </View>
          <Text style={styles.brandName}>Encodrix</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: fadeAnim,
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
          <View style={styles.pulseDot} />
          <Text style={styles.tagline}>AI-Powered Document Management</Text>
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
          <Text style={styles.message}>
            Transforming documents into{"\n"}
            <Text style={styles.highlightText}>intelligent insights</Text>
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
          <SpinnerAnimation />
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  backgroundCircle1: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: colors.primary.light,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  backgroundCircle2: {
    position: "absolute",
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: colors.primary.DEFAULT,
    bottom: -width * 0.2,
    left: -width * 0.2,
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
    backgroundColor: colors.primary.light + "33",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary.light + "4D",
  },
  brandName: {
    fontSize: 42,
    fontWeight: "700",
    color: colors.background.light,
    letterSpacing: 1.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    // Note: brandName does NOT use Manrope - uses default system font
  },
  taglineContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.light,
    marginRight: 10,
    shadowColor: colors.primary.light,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  tagline: {
    color: colors.background.light,
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
    color: colors.background.light,
    textAlign: "center",
    lineHeight: 28,
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  highlightText: {
    color: colors.primary.light,
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
    borderColor: colors.primary.light + "4D",
    borderTopColor: colors.primary.light,
  },
});
