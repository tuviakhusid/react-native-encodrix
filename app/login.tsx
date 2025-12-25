import { Ionicons } from "@expo/vector-icons";
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
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "../src/constants/theme";
import authService, {
  LoginCredentials,
} from "../src/lib/services/auth.service";

export default function LoginScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("m.anasseth012@gmail.com");
  const [password, setPassword] = useState("google1234");
  const [organizationCode, setOrganizationCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <Ionicons
                  name="document-text"
                  size={32}
                  color={colors.primary.DEFAULT}
                />
              </View>
            </View>
            <Text style={styles.greeting}>Hi, Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in with your credentials</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Organization Code (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organization code"
                placeholderTextColor={colors.text.muted}
                value={organizationCode}
                onChangeText={setOrganizationCode}
                autoCapitalize="none"
                autoComplete="off"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address or Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address or username"
                placeholderTextColor={colors.text.muted}
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType={isEmail(identifier) ? "email-address" : "default"}
                autoCapitalize="none"
                autoComplete={isEmail(identifier) ? "email" : "username"}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor={colors.text.muted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
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
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot Pass</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: spacing.md,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.primary.lightGradient[0],
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    width: "100%",
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    backgroundColor: colors.background.light,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    borderRadius: borderRadius.md,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.border.DEFAULT,
    borderRadius: 6,
    marginRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.light,
  },
  checkboxChecked: {
    backgroundColor: colors.primary.DEFAULT,
    borderColor: colors.primary.DEFAULT,
  },
  checkmark: {
    color: colors.background.light,
    fontSize: 12,
    fontWeight: "bold",
  },
  rememberMeText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    fontWeight: typography.weights.medium,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    color: colors.primary.DEFAULT,
    fontWeight: typography.weights.semibold,
  },
  button: {
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    ...shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background.light,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});
