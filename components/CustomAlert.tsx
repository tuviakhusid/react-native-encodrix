"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, Info, X } from "lucide-react-native";
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  type?: AlertType;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  buttons = [{ text: "OK" }],
  onDismiss,
}: CustomAlertProps) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    if (visible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return CheckCircle2;
      case "error":
        return XCircle;
      case "warning":
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return colors.stats.green.text;
      case "error":
        return colors.status.rejected;
      case "warning":
        return colors.stats.yellow.text;
      default:
        return colors.primary.DEFAULT;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return colors.stats.green.bg;
      case "error":
        return colors.status.rejectedBg;
      case "warning":
        return colors.stats.yellow.bg;
      default:
        return colors.primary.light + "20";
    }
  };

  const Icon = getIcon();
  const iconColor = getIconColor();
  const backgroundColor = getBackgroundColor();

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <Animated.View
          style={[
            styles.alertContainer,
            {
              backgroundColor: colors.background.card,
              borderColor: colors.border.DEFAULT,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Icon and Title Section */}
          <View style={[styles.header, { paddingBottom: message ? 16 : 20 }]}>
            <View style={[styles.iconContainer, { backgroundColor }]}>
              <Icon size={28} color={iconColor} strokeWidth={2.5} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                {title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onDismiss}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Message Section */}
          {message && (
            <View style={styles.messageContainer}>
              <Text style={[styles.message, { color: colors.text.secondary }]}>
                {message}
              </Text>
            </View>
          )}

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            {buttons.map((button, index) => {
              const isDestructive = button.style === "destructive";
              const isCancel = button.style === "cancel";
              const isPrimary = !isDestructive && !isCancel && index === buttons.length - 1;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    isPrimary && {
                      backgroundColor: colors.primary.DEFAULT,
                      flex: buttons.length > 1 ? 2 : 1,
                    },
                    isDestructive && {
                      backgroundColor: colors.status.rejected,
                      flex: buttons.length > 1 ? 1 : 1,
                    },
                    (isCancel || (!isPrimary && !isDestructive)) && {
                      backgroundColor: colors.background.gray,
                      borderWidth: 1,
                      borderColor: colors.border.DEFAULT,
                      flex: buttons.length > 1 ? 1 : 1,
                    },
                  ]}
                  onPress={() => handleButtonPress(button)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      (isPrimary || isDestructive) && { color: "#ffffff" },
                      (!isPrimary && !isDestructive) && {
                        color: colors.text.primary,
                      },
                    ]}
                  >
                    {button.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    alertContainer: {
      width: "100%",
      maxWidth: 400,
      borderRadius: 20,
      borderWidth: 1,
      overflow: "hidden",
      ...shadows.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 20,
      paddingBottom: 16,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    titleContainer: {
      flex: 1,
      justifyContent: "center",
      paddingTop: 2,
    },
    title: {
      fontSize: 20,
      fontWeight: "700",
      lineHeight: 28,
    },
    closeButton: {
      padding: 4,
      marginTop: 2,
    },
    messageContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
    },
    buttonsContainer: {
      flexDirection: "row",
      padding: 20,
      paddingTop: 0,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border.light,
    },
    button: {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: "600",
    },
  });

