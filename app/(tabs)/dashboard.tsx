import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
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
}

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const statusColors = getStatusColor(item.workflowStatus || "pending");

    return (
      <TouchableOpacity style={styles.documentCard} activeOpacity={0.7}>
        <View style={styles.documentHeader}>
          <View style={styles.documentIconContainer}>
            <Ionicons
              name="document-text"
              size={24}
              color={colors.primary.DEFAULT}
            />
          </View>
          <View style={styles.documentInfo}>
            <Text style={styles.documentName} numberOfLines={1}>
              {item.documentName || "Untitled Invoice"}
            </Text>
            <Text style={styles.documentType}>
              {item.documentType || "Invoice"}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {item.workflowStatus || "Pending"}
            </Text>
          </View>
        </View>
        <View style={styles.documentFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="business" size={16} color={colors.text.secondary} />
            <Text style={styles.footerText}>{item.businessName || "N/A"}</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="calendar" size={16} color={colors.text.secondary} />
            <Text style={styles.footerText}>{formatDate(item.createdAt)}</Text>
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
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={colors.status.rejected}
        />
        <Text style={styles.errorText}>Error loading documents</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const documents = data?.documentsByStatus?.documents || [];

  return (
    <View style={styles.container}>
      {/* Sticky Header with Greeting */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerTop}>
          <View style={styles.greetingSection}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => setShowProfileMenu(true)}
              activeOpacity={0.7}
            >
              {getUserProfile()?.profile_image ? (
                <Image
                  source={{ uri: getUserProfile().profile_image }}
                  style={styles.avatarImage}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {getUserName().charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>Hi {getUserName()},</Text>
              <Text style={styles.greetingSubtitle}>
                Summarized Stats For Your Documents
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 90 + insets.top },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary.DEFAULT}
          />
        }
      >
        {/* Stats Cards - Total Invoices and Data Extraction */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Total Invoice</Text>
              <View style={styles.statArrowCircle}>
                <Ionicons
                  name="arrow-up"
                  size={12}
                  color={colors.text.primary}
                />
              </View>
            </View>
            <Text style={styles.statValue}>{totalDocuments}</Text>
            <Text style={styles.statSubtext}>Last Month</Text>
            <View style={styles.statAvatars}>
              <View style={[styles.statAvatar, styles.statAvatar1]} />
              <View style={[styles.statAvatar, styles.statAvatar2]} />
              <View style={[styles.statAvatar, styles.statAvatar3]} />
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={styles.statTitle}>Data Extraction</Text>
              <View style={styles.statArrowCircle}>
                <Ionicons
                  name="arrow-up"
                  size={12}
                  color={colors.text.primary}
                />
              </View>
            </View>
            <Text style={styles.statValue}>{dataExtractionCount}</Text>
            <Text style={styles.statSubtext}>In Progress</Text>
            <View style={styles.statChart}>
              <Ionicons
                name="server"
                size={20}
                color={colors.background.light}
              />
            </View>
          </View>
        </View>

        {/* Invoices Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Invoice Record</Text>
          <Text style={styles.sectionSubtitle}>
            An invoice maker app is a powerful tool designed to simplify billing
            and payment.
          </Text>
        </View>

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
          <View style={styles.documentsList}>
            {documents.map((item: Document) => (
              <View key={item.id}>{renderDocumentItem({ item })}</View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Profile Menu Modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            <View style={styles.profileMenuHeader}>
              {getUserProfile()?.profile_image ? (
                <Image
                  source={{ uri: getUserProfile().profile_image }}
                  style={styles.profileMenuAvatar}
                />
              ) : (
                <View style={styles.profileMenuAvatarPlaceholder}>
                  <Text style={styles.profileMenuAvatarText}>
                    {getUserName().charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.profileMenuInfo}>
                <Text style={styles.profileMenuName}>
                  {getUserProfile()?.first_name && getUserProfile()?.last_name
                    ? `${getUserProfile().first_name} ${
                        getUserProfile().last_name
                      }`
                    : getUserName()}
                </Text>
                <Text style={styles.profileMenuEmail}>
                  {getUserProfile()?.email || ""}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.profileMenuOption}
              onPress={() => {
                setShowProfileMenu(false);
                // Navigate to profile settings if needed
              }}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.text.primary}
              />
              <Text style={styles.profileMenuOptionText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileMenuOption}
              onPress={() => {
                setShowProfileMenu(false);
                // Navigate to settings if needed
              }}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.text.primary}
              />
              <Text style={styles.profileMenuOptionText}>Settings</Text>
            </TouchableOpacity>
            <View style={styles.profileMenuDivider} />
            <TouchableOpacity
              style={[styles.profileMenuOption, styles.profileMenuOptionDanger]}
              onPress={async () => {
                setShowProfileMenu(false);
                await handleLogout();
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color={colors.status.rejected}
              />
              <Text
                style={[
                  styles.profileMenuOptionText,
                  styles.profileMenuOptionTextDanger,
                ]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  header: {
    backgroundColor: colors.background.light,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.sm,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    overflow: "hidden",
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.background.light,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  greetingSubtitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    maxWidth: "48%",
    backgroundColor: colors.primary.DEFAULT,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
    position: "relative",
    minHeight: 140,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  statTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.medium,
    color: colors.background.light,
    opacity: 0.95,
  },
  statArrowCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background.light,
    justifyContent: "center",
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
    color: colors.background.light,
    marginBottom: spacing.xs,
  },
  statSubtext: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.background.light,
    opacity: 0.85,
  },
  statAvatars: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
    flexDirection: "row",
  },
  statAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.light,
    borderWidth: 2,
    borderColor: colors.primary.DEFAULT,
    marginLeft: -6,
  },
  statAvatar1: {
    zIndex: 3,
  },
  statAvatar2: {
    zIndex: 2,
  },
  statAvatar3: {
    zIndex: 1,
  },
  statChart: {
    position: "absolute",
    bottom: spacing.md,
    right: spacing.md,
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  documentsList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  documentCard: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  documentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primary.lightGradient[0],
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  documentInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  documentName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  documentType: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.medium,
    textTransform: "capitalize",
  },
  documentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  footerText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  profileMenu: {
    backgroundColor: colors.background.light,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  profileMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
  },
  profileMenuAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: spacing.md,
  },
  profileMenuAvatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.DEFAULT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  profileMenuAvatarText: {
    color: colors.background.light,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
  },
  profileMenuInfo: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  profileMenuEmail: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.secondary,
  },
  profileMenuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  profileMenuOptionDanger: {
    marginTop: spacing.xs,
  },
  profileMenuOptionText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    color: colors.text.primary,
  },
  profileMenuOptionTextDanger: {
    color: colors.status.rejected,
  },
  // modalOverlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   justifyContent: 'flex-end',
  // },
  profileMenuDivider: {
    height: 1,
    backgroundColor: colors.border.DEFAULT,
    marginVertical: spacing.sm,
  },
});
