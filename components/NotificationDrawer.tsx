"use client";

import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react-native";
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "email" | "approval" | "message" | "comment" | "share";
  isSeen: boolean;
  createdAt: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  notifications?: Notification[];
  loading?: boolean;
  onNotificationPress?: (notificationId: string) => void;
};

const TYPE_LABEL: Record<string, string> = {
  email: "Emails",
  approval: "Workflow & Approvals",
  message: "Messages",
  comment: "Comments",
  share: "Shares",
};

export const groupNotificationsByType = (
  notifications: Notification[]
) => {
  return notifications.reduce<Record<string, Notification[]>>(
    (acc, notification) => {
      const key = notification.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(notification);
      return acc;
    },
    {}
  );
};

const SkeletonItem = () => {
  const { theme } = useTheme();
  const colors = getColors(theme);
  return (
    <View
      style={[
        styles.skeletonItem,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.DEFAULT,
        },
      ]}
    >
      <View style={[styles.skeletonLine, { backgroundColor: colors.background.gray }]} />
      <View style={[styles.skeletonLine, { backgroundColor: colors.background.gray }]} />
    </View>
  );
};

export default function NotificationDrawer({
  open,
  onClose,
  notifications = [],
  loading = false,
  onNotificationPress,
}: Props) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [visible, setVisible] = useState(open);
  const slideAnim = useState(new Animated.Value(400))[0];

  useEffect(() => {
    if (open) {
      setVisible(true);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }, [open, slideAnim]);

  const handleClose = () => {
    onClose();
  };

  const handleNotificationPress = (notification: Notification) => {
    if (onNotificationPress) {
      onNotificationPress(notification.id);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!visible && !open) return null;

  const grouped = groupNotificationsByType(notifications);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <Animated.View
          style={[
            styles.drawer,
            {
              backgroundColor: colors.background.light,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Bell size={24} color={colors.text.primary} strokeWidth={2.5} />
              <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
                Notifications
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={24} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {loading && notifications.length === 0 ? (
              <View style={styles.loadingContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Bell size={48} color={colors.text.muted} strokeWidth={2} />
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                  No notifications found
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.text.muted }]}>
                  You're all caught up!
                </Text>
              </View>
            ) : (
              <View style={styles.notificationsList}>
                {Object.entries(grouped).map(([type, items]) => (
                  <View key={type} style={styles.typeGroup}>
                    <Text style={[styles.typeLabel, { color: colors.text.secondary }]}>
                      {TYPE_LABEL[type] ?? type}
                    </Text>
                    {items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.notificationItem,
                          {
                            backgroundColor: item.isSeen
                              ? colors.background.card
                              : colors.primary.light + "15",
                            borderColor: item.isSeen
                              ? colors.border.DEFAULT
                              : colors.primary.DEFAULT,
                            borderLeftWidth: item.isSeen ? 1 : 4,
                          },
                        ]}
                        onPress={() => handleNotificationPress(item)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.notificationContent}>
                          <Text
                            style={[
                              styles.notificationTitle,
                              {
                                color: colors.text.primary,
                                fontWeight: item.isSeen ? "500" : "700",
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.notificationMessage,
                              { color: colors.text.secondary },
                            ]}
                            numberOfLines={2}
                          >
                            {item.message}
                          </Text>
                          <Text
                            style={[
                              styles.notificationTime,
                              { color: colors.text.muted },
                            ]}
                          >
                            {formatTime(item.createdAt)}
                          </Text>
                        </View>
                        {!item.isSeen && (
                          <View
                            style={[
                              styles.unreadDot,
                              { backgroundColor: colors.primary.DEFAULT },
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View
            style={[
              styles.footer,
              { borderTopColor: colors.border.DEFAULT },
            ]}
          >
            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.closeFooterButton,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.DEFAULT,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    backdrop: {
      flex: 1,
    },
    drawer: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: "85%",
      maxWidth: 400,
      ...shadows.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.DEFAULT,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    closeButton: {
      padding: 4,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      padding: 20,
      gap: 12,
    },
    skeletonItem: {
      borderRadius: borderRadius.md,
      borderWidth: 1,
      padding: 16,
      gap: 8,
    },
    skeletonLine: {
      height: 12,
      borderRadius: borderRadius.sm,
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 16,
    },
    emptySubtext: {
      fontSize: 14,
      marginTop: 8,
    },
    notificationsList: {
      padding: 20,
      gap: 24,
    },
    typeGroup: {
      gap: 12,
    },
    typeLabel: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    notificationItem: {
      borderRadius: borderRadius.md,
      borderWidth: 1,
      padding: 16,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "flex-start",
      ...shadows.sm,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 15,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 13,
      marginBottom: 8,
      lineHeight: 18,
    },
    notificationTime: {
      fontSize: 11,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 8,
      marginTop: 4,
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
    },
    closeFooterButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      alignItems: "center",
    },
    closeButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

const styles = getStyles(getColors("light"));

