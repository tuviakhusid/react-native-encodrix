"use client";

import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Clock, CheckCircle2, FileText } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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

const GET_PROCESSED_DOCUMENTS = gql`
  query GetProcessedDocuments(
    $status: StringFilter
    $stageStatus: StringFilter
    $query: String
    $page: Int
    $pageSize: Int
    $fromDate: String
    $toDate: String
    $filterByDate: String
  ) {
    documentsByStatus(
      status: $status
      stageStatus: $stageStatus
      q: $query
      page: $page
      pageSize: $pageSize
      fromDate: $fromDate
      toDate: $toDate
      filterByDate: $filterByDate
    ) {
      documents {
        id
        documentName
        documentType
        documentHighLevelType
        workflowStatus
        wfStageStatus
        workflowDocumentInstanceId
        isMappingConfirmed
        nextStage
        createdAt
        updatedAt
        businessName
        fileFormat
        s3Urls
        invoiceDataId
        issueDate
      }
      totalDocuments
      inProgressCount
      completedCount
      stageCount
      page
      pageSize
      totalPages
    }
  }
`;

interface Document {
  id: string;
  documentName: string;
  documentType: string;
  documentHighLevelType?: string;
  workflowStatus: string;
  wfStageStatus?: string;
  workflowDocumentInstanceId?: string;
  isMappingConfirmed?: boolean;
  nextStage?: any;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  fileFormat: string;
  s3Urls: string[];
  invoiceDataId?: string;
  issueDate?: string;
}

type TabType = "in-progress" | "completed";

export default function DocumentsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [activeTab, setActiveTab] = useState<TabType>("in-progress");
  const [refreshing, setRefreshing] = useState(false);

  // Date range for last 30 days
  const getLast30DaysRange = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    return {
      fromDate: formatDateForQuery(thirtyDaysAgo),
      toDate: formatDateForQuery(today),
    };
  };

  const formatDateForQuery = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const { fromDate, toDate } = getLast30DaysRange();

  const { data: inProgressData, loading: inProgressLoading, refetch: refetchInProgress } = useQuery(
    GET_PROCESSED_DOCUMENTS,
    {
      variables: {
        status: {
          notEquals: "completed",
        },
        stageStatus: {},
        page: 1,
        pageSize: 50,
        fromDate,
        toDate,
        filterByDate: "processing_date",
      },
      fetchPolicy: "cache-and-network",
      skip: activeTab !== "in-progress",
    }
  );

  const { data: completedData, loading: completedLoading, refetch: refetchCompleted } = useQuery(
    GET_PROCESSED_DOCUMENTS,
    {
      variables: {
        status: {
          equals: "completed",
        },
        stageStatus: {},
        page: 1,
        pageSize: 50,
        fromDate,
        toDate,
        filterByDate: "processing_date",
      },
      fetchPolicy: "cache-and-network",
      skip: activeTab !== "completed",
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "in-progress") {
      await refetchInProgress();
    } else {
      await refetchCompleted();
    }
    setRefreshing(false);
  };

  const handleTabChange = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleDocumentPress = (item: Document) => {
    if (item.id) {
      router.push({
        pathname: "/(tabs)/invoice-detail",
        params: {
          invoiceDataId: item.id,
          documentId: item.id,
          s3Url: item.s3Urls?.[0] || "",
          fileFormat: item.fileFormat || "",
        },
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { bg: colors.stats.green.bg, text: colors.stats.green.text };
      case "inprogress":
      case "in_progress":
        return {
          bg: colors.stats.yellow.bg,
          text: colors.stats.yellow.text,
        };
      case "pending":
        return { bg: colors.stats.blue.bg, text: colors.stats.blue.text };
      case "rejected":
        return { bg: colors.status.rejectedBg, text: colors.status.rejected };
      default:
        return { bg: colors.border.light, text: colors.text.secondary };
    }
  };

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const statusColors = getStatusColor(item.workflowStatus || "pending");
    const displayDate = item.issueDate || item.createdAt;

    return (
      <TouchableOpacity
        style={[
          styles.documentItem,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.DEFAULT,
            borderLeftWidth: 4,
            borderLeftColor: statusColors.bg,
          },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleDocumentPress(item);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.documentContent}>
          <View style={styles.documentLeft}>
            <View
              style={[
                styles.documentIcon,
                { backgroundColor: colors.stats.blue.bg },
              ]}
            >
              <FileText size={24} color={colors.stats.blue.text} />
            </View>
            <View style={styles.documentInfo}>
              <Text
                style={[styles.documentName, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {item.documentName || "Untitled Document"}
              </Text>
              <Text
                style={[
                  styles.documentVendor,
                  { color: colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {item.businessName || "N/A"}
              </Text>
              <Text
                style={[styles.documentDate, { color: colors.text.muted }]}
              >
                {formatDate(displayDate)}
              </Text>
              {item.wfStageStatus && (
                <View
                  style={[
                    styles.stageBadge,
                    { backgroundColor: colors.background.gray },
                  ]}
                >
                  <Text
                    style={[
                      styles.stageText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    {item.wfStageStatus}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors.bg },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.workflowStatus || "Pending"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const currentData = activeTab === "in-progress" ? inProgressData : completedData;
  const currentLoading = activeTab === "in-progress" ? inProgressLoading : completedLoading;
  const documents: Document[] = currentData?.documentsByStatus?.documents || [];
  const inProgressCount = inProgressData?.documentsByStatus?.inProgressCount || 0;
  const completedCount = completedData?.documentsByStatus?.completedCount || 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          Documents
        </Text>
        <Text
          style={[styles.headerSubtitle, { color: colors.text.secondary }]}
        >
          Manage your documents
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "in-progress" && [
              styles.tabActive,
              { backgroundColor: colors.primary.DEFAULT },
            ],
            !activeTab && {
              backgroundColor: colors.background.card,
              borderColor: colors.border.DEFAULT,
            },
          ]}
          onPress={() => handleTabChange("in-progress")}
          activeOpacity={0.7}
        >
          <Clock
            size={18}
            color={
              activeTab === "in-progress"
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
                  activeTab === "in-progress"
                    ? "#ffffff"
                    : colors.text.secondary,
              },
            ]}
          >
            In Progress ({inProgressCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "completed" && [
              styles.tabActive,
              { backgroundColor: colors.primary.DEFAULT },
            ],
            !activeTab && {
              backgroundColor: colors.background.card,
              borderColor: colors.border.DEFAULT,
            },
          ]}
          onPress={() => handleTabChange("completed")}
          activeOpacity={0.7}
        >
          <CheckCircle2
            size={18}
            color={
              activeTab === "completed"
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
                  activeTab === "completed"
                    ? "#ffffff"
                    : colors.text.secondary,
              },
            ]}
          >
            Completed ({completedCount})
          </Text>
        </TouchableOpacity>
      </View>

      {currentLoading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        </View>
      ) : documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-text-outline"
            size={64}
            color={colors.text.muted}
          />
          <Text style={[styles.emptyText, { color: colors.text.primary }]}>
            No {activeTab === "in-progress" ? "in-progress" : "completed"}{" "}
            documents found
          </Text>
          <Text
            style={[styles.emptySubtext, { color: colors.text.secondary }]}
          >
            {activeTab === "in-progress"
              ? "Documents being processed will appear here"
              : "Completed documents will appear here"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary.DEFAULT}
              colors={[colors.primary.DEFAULT]}
            />
          }
        />
      )}
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
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100,
    },
    documentItem: {
      borderRadius: borderRadius.lg,
      marginBottom: 12,
      borderWidth: 1,
      ...shadows.sm,
    },
    documentContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
    },
    documentLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: 12,
    },
    documentIcon: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    documentVendor: {
      fontSize: 13,
      marginBottom: 4,
    },
    documentDate: {
      fontSize: 12,
      marginBottom: 8,
    },
    stageBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
    },
    stageText: {
      fontSize: 11,
      fontWeight: "600",
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.md,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 16,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: 14,
      marginTop: 8,
      textAlign: "center",
    },
  });

