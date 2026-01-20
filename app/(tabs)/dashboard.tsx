import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import {
  CheckCircle2,
  Clock,
  FileText,
  Moon,
  Sun,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileBottomSheet from "../../components/ProfileBottomSheet";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import authService from "../../src/lib/services/auth.service";

const GET_CURRENT_USER_DATA = gql`
  query GetCurrentUserData {
    getMyProfile {
      id
      first_name: firstName
      last_name: lastName
      email
      role
      profile_image: profileImage
      organization_name: organizationName
    }
  }
`;

const GET_PROCESSED_DOCUMENTS = gql`
  query GetProcessedDocuments(
    $status: StringFilter
    $stageStatus: StringFilter
    $query: String
    $page: Int
    $pageSize: Int
    $fromDate: String
    $toDate: String
  ) {
    documentsByStatus(
      status: $status
      stageStatus: $stageStatus
      q: $query
      page: $page
      pageSize: $pageSize
      fromDate: $fromDate
      toDate: $toDate
    ) {
      documents {
        id
        documentName
        documentType
        workflowStatus
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
  workflowStatus: string;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  fileFormat: string;
  s3Urls: string[];
  invoiceDataId?: string;
  issueDate?: string;
}

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

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  const { data, loading, error, refetch } = useQuery(GET_PROCESSED_DOCUMENTS, {
    variables: {
      page: 1,
      pageSize: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  const { data: userData } = useQuery(GET_CURRENT_USER_DATA, {
    fetchPolicy: "cache-and-network",
  });

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

  const totalDocuments = data?.documentsByStatus?.totalDocuments || 0;
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
        },
      });
    }
  };

  const allDocuments = data?.documentsByStatus?.documents || [];
  const documents = filterDocuments(allDocuments, selectedFilter);

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const statusColors = getStatusColor(item.workflowStatus || "pending");
    const vendorName = truncateVendorName(item.businessName || "N/A");
    const displayDate = item.issueDate || item.createdAt;

    return (
      <TouchableOpacity
        style={[
          styles.invoiceItem,
          { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT },
        ]}
        activeOpacity={0.6}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleDocumentPress(item);
        }}
      >
        <View style={styles.invoiceLeft}>
          <View
            style={[
              styles.invoiceIconContainer,
              { backgroundColor: statusColors.bg },
            ]}
          >
            <FileText size={20} color={statusColors.text} />
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={[styles.invoiceNumber, { color: colors.text.primary }]} numberOfLines={1}>
              {item.documentName || "Untitled Invoice"}
            </Text>
            <Text
              style={[styles.invoiceVendor, { color: colors.text.secondary }]}>
              {vendorName}
            </Text>
          </View>
        </View>
        <View style={styles.invoiceRight}>
          <Text style={[styles.invoiceDate, { color: colors.text.secondary }]}>
            {formatDate(displayDate)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.workflowStatus || "Pending"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
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
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
            colors={[colors.primary.DEFAULT]}
          />
        }>
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
            title="Extracting"
            value={dataExtractionCount.toString()}
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
          </View>

          {/* Filter Buttons */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === null && styles.filterButtonActive,
                { 
                  backgroundColor: selectedFilter === null 
                    ? colors.primary.DEFAULT 
                    : colors.background.card,
                  borderColor: colors.border.DEFAULT 
                }
              ]}
              onPress={() => handleFilterChange(null)}
            >
              <Text style={[
                styles.filterButtonText,
                { color: selectedFilter === null ? '#ffffff' : colors.text.primary }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'in_progress' && styles.filterButtonActive,
                { 
                  backgroundColor: selectedFilter === 'in_progress'
                    ? colors.primary.DEFAULT 
                    : colors.background.card,
                  borderColor: colors.border.DEFAULT 
                }
              ]}
              onPress={() => handleFilterChange('in_progress')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: selectedFilter === 'in_progress' ? '#ffffff' : colors.text.primary }
              ]}>
                In Progress
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'completed' && styles.filterButtonActive,
                { 
                  backgroundColor: selectedFilter === 'completed'
                    ? colors.primary.DEFAULT 
                    : colors.background.card,
                  borderColor: colors.border.DEFAULT 
                }
              ]}
              onPress={() => handleFilterChange('completed')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: selectedFilter === 'completed' ? '#ffffff' : colors.text.primary }
              ]}>
                Completed
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === 'pending' && styles.filterButtonActive,
                { 
                  backgroundColor: selectedFilter === 'pending'
                    ? colors.primary.DEFAULT 
                    : colors.background.card,
                  borderColor: colors.border.DEFAULT 
                }
              ]}
              onPress={() => handleFilterChange('pending')}
            >
              <Text style={[
                styles.filterButtonText,
                { color: selectedFilter === 'pending' ? '#ffffff' : colors.text.primary }
              ]}>
                Pending
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {documents.length === 0 ? (
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
            </View>
          )}
        </View>
      </ScrollView>

      <ProfileBottomSheet
        visible={profileSheetVisible}
        onClose={() => setProfileSheetVisible(false)}
        onSettings={() => {
          setProfileSheetVisible(false);
          console.log('Settings clicked');
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
    filterContainer: {
      marginBottom: 16,
    },
    filterContent: {
      gap: 8,
      paddingHorizontal: 20,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 8,
    },
    filterButtonActive: {
      // Active state handled by backgroundColor
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    themeButton: {
      width: 44,
      height: 44,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
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
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    invoiceList: {
      gap: 12,
    },
    invoiceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 18,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
    },
    invoiceLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    invoiceIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    invoiceInfo: {
      flex: 1,
    },
    invoiceNumber: {
      fontSize: 15,
      fontWeight: "600",
      marginBottom: 4,
    },
    invoiceVendor: {
      fontSize: 13,
    },
    invoiceRight: {
      alignItems: "flex-end",
    },
    invoiceDate: {
      fontSize: 13,
      marginBottom: 6,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "600",
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
  });

const styles = getStyles(getColors("light")); // Default, will be overridden
