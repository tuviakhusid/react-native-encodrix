import { useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Filter,
  Moon,
  Shield,
  Sun,
  Trash2,
  X
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import FilterBottomSheet from "../../components/FilterBottomSheet";
import NotificationDrawer from "../../components/NotificationDrawer";
import ProfileBottomSheet from "../../components/ProfileBottomSheet";
import { UploadProgressBanner } from "../../components/UploadProgressBanner";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import { useUploadProgress } from "../../src/context/upload-progress-context";
import authService from "../../src/lib/services/auth.service";
import uploadService from "../../src/lib/services/upload.service";
import {
  DeleteDocumentDocument,
  GetCurrentUserDataDocument,
  GetProcessedDocumentsDocument,
} from "../../src/graphql/schema";

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
  orgName?: string;
  clientName?: string;
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "email" | "approval" | "message" | "comment" | "share";
  isSeen: boolean;
  createdAt: string;
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  textColor,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
  textColor: string;
}) {
  return (
    <View style={[statCardStyles.statCard, { backgroundColor: bgColor }]}>
      <View style={statCardStyles.statIconContainer}>
        <Icon size={24} color={color} strokeWidth={2.5} />
      </View>
      <Text style={[statCardStyles.statValue, { color: textColor }]}>{value}</Text>
      <Text style={[statCardStyles.statTitle, { color: textColor }]}>{title}</Text>
    </View>
  );
}

// Skeleton Components for Loading State
function SkeletonPulse({ style, colors }: { style?: any; colors: ReturnType<typeof getColors> }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        { backgroundColor: colors.border.DEFAULT, borderRadius: 8 },
        style,
        animatedStyle,
      ]}
    />
  );
}

function SkeletonStatCard({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <View style={[statCardStyles.statCard, { backgroundColor: colors.background.gray }]}>
      <SkeletonPulse colors={colors} style={{ width: 40, height: 40, borderRadius: 12, marginBottom: 8 }} />
      <SkeletonPulse colors={colors} style={{ width: 50, height: 28, marginBottom: 8 }} />
      <SkeletonPulse colors={colors} style={{ width: 70, height: 14 }} />
    </View>
  );
}

function SkeletonInvoiceCard({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <View
      style={[
        skeletonStyles.invoiceCard,
        { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT },
      ]}
    >
      <View style={skeletonStyles.invoiceContent}>
        <View style={skeletonStyles.invoiceLeft}>
          <SkeletonPulse colors={colors} style={{ width: "80%", height: 18, marginBottom: 10 }} />
          <SkeletonPulse colors={colors} style={{ width: "60%", height: 14, marginBottom: 8 }} />
          <SkeletonPulse colors={colors} style={{ width: "40%", height: 12, marginBottom: 12 }} />
          <View style={{ flexDirection: "row", gap: 8 }}>
            <SkeletonPulse colors={colors} style={{ width: 60, height: 24, borderRadius: 6 }} />
            <SkeletonPulse colors={colors} style={{ width: 70, height: 24, borderRadius: 6 }} />
          </View>
        </View>
        <View style={skeletonStyles.invoiceRight}>
          <SkeletonPulse colors={colors} style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 8 }} />
          <SkeletonPulse colors={colors} style={{ width: 44, height: 44, borderRadius: 12 }} />
        </View>
      </View>
    </View>
  );
}

function DashboardSkeleton({ colors }: { colors: ReturnType<typeof getColors> }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.DEFAULT }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header Skeleton */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 24 }}>
          <View>
            <SkeletonPulse colors={colors} style={{ width: 120, height: 16, marginBottom: 8 }} />
            <SkeletonPulse colors={colors} style={{ width: 160, height: 28 }} />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <SkeletonPulse colors={colors} style={{ width: 44, height: 44, borderRadius: 12 }} />
            <SkeletonPulse colors={colors} style={{ width: 44, height: 44, borderRadius: 12 }} />
            <SkeletonPulse colors={colors} style={{ width: 44, height: 44, borderRadius: 12 }} />
          </View>
        </View>

        {/* Stats Skeleton */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
          <SkeletonStatCard colors={colors} />
          <SkeletonStatCard colors={colors} />
          <SkeletonStatCard colors={colors} />
        </View>

        {/* Section Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SkeletonPulse colors={colors} style={{ width: 140, height: 24 }} />
          <SkeletonPulse colors={colors} style={{ width: 80, height: 36, borderRadius: 20 }} />
        </View>

        {/* Invoice Cards Skeleton */}
        <View style={{ gap: 12 }}>
          <SkeletonInvoiceCard colors={colors} />
          <SkeletonInvoiceCard colors={colors} />
          <SkeletonInvoiceCard colors={colors} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const skeletonStyles = StyleSheet.create({
  invoiceCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  invoiceContent: {
    flexDirection: "row",
    padding: 16,
    minHeight: 120,
  },
  invoiceLeft: {
    flex: 1,
    marginRight: 12,
  },
  invoiceRight: {
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#e2e8f0",
  },
});

// Helper function to get date string in YYYY-MM-DD format
const formatDateForQuery = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get last 30 days date range
const getLast30DaysRange = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  return {
    fromDate: formatDateForQuery(thirtyDaysAgo),
    toDate: formatDateForQuery(today),
  };
};

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  // Applied filters (used in query)
  const [appliedSelectedFilter, setAppliedSelectedFilter] = useState<string | null>(null);
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [appliedFilterByDate, setAppliedFilterByDate] = useState<"processing_date" | "issue_date">("processing_date");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  
  // Temporary filters (used in filter sheet, not applied until Apply is clicked)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByDate, setFilterByDate] = useState<"processing_date" | "issue_date">("processing_date");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [isTrialWarningDismissed, setIsTrialWarningDismissed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  // Initialize date range to last 30 days
  useEffect(() => {
    const { fromDate: initialFrom, toDate: initialTo } = getLast30DaysRange();
    setFromDate(initialFrom);
    setToDate(initialTo);
    setAppliedFromDate(initialFrom);
    setAppliedToDate(initialTo);
  }, []);

  const [deleteDocument] = useMutation(DeleteDocumentDocument);
  const [processingDocumentId, setProcessingDocumentId] = useState<string | null>(null);

  const { registerRefetch } = useUploadProgress();
  const { data, loading, error, refetch, networkStatus, fetchMore } = useQuery(GetProcessedDocumentsDocument, {
    variables: {
      status: appliedSelectedFilter
        ? {
            equals: appliedSelectedFilter,
          }
        : {
            // notEquals: "completed",
          },
      stageStatus: {},
      query: appliedSearchQuery || undefined,
      fromDate: appliedFromDate || undefined,
      toDate: appliedToDate || undefined,
      filterByDate: appliedFilterByDate || undefined,
    },
    fetchPolicy: "cache-and-network",
    skip: !appliedFromDate || !appliedToDate, // Wait until dates are initialized
    notifyOnNetworkStatusChange: true, // Enable network status updates for refetching
  });

  const { data: userData } = useQuery(GetCurrentUserDataDocument, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    registerRefetch(refetch);
    return () => registerRefetch(undefined);
  }, [registerRefetch, refetch]);

  const isTrialExpired = userData?.getMyProfile?.trialDaysRemaining === 0 || userData?.getMyProfile?.isTrialExpired;
  const trialDaysRemaining = userData?.getMyProfile?.trialDaysRemaining ?? 0;
  const isTrial = userData?.getMyProfile?.isTrial ?? false;
  const trialShouldShowWarning = userData?.getMyProfile?.trialShouldShowWarning ?? false;
  
  // Trial warning logic
  const showTrialWarning = isTrial && !isTrialWarningDismissed;
  const shouldShowWarning = showTrialWarning && (trialDaysRemaining === 0 || (trialDaysRemaining > 0 && trialShouldShowWarning));
  const shouldShowExpiredCard = isTrialExpired && isTrial;
  
  const handleSubscribePress = () => {
    // Open web app subscription page
    const webAppUrl = "https://app.encodrix.com"; // Update with actual web app URL
    Linking.openURL(webAppUrl).catch((err) => {
      Alert.alert("Error", "Unable to open subscription page. Please visit the web app to subscribe.");
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (userData?.getMyProfile) {
      const profile = userData.getMyProfile;
      if (profile.first_name) {
        return profile.first_name;
      }
      if (profile.email) {
        return profile.email.split("@")[0];
      }
    }
    return "User";
  };

  const getUserProfile = () => {
    return userData?.getMyProfile || null;
  };

  const [profileSheetVisible, setProfileSheetVisible] = useState(false);

  const totalDocuments = (data?.documentsByStatus?.totalDocuments || 0) - (data?.documentsByStatus?.stageCount?.none || 0) - (data?.documentsByStatus?.rejectedCount || 0) || 0;
  const inProgressCount = data?.documentsByStatus?.inProgressCount || 0;
  const completedCount = data?.documentsByStatus?.completedCount || 0;
  const stageCount = (data?.documentsByStatus?.stageCount as any) || {};
  const dataExtractionCount = stageCount?.data_extraction || 0;
  const reviewCount = stageCount?.review || 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/login");
  };

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleTheme();
  };

  const handleFilterChange = (filter: string | null) => {
    setSelectedFilter(filter);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleFilterReset = () => {
    const { fromDate: resetFrom, toDate: resetTo } = getLast30DaysRange();
    // Reset temporary filters
    setFromDate(resetFrom);
    setToDate(resetTo);
    setSearchQuery("");
    setFilterByDate("processing_date");
    setSelectedFilter(null);
    
    // Apply the reset immediately
    setAppliedFromDate(resetFrom);
    setAppliedToDate(resetTo);
    setAppliedSearchQuery("");
    setAppliedFilterByDate("processing_date");
    setAppliedSelectedFilter(null);

    // Refetch with reset values
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const handleFilterApply = () => {
    // Apply temporary filters to applied filters
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
    setAppliedSearchQuery(searchQuery);
    setAppliedFilterByDate(filterByDate);
    setAppliedSelectedFilter(selectedFilter);

    // Refetch with new applied values
    setTimeout(() => {
      refetch();
    }, 100);
  };

  const getProceedButtonIcon = (item: Document): any => {
    const stageStatus = item.wfStageStatus;
    
    if (stageStatus === "Approval") {
      return CheckCircle2;
    }
    if (stageStatus === "mapping_to_finance" && !item.isMappingConfirmed) {
      return ArrowRight;
    }
    if (stageStatus === "Data Extraction") {
      return CheckCircle2;
    }
    return CheckCircle2;
  };

  const getProceedButtonBgColor = (item: Document): string => {
    const stageStatus = item.wfStageStatus;
    
    if (stageStatus === "Approval") {
      return colors.stats.green.bg;
    }
    if (stageStatus === "mapping_to_finance" && !item.isMappingConfirmed) {
      return colors.stats.purple.bg;
    }
    if (stageStatus === "Data Extraction") {
      return colors.stats.blue.bg;
    }
    return colors.stats.green.bg;
  };

  const getProceedButtonIconColor = (item: Document): string => {
    const stageStatus = item.wfStageStatus;
    
    if (stageStatus === "Approval") {
      return colors.stats.green.text;
    }
    if (stageStatus === "mapping_to_finance" && !item.isMappingConfirmed) {
      return colors.stats.purple.text;
    }
    if (stageStatus === "Data Extraction") {
      return colors.stats.blue.text;
    }
    return colors.stats.green.text;
  };

  const handleProceedDocument = async (item: Document) => {
    if (isTrialExpired) {
      Alert.alert(
        "Trial Expired",
        "Your free trial has expired. Please subscribe to continue processing invoices."
      );
      return;
    }

    const instanceId = item.workflowDocumentInstanceId;
    if (!instanceId) {
      Alert.alert("Error", "Workflow instance ID is not available");
      return;
    }

    setProcessingDocumentId(item.id);
    try {
      const response = await uploadService.processStageAction(
        instanceId,
        "accept",
        "Document approved"
      );

      if (!response?.ok) {
        Alert.alert("Error", response?.error || "Unknown error");
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Document processed successfully");
      await refetch();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Something went wrong while processing the document");
    } finally {
      setProcessingDocumentId(null);
    }
  };

  const shouldShowProceedButton = (item: Document): boolean => {
    if (!item.workflowDocumentInstanceId) return false;
    
    const documentStatus = item.workflowStatus?.toLowerCase();
    if (documentStatus === "rejected" || documentStatus === "completed" || documentStatus === "on_hold") {
      return false;
    }

    return true;
  };

  const handleDeleteDocument = async (documentId: string, documentName: string) => {
    if (isTrialExpired) {
      Alert.alert(
        "Trial Expired",
        "Your free trial has expired. Please subscribe to continue managing invoices."
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Delete Document",
      `Are you sure you want to delete "${documentName}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { data: deleteData } = await deleteDocument({
                variables: {
                  documentId,
                  deleteFromS3: true,
                },
              });

              if (deleteData?.deleteDocument?.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Document deleted successfully");
                await refetch();
              } else {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                Alert.alert(
                  "Error",
                  deleteData?.deleteDocument?.message || "Failed to delete document"
                );
              }
            } catch (err: any) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Error", err.message || "Failed to delete document");
            }
          },
        },
      ]
    );
  };


  const filterDocuments = (docs: Document[], filter: string | null): Document[] => {
    if (!filter) return docs;
    
    return docs.filter((doc) => {
      const status = doc.workflowStatus?.toLowerCase() || "pending";
      
      switch (filter) {
        case "in_progress":
          return status === "in_progress" || status === "inprogress";
        case "completed":
          return status === "completed";
        case "pending":
          return status === "pending";
        default:
          return true;
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return { bg: colors.status.completedBg, text: colors.status.completed };
      case "inprogress":
      case "in_progress":
        return {
          bg: colors.status.inProgressBg,
          text: colors.status.inProgress,
        };
      case "pending":
        return { bg: colors.status.pendingBg, text: colors.status.pending };
      case "rejected":
        return { bg: colors.status.rejectedBg, text: colors.status.rejected };
      default:
        return { bg: colors.border.light, text: colors.text.secondary };
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

  const truncateVendorName = (name: string, maxLength: number = 30): string => {
    if (!name || name === "N/A") return name;
    if (name.length <= maxLength) return name;
    return name.slice(0, maxLength) + "...";
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
          workflowDocumentInstanceId: item.workflowDocumentInstanceId || "",
        },
      });
    }
  };

  const allDocuments = data?.documentsByStatus?.documents || [];
  const documents = filterDocuments(allDocuments, selectedFilter);

  const canLoadMore = false;

  const handleLoadMore = async () => {
    if (!canLoadMore) return;
  };

  // Notification data - will be replaced with actual query when available
  const notifications: Notification[] = [];
  const unreadNotificationCount = notifications.filter((n) => !n.isSeen).length;

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const statusColors = getStatusColor(item.workflowStatus || "pending");
    const vendorName = truncateVendorName(item.businessName || "N/A");
    const displayDate = item.issueDate || item.createdAt;

    return (
      <View
        style={[
          styles.invoiceItem,
          { 
            backgroundColor: colors.background.card, 
            borderColor: colors.border.DEFAULT,
            borderLeftWidth: 4,
            borderLeftColor: statusColors.bg, // Colored left border for status
          },
        ]}
      >
        <View style={styles.invoiceItemContent}>
          {/* Left Side - Information */}
          <View style={styles.invoiceLeft}>
            <View style={styles.invoiceInfo}>
              <Text style={[styles.invoiceNumber, { color: colors.text.primary }]} numberOfLines={1}>
                {item.documentName || "Untitled Invoice"}
              </Text>
              <Text style={[styles.invoiceVendor, { color: colors.text.secondary }]} numberOfLines={1}>
                Client: {item.businessName}
              </Text>
              <View style={styles.infoRow}>
                <Text style={[styles.invoiceDate, { color: colors.text.muted }]}>
                  {formatDate(displayDate)}
                </Text>
              </View>
              <View style={styles.invoiceMetaRow}>
                {item.documentHighLevelType && (
                  <View style={[styles.metaBadge, { backgroundColor: colors.background.gray }]}>
                    <Text style={[styles.metaLabel, { color: colors.text.muted }]}>Type:</Text>
                    <Text style={[styles.metaValue, { color: colors.text.secondary }]}>
                      {item.documentHighLevelType}
                    </Text>
                  </View>
                )}
                {item.wfStageStatus && (
                  <View style={[styles.metaBadge, { backgroundColor: colors.background.gray }]}>
                    <Text style={[styles.metaLabel, { color: colors.text.muted }]}>Stage:</Text>
                    <Text style={[styles.metaValue, { color: colors.text.secondary }]}>
                      {item.wfStageStatus}
                    </Text>
                  </View>
                )}
              </View>
              <View style={[styles.statusBadgeInline, { backgroundColor: statusColors.bg }]}>
                <Text style={[styles.statusTextInline, { color: statusColors.text }]}>
                  {item.workflowStatus || "Pending"}
                </Text>
              </View>
            </View>
          </View>

          {/* Right Side - Action Buttons (Vertically Aligned) */}
          <View style={[styles.invoiceRightButtons, { borderLeftColor: colors.border.light }]}>
            {/* Eye Icon Button - View Invoice Detail */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.background.gray,
                  marginBottom: 8,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleDocumentPress(item);
              }}
              activeOpacity={0.7}
            >
              <Eye size={18} color={colors.text.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
            {shouldShowProceedButton(item) && (
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  {
                    backgroundColor: getProceedButtonBgColor(item),
                    marginBottom: 8,
                    opacity: (processingDocumentId === item.id || isTrialExpired) ? 0.6 : 1,
                  },
                ]}
                onPress={() => handleProceedDocument(item)}
                activeOpacity={0.7}
                disabled={processingDocumentId === item.id || isTrialExpired}
              >
                {processingDocumentId === item.id ? (
                  <ActivityIndicator size="small" color={getProceedButtonIconColor(item)} />
                ) : (
                  (() => {
                    const Icon = getProceedButtonIcon(item);
                    return <Icon size={18} color={getProceedButtonIconColor(item)} strokeWidth={2.5} />;
                  })()
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: colors.status.rejectedBg,
                  opacity: isTrialExpired ? 0.5 : 1,
                },
              ]}
              onPress={() => handleDeleteDocument(item.id, item.documentName || "Untitled Invoice")}
              activeOpacity={0.7}
              disabled={isTrialExpired}
            >
              <Trash2 size={18} color={colors.status.rejected} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Show full page loading only on initial load or full refetch (not on fetchMore)
  // NetworkStatus values: 1=loading, 4=refetch, 3=fetchMore
  const isInitialLoading = loading && networkStatus === 1 && !data;
  const isRefetching = networkStatus === 4;
  const isFetchingMore = networkStatus === 3;

  if (isInitialLoading) {
    return <DashboardSkeleton colors={colors} />;
  }

  // Show trial expired card if trial is expired
  if (shouldShowExpiredCard) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
        <ScrollView
          contentContainerStyle={styles.trialExpiredScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trialExpiredContainer}>
            <View
              style={[
                styles.trialExpiredCard,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.DEFAULT,
                },
              ]}
            >
              {/* Icon */}
              <View
                style={[
                  styles.trialExpiredIconContainer,
                  { backgroundColor: colors.background.gray },
                ]}
              >
                <AlertTriangle size={48} color={colors.status.rejected} strokeWidth={2.5} />
              </View>

              {/* Title */}
              <Text style={[styles.trialExpiredTitle, { color: colors.text.primary }]}>
                Trial Expired
              </Text>

              {/* Description */}
              <Text style={[styles.trialExpiredDescription, { color: colors.text.secondary }]}>
                Your trial has expired. Subscribe via the web app to continue processing invoices and access your data.
              </Text>

              {/* Key Points */}
              <View style={styles.trialExpiredPoints}>
                <View style={styles.trialExpiredPoint}>
                  <Shield size={18} color={colors.primary.DEFAULT} strokeWidth={2.5} />
                  <Text style={[styles.trialExpiredPointText, { color: colors.text.secondary }]}>
                    Your data is safe and preserved
                  </Text>
                </View>
                <View style={styles.trialExpiredPoint}>
                  <CheckCircle2 size={18} color={colors.stats.green.text} strokeWidth={2.5} />
                  <Text style={[styles.trialExpiredPointText, { color: colors.text.secondary }]}>
                    Instant access after subscription
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    const handleRetry = async () => {
      await handleLogout();
      await refetch();
    };

    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={colors.status.rejected}
        />
        <Text style={styles.errorText}>Error loading documents</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        }>
        {/* Trial Warning Banner - Only show when trial is expiring (not expired) */}
        {shouldShowWarning && !isTrialExpired && (
          <View
            style={[
              styles.trialWarningBanner,
              {
                backgroundColor: colors.stats.yellow.bg,
              },
            ]}
          >
            <View style={styles.trialWarningContent}>
              <AlertTriangle
                size={16}
                color={colors.stats.yellow.text}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.trialWarningText,
                  {
                    color: colors.stats.yellow.text,
                  },
                ]}
              >
                Your trial is expiring soon - {trialDaysRemaining} {trialDaysRemaining === 1 ? "day" : "days"} remaining
              </Text>
              <TouchableOpacity
                onPress={() => setIsTrialWarningDismissed(true)}
                style={styles.trialWarningDismiss}
                activeOpacity={0.7}
              >
                <X
                  size={14}
                  color={colors.stats.yellow.text}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {/* Upload / extraction in progress - visible on dashboard and upload tab */}
        <UploadProgressBanner />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>
              {getGreeting()} 👋
            </Text>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              {getUserName()}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT },
              ]}
              onPress={handleThemeToggle}
              activeOpacity={0.6}>
              {theme === 'dark' ? (
                <Sun size={20} color={colors.primary.DEFAULT} strokeWidth={2.5} />
              ) : (
                <Moon size={20} color={colors.primary.DEFAULT} strokeWidth={2.5} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.notificationButton,
                { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowNotificationDrawer(true);
              }}
              activeOpacity={0.6}>
              <Bell size={20} color={colors.primary.DEFAULT} strokeWidth={2.5} />
              {/* Notification Badge */}
              {unreadNotificationCount > 0 && (
                <View style={[styles.notificationBadge, { backgroundColor: colors.status.rejected }]}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount.toString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.profileButton,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setProfileSheetVisible(true);
              }}
              activeOpacity={0.6}>
              {getUserProfile()?.profile_image ? (
                <Image
                  source={{ uri: getUserProfile().profile_image }}
                  style={styles.profileImage}
                />
              ) : (
                <Text style={styles.profileInitials}>
                  {getUserName().charAt(0).toUpperCase()}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Invoices"
            value={totalDocuments.toString()}
            icon={FileText}
            color={colors.primary.DEFAULT}
            bgColor={colors.stats.blue.bg}
            textColor={colors.stats.blue.text}
          />
          <StatCard
            title="Processing"
            value={inProgressCount.toString()}
            icon={Clock}
            color={colors.stats.yellow.text}
            bgColor={colors.stats.yellow.bg}
            textColor={colors.stats.yellow.text}
          />
          <StatCard
            title="Completed"
            value={completedCount.toString()}
            icon={CheckCircle2}
            color={colors.stats.green.text}
            bgColor={colors.stats.green.bg}
            textColor={colors.stats.green.text}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Recent Invoices
            </Text>
            <TouchableOpacity
              style={[styles.filterButtonHeader, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowFilterSheet(true);
              }}
              activeOpacity={0.7}
            >
              <Filter size={18} color={colors.text.primary} />
              <Text style={[styles.filterButtonHeaderText, { color: colors.text.primary }]}>
                Filters
              </Text>
              {(searchQuery || selectedFilter || (fromDate && toDate)) && (
                <View style={[styles.filterBadge, { backgroundColor: colors.primary.DEFAULT }]} />
              )}
            </TouchableOpacity>
          </View>

          {isRefetching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
              <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                Applying filters...
              </Text>
            </View>
          ) : documents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="receipt-outline"
                size={64}
                color={colors.text.muted}
              />
              <Text style={styles.emptyText}>No invoices found</Text>
              <Text style={styles.emptySubtext}>
                Upload your first invoice to start data extraction
              </Text>
            </View>
          ) : (
            <View style={styles.invoiceList}>
              {documents.map((item: Document) => (
                <View key={item.id}>{renderDocumentItem({ item })}</View>
              ))}

              {canLoadMore && (
                <View style={styles.loadMoreContainer}>
                  <TouchableOpacity
                    style={[
                      styles.loadMoreButton,
                      {
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.DEFAULT,
                      },
                    ]}
                    onPress={handleLoadMore}
                    activeOpacity={0.7}
                    disabled={isFetchingMore}
                  >
                    {isFetchingMore ? (
                      <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                    ) : (
                      <>
                        <Text style={[styles.loadMoreText, { color: colors.text.primary }]}>
                          Load more invoices
                        </Text>
                        <ArrowRight size={16} color={colors.primary.DEFAULT} strokeWidth={2.5} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <ProfileBottomSheet
        visible={profileSheetVisible}
        onClose={() => setProfileSheetVisible(false)}
        onSettings={() => {
          setProfileSheetVisible(false);
          router.push('/profile');
        }}
        onLogout={handleLogout}
        userName={
          getUserProfile()?.first_name && getUserProfile()?.last_name
            ? `${getUserProfile().first_name} ${getUserProfile().last_name}`
            : getUserName()
        }
        userEmail={getUserProfile()?.email || ''}
        userProfileImage={getUserProfile()?.profile_image}
      />

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={showFilterSheet}
        onClose={() => setShowFilterSheet(false)}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        filterByDate={filterByDate}
        onFilterByDateChange={setFilterByDate}
        selectedStatus={selectedFilter}
        onStatusChange={setSelectedFilter}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        open={showNotificationDrawer}
        onClose={() => setShowNotificationDrawer(false)}
        notifications={notifications}
        loading={false}
        onNotificationPress={(notificationId) => {
          // Handle notification press
          console.log("Notification pressed:", notificationId);
        }}
      />
    </SafeAreaView>
  );
}

const statCardStyles = StyleSheet.create({
  statCard: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
});

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
      gap: 12,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
    },
    greeting: {
      fontSize: 14,
      marginBottom: 4,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    notificationBadgeText: {
      color: "#ffffff",
      fontSize: 10,
      fontWeight: "700",
    },
    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    profileImage: {
      width: 44,
      height: 44,
      borderRadius: 12,
    },
    profileInitials: {
      fontSize: 16,
      fontWeight: "700",
      color: "#ffffff",
    },
    statsContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 32,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    filterButtonHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      position: "relative",
    },
    filterButtonHeaderText: {
      fontSize: 14,
      fontWeight: "600",
    },
    filterBadge: {
      position: "absolute",
      top: -2,
      right: -2,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    invoiceList: {
      gap: 12,
    },
    loadMoreContainer: {
      marginTop: 8,
      paddingVertical: 8,
    },
    loadMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 999,
      borderWidth: 1,
      alignSelf: "center",
    },
    loadMoreText: {
      fontSize: 14,
      fontWeight: "600",
    },
    invoiceItem: {
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      marginBottom: 12,
      overflow: "hidden",
    },
    invoiceItemContent: {
      flexDirection: "row",
      padding: 16,
      minHeight: 120,
    },
    invoiceLeft: {
      flex: 1,
      marginRight: 12,
    },
    invoiceInfo: {
      flex: 1,
    },
    invoiceNumber: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 6,
      lineHeight: 22,
    },
    invoiceVendor: {
      fontSize: 13,
      marginBottom: 6,
    },
    infoRow: {
      marginBottom: 8,
    },
    invoiceDate: {
      fontSize: 12,
    },
    invoiceOrgClient: {
      fontSize: 11,
      marginBottom: 2,
    },
    invoiceMetaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 8,
    },
    metaBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    metaLabel: {
      fontSize: 11,
      fontWeight: "500",
    },
    metaValue: {
      fontSize: 11,
      fontWeight: "600",
    },
    statusBadgeInline: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    statusTextInline: {
      fontSize: 11,
      fontWeight: "600",
    },
    invoiceRightButtons: {
      justifyContent: "flex-start",
      alignItems: "center",
      paddingLeft: 12,
      borderLeftWidth: 1,
    },
    actionButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 44,
    },
    loadingContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl,
      gap: 12,
    },
    loadingText: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.regular,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
      color: colors.text.primary,
      marginTop: spacing.md,
    },
    emptySubtext: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.lg,
    },
    errorText: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
      color: colors.text.primary,
      marginTop: spacing.md,
    },
    errorSubtext: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
      marginTop: spacing.xs,
      textAlign: "center",
    },
    retryButton: {
      backgroundColor: colors.primary.DEFAULT,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
      ...shadows.sm,
    },
    retryButtonText: {
      color: colors.background.light,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
    },
    trialWarningBanner: {
      marginHorizontal: 20,
      marginTop: 12,
      marginBottom: 8,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    trialWarningContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    trialWarningText: {
      flex: 1,
      fontSize: 13,
      fontWeight: "600",
    },
    trialWarningDismiss: {
      padding: 4,
    },
    trialExpiredScrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      padding: 20,
    },
    trialExpiredContainer: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    trialExpiredCard: {
      borderRadius: 16,
      borderWidth: 1,
      padding: 24,
      alignItems: "center",
      ...shadows.md,
    },
    trialExpiredIconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    trialExpiredTitle: {
      fontSize: 22,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 12,
    },
    trialExpiredDescription: {
      fontSize: 15,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 24,
    },
    trialExpiredPoints: {
      width: "100%",
      gap: 12,
      marginBottom: 24,
      alignItems: "center",
    },
    trialExpiredPoint: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      width: "100%",
    },
    trialExpiredPointText: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },
    trialExpiredButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      width: "100%",
      ...shadows.md,
    },
    trialExpiredButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#ffffff",
    },
  });

const styles = getStyles(getColors("light")); // Default, will be overridden
