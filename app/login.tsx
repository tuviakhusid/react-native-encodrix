import { Ionicons } from "@expo/vector-icons";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import guestInviteService from "../src/lib/services/guest-invite.service";
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
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestInviteCode, setGuestInviteCode] = useState("");
  const [guestLoading, setGuestLoading] = useState(false);

  // Helper function to detect if input is email or username
  const isEmail = (value: string): boolean => {
    return value.includes("@");
  };

  const handleGuestLogin = async () => {
    const code = guestInviteCode.trim();
    if (!code) {
      Alert.alert("Error", "Please enter your invite code");
      return;
    }
    setGuestLoading(true);
    try {
      await guestInviteService.setInviteCode(code);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowGuestModal(false);
      setGuestInviteCode("");
      router.replace("/guest-upload");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Could not save invite code");
    } finally {
      setGuestLoading(false);
    }
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

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowGuestModal(true);
                }}
                activeOpacity={0.8}
                style={[styles.guestButton, { borderColor: colors.border.DEFAULT }]}
              >
                <Text style={[styles.guestButtonText, { color: colors.text.secondary }]}>
                  Guest login (invite code)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showGuestModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowGuestModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPress={() => setShowGuestModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}>
            <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
              Enter invite code
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.text.secondary }]}>
              Enter the code you received via SMS or email to upload invoices without signing in.
            </Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border.DEFAULT }]}>
              <TextInput
                style={[styles.input, { color: colors.text.primary }]}
                placeholder="Invite code"
                placeholderTextColor={colors.text.muted}
                value={guestInviteCode}
                onChangeText={setGuestInviteCode}
                autoCapitalize="none"
                autoComplete="off"
              />
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary, { borderColor: colors.border.DEFAULT }]}
                onPress={() => {
                  setShowGuestModal(false);
                  setGuestInviteCode("");
                }}
              >
                <Text style={[styles.modalButtonTextSecondary, { color: colors.text.secondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary.DEFAULT }]}
                onPress={handleGuestLogin}
                disabled={guestLoading}
              >
                <Text style={styles.modalButtonText}>
                  {guestLoading ? "Opening…" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
    guestButton: {
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 12,
      borderWidth: 1,
    },
    guestButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      padding: 24,
    },
    modalContent: {
      borderRadius: 16,
      padding: 24,
      borderWidth: 1,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    modalSubtitle: {
      fontSize: 14,
      marginBottom: 20,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
    },
    modalButtonSecondary: {
      backgroundColor: "transparent",
      borderWidth: 1,
    },
    modalButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "600",
    },
    modalButtonTextSecondary: {
      fontSize: 15,
      fontWeight: "600",
    },
  });
