"use client";

import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { DollarSign, PieChart, TrendingUp, CheckCircle2, Clock } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";

type TabType = "cost-manager" | "expense";

export default function CostManagerScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [activeTab, setActiveTab] = useState<TabType>("cost-manager");

  const handleTabChange = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const renderCostManagerContent = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.infoCard}>
          <View
            style={[
              styles.infoIconContainer,
              { backgroundColor: colors.stats.blue.bg },
            ]}
          >
            <DollarSign size={24} color={colors.stats.blue.text} />
          </View>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoTitle, { color: colors.text.primary }]}
            >
              Cost Manager
            </Text>
            <Text
              style={[styles.infoDescription, { color: colors.text.secondary }]}
            >
              Manage and allocate costs to customers, projects, and jobs. Track
              cost allocations and view detailed reports.
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Allocate costs to customers
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Track project costs
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              View allocation reports
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Manage line item allocations
            </Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.text.muted}
          />
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            Full cost manager features are available on the web platform. Use
            this section to view summaries and key information.
          </Text>
        </View>
      </View>
    );
  };

  const renderExpenseContent = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.infoCard}>
          <View
            style={[
              styles.infoIconContainer,
              { backgroundColor: colors.stats.purple.bg },
            ]}
          >
            <PieChart size={24} color={colors.stats.purple.text} />
          </View>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoTitle, { color: colors.text.primary }]}
            >
              Expense Allocation
            </Text>
            <Text
              style={[styles.infoDescription, { color: colors.text.secondary }]}
            >
              Allocate invoice line items to customers and projects. Track
              fully allocated, partially allocated, and pending items.
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.stats.green.bg },
            ]}
          >
            <View style={styles.statHeader}>
              <CheckCircle2 size={20} color={colors.stats.green.text} />
              <Text
                style={[styles.statTitle, { color: colors.stats.green.text }]}
              >
                Fully Allocated
              </Text>
            </View>
            <Text
              style={[styles.statValue, { color: colors.stats.green.text }]}
            >
              -
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.stats.green.text }]}
            >
              Items allocated
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.stats.yellow.bg },
            ]}
          >
            <View style={styles.statHeader}>
              <TrendingUp size={20} color={colors.stats.yellow.text} />
              <Text
                style={[styles.statTitle, { color: colors.stats.yellow.text }]}
              >
                Partially Allocated
              </Text>
            </View>
            <Text
              style={[styles.statValue, { color: colors.stats.yellow.text }]}
            >
              -
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.stats.yellow.text }]}
            >
              Items in progress
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.stats.blue.bg },
            ]}
          >
            <View style={styles.statHeader}>
              <Clock size={20} color={colors.stats.blue.text} />
              <Text
                style={[styles.statTitle, { color: colors.stats.blue.text }]}
              >
                Pending
              </Text>
            </View>
            <Text
              style={[styles.statValue, { color: colors.stats.blue.text }]}
            >
              -
            </Text>
            <Text
              style={[styles.statLabel, { color: colors.stats.blue.text }]}
            >
              Items pending
            </Text>
          </View>
        </View>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Allocate line items to customers
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              Track allocation status
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.stats.green.text}
            />
            <Text style={[styles.featureText, { color: colors.text.primary }]}>
              View allocation summaries
            </Text>
          </View>
        </View>

        <View style={styles.noteContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.text.muted}
          />
          <Text style={[styles.noteText, { color: colors.text.secondary }]}>
            Full expense allocation features are available on the web platform.
            Use this section to view summaries and key information.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Cost Manager
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: colors.text.secondary }]}
        >
          Manage costs and expenses
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "cost-manager" && [
              styles.tabActive,
              { backgroundColor: colors.primary.DEFAULT },
            ],
            activeTab !== "cost-manager" && {
              backgroundColor: colors.background.card,
              borderColor: colors.border.DEFAULT,
            },
          ]}
          onPress={() => handleTabChange("cost-manager")}
          activeOpacity={0.7}
        >
          <DollarSign
            size={18}
            color={
              activeTab === "cost-manager"
                ? "#ffffff"
                : colors.text.secondary
            }
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "cost-manager"
                    ? "#ffffff"
                    : colors.text.secondary,
              },
            ]}
          >
            Cost Manager
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "expense" && [
              styles.tabActive,
              { backgroundColor: colors.primary.DEFAULT },
            ],
            activeTab !== "expense" && {
              backgroundColor: colors.background.card,
              borderColor: colors.border.DEFAULT,
            },
          ]}
          onPress={() => handleTabChange("expense")}
          activeOpacity={0.7}
        >
          <PieChart
            size={18}
            color={
              activeTab === "expense" ? "#ffffff" : colors.text.secondary
            }
            strokeWidth={2.5}
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "expense"
                    ? "#ffffff"
                    : colors.text.secondary,
              },
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "cost-manager"
          ? renderCostManagerContent()
          : renderExpenseContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 15,
    },
    tabContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      marginBottom: 16,
      gap: 12,
    },
    tab: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      gap: 8,
    },
    tabActive: {
      borderWidth: 0,
    },
    tabText: {
      fontSize: 14,
      fontWeight: "600",
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    infoCard: {
      flexDirection: "row",
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.lg,
      padding: 20,
      marginBottom: 24,
      ...shadows.sm,
    },
    infoIconContainer: {
      width: 56,
      height: 56,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 8,
    },
    infoDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    statsContainer: {
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      borderRadius: borderRadius.lg,
      padding: 20,
      ...shadows.sm,
    },
    statHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    statTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    statValue: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "500",
    },
    featureList: {
      gap: 12,
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 8,
    },
    featureText: {
      fontSize: 15,
      flex: 1,
    },
    noteContainer: {
      flexDirection: "row",
      backgroundColor: colors.background.gray,
      borderRadius: borderRadius.md,
      padding: 16,
      gap: 12,
    },
    noteText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
    },
  });

