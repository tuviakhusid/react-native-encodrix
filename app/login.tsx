import { Ionicons } from "@expo/vector-icons";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";
import authService, {
  LoginCredentials,
} from "../src/lib/services/auth.service";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [organizationCode, setOrganizationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Helper function to detect if input is email or username
  const isEmail = (value: string): boolean => {
    return value.includes("@");
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Error", "Please enter both email/username and password");
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginCredentials = {
        password,
        organizationCode: organizationCode.trim() || undefined,
        rememberMe,
      };

      // Set email or username based on input
      if (isEmail(identifier)) {
        credentials.email = identifier;
      } else {
        credentials.username = identifier;
      }

      await authService.login(credentials);
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || error.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.greeting, { color: colors.text.primary }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                Sign in with your credentials
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  Organization Code (Optional)
                </Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border.DEFAULT }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="Enter organization code"
                    placeholderTextColor={colors.text.muted}
                    value={organizationCode}
                    onChangeText={setOrganizationCode}
                    autoCapitalize="none"
                    autoComplete="off"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  Email Address or Username
                </Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border.DEFAULT }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text.primary }]}
                    placeholder="Enter email address or username"
                    placeholderTextColor={colors.text.muted}
                    value={identifier}
                    onChangeText={setIdentifier}
                    keyboardType={isEmail(identifier) ? "email-address" : "default"}
                    autoCapitalize="none"
                    autoComplete={isEmail(identifier) ? "email" : "username"}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                  Password
                </Text>
                <View style={[styles.inputWrapper, { borderColor: colors.border.DEFAULT }]}>
                  <TextInput
                    style={[styles.input, { color: colors.text.primary, flex: 1 }]}
                    placeholder="Enter Password"
                    placeholderTextColor={colors.text.muted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowPassword(!showPassword);
                    }}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.text.secondary} />
                    ) : (
                      <Eye size={20} color={colors.text.secondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setRememberMe(!rememberMe);
                  }}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: colors.border.DEFAULT },
                      rememberMe && { backgroundColor: colors.primary.DEFAULT, borderColor: colors.primary.DEFAULT },
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.background.light}
                      />
                    )}
                  </View>
                  <Text style={[styles.rememberMeText, { color: colors.text.secondary }]}>
                    Remember me
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
                style={[
                  styles.button,
                  { backgroundColor: colors.primary.DEFAULT },
                  loading && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 32,
      alignItems: "flex-start",
    },
    greeting: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
    },
    form: {
      width: "100%",
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: colors.background.DEFAULT,
      paddingHorizontal: 16,
      minHeight: 48,
    },
    input: {
      fontSize: 15,
      flex: 1,
    },
    eyeIcon: {
      padding: 4,
    },
    optionsRow: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom: 24,
      marginTop: 4,
    },
    rememberMeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderRadius: 6,
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background.DEFAULT,
    },
    rememberMeText: {
      fontSize: 13,
      fontWeight: "500",
    },
    button: {
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "600",
    },
  });
