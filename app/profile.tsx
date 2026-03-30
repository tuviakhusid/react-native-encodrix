import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ArrowLeft, Building2, ChevronDown, ChevronUp, CreditCard, Package, User } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    borderRadius,
    getColors,
    shadows,
    spacing,
    typography,
} from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";
import { GetCurrentUserDataDocument } from "../src/graphql/schema";

interface CollapsibleSectionProps {
  title: string;
  icon: any;
  iconColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  colors: ReturnType<typeof getColors>;
}

function CollapsibleSection({ title, icon: Icon, iconColor, isExpanded, onToggle, children, colors }: CollapsibleSectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.sectionIconContainer, { backgroundColor: iconColor + "20" }]}>
            <Icon size={20} color={iconColor} strokeWidth={2.5} />
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
        </View>
        {isExpanded ? (
          <ChevronUp size={20} color={colors.text.secondary} />
        ) : (
          <ChevronDown size={20} color={colors.text.secondary} />
        )}
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.sectionContent}>
          {children}
        </View>
      )}
    </View>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  colors: ReturnType<typeof getColors>;
}

function InfoRow({ label, value, colors }: InfoRowProps) {
  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border.light }]}>
      <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text.primary }]} numberOfLines={1}>
        {value || "N/A"}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    organization: false,
    subscription: false,
    features: false,
    branches: false,
  });

  const { data, loading, error } = useQuery(GetCurrentUserDataDocument, {
    fetchPolicy: "cache-and-network",
  });

  const profile = data?.getMyProfile;
  const userName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.first_name || profile?.email?.split("@")[0] || "User";

  const toggleSection = (section: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={colors.status.rejected}
        />
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <ArrowLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header Card */}
        <View style={[styles.profileHeader, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}>
          {profile?.profile_image ? (
            <Image
              source={{ uri: profile.profile_image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileAvatar, { backgroundColor: colors.primary.DEFAULT }]}>
              <Text style={styles.profileInitials}>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.profileName, { color: colors.text.primary }]}>
            {userName}
          </Text>
          {profile?.email && (
            <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
              {profile.email}
            </Text>
          )}
          {profile?.role && (
            <View style={[styles.roleBadge, { backgroundColor: colors.primary.bg }]}>
              <Text style={[styles.roleText, { color: colors.primary.DEFAULT }]}>
                {profile.role}
              </Text>
            </View>
          )}
        </View>

        {/* Trial Warning Banner */}
        {profile?.isTrialExpired && (
          <View style={[styles.trialWarningBanner, { backgroundColor: colors.status.rejectedBg, borderColor: colors.status.rejected }]}>
            <Ionicons name="alert-circle" size={20} color={colors.status.rejected} />
            <View style={styles.trialWarningContent}>
              <Text style={[styles.trialWarningTitle, { color: colors.status.rejected }]}>
                Trial Expired
              </Text>
              <Text style={[styles.trialWarningText, { color: colors.status.rejected }]}>
                Your free trial has expired. Please subscribe to continue using the service.
              </Text>
            </View>
          </View>
        )}

        {/* Personal Information Section */}
        <CollapsibleSection
          title="Personal Information"
          icon={User}
          iconColor={colors.primary.DEFAULT}
          isExpanded={expandedSections.personal}
          onToggle={() => toggleSection("personal")}
          colors={colors}
        >
          <InfoRow label="First Name" value={profile?.first_name} colors={colors} />
          <InfoRow label="Last Name" value={profile?.last_name} colors={colors} />
          <InfoRow label="Email" value={profile?.email} colors={colors} />
        </CollapsibleSection>

        {/* Organization Information Section */}
        <CollapsibleSection
          title="Organization"
          icon={Building2}
          iconColor={colors.stats.purple.text}
          isExpanded={expandedSections.organization}
          onToggle={() => toggleSection("organization")}
          colors={colors}
        >
          <InfoRow label="Organization Name" value={profile?.organization_name} colors={colors} />
          <InfoRow label="Organization Code" value={profile?.organization_code} colors={colors} />
          {profile?.organization_number && (
            <InfoRow label="Organization Number" value={profile.organization_number} colors={colors} />
          )}
        </CollapsibleSection>

        {/* Subscription & Trial Section */}
        {(profile?.isTrial !== undefined || profile?.subscription || profile?.packageDetails) && (
          <CollapsibleSection
            title="Subscription & Trial"
            icon={CreditCard}
            iconColor={colors.stats.green.text}
            isExpanded={expandedSections.subscription}
            onToggle={() => toggleSection("subscription")}
            colors={colors}
          >
            {profile?.packageDetails?.packageName && (
              <InfoRow label="Package" value={profile.packageDetails.packageName} colors={colors} />
            )}
            {profile?.subscription && typeof profile.subscription === 'object' && profile.subscription !== null && (
              <>
                {profile.subscription.status && (
                  <InfoRow label="Status" value={String(profile.subscription.status)} colors={colors} />
                )}
                {profile.subscription.billing_period && (
                  <InfoRow label="Billing Period" value={String(profile.subscription.billing_period)} colors={colors} />
                )}
                {profile.subscription.start_date && (
                  <InfoRow label="Start Date" value={formatDate(String(profile.subscription.start_date))} colors={colors} />
                )}
                {profile.subscription.end_date && (
                  <InfoRow label="End Date" value={formatDate(String(profile.subscription.end_date))} colors={colors} />
                )}
                {profile.subscription.subscribed_price !== undefined && profile.subscription.subscribed_price !== null && (
                  <InfoRow label="Price" value={`$${Number(profile.subscription.subscribed_price).toFixed(2)}`} colors={colors} />
                )}
              </>
            )}
            {profile?.isTrial !== undefined && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border.light }]}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Trial Status</Text>
                <View style={[styles.trialStatusBadge, { backgroundColor: profile.isTrial ? colors.stats.yellow.bg : colors.stats.green.bg }]}>
                  <Text style={[styles.trialStatusText, { color: profile.isTrial ? colors.stats.yellow.text : colors.stats.green.text }]}>
                    {profile.isTrial ? "Active Trial" : "Not on Trial"}
                  </Text>
                </View>
              </View>
            )}
            {profile?.trialDaysRemaining !== undefined && profile?.isTrial && (
              <View style={[styles.infoRow, { borderBottomColor: colors.border.light }]}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Trial Days Remaining</Text>
                <View style={[styles.trialDaysBadge, { backgroundColor: profile.trialDaysRemaining === 0 ? colors.status.rejectedBg : colors.stats.yellow.bg }]}>
                  <Text style={[styles.trialDaysText, { color: profile.trialDaysRemaining === 0 ? colors.status.rejected : colors.stats.yellow.text }]}>
                    {profile.trialDaysRemaining} {profile.trialDaysRemaining === 1 ? "day" : "days"}
                  </Text>
                </View>
              </View>
            )}
            {profile?.trialStartedAt && (
              <InfoRow label="Trial Started" value={formatDate(profile.trialStartedAt)} colors={colors} />
            )}
          </CollapsibleSection>
        )}

        {/* Package Features Section */}
        {profile?.packageDetails?.features && profile.packageDetails.features.length > 0 && (
          <CollapsibleSection
            title="Package Features"
            icon={Package}
            iconColor={colors.stats.orange.text}
            isExpanded={expandedSections.features}
            onToggle={() => toggleSection("features")}
            colors={colors}
          >
            {profile.packageDetails.features.map((feature: any, index: number) => (
              <View key={index} style={[styles.featureRow, { borderBottomColor: colors.border.light }]}>
                <View style={styles.featureContent}>
                  <Ionicons
                    name={feature.isIncluded ? "checkmark-circle" : "close-circle"}
                    size={20}
                    color={feature.isIncluded ? colors.stats.green.text : colors.text.muted}
                  />
                  <Text style={[styles.featureText, { color: colors.text.primary }]}>
                    {feature.featureName}
                  </Text>
                </View>
              </View>
            ))}
          </CollapsibleSection>
        )}

        {/* Branch Assignments Section */}
        {profile?.roleBranchAssignments && profile.roleBranchAssignments.length > 0 && (
          <CollapsibleSection
            title="Branch Assignments"
            icon={Building2}
            iconColor={colors.stats.blue.text}
            isExpanded={expandedSections.branches}
            onToggle={() => toggleSection("branches")}
            colors={colors}
          >
            {profile.roleBranchAssignments.map((assignment: any, index: number) => (
              <View key={index} style={[styles.infoRow, { borderBottomColor: colors.border.light }]}>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                  {assignment.roleName || "Role"}
                </Text>
                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                  {assignment.branchInfo?.name || "All Branches"}
                </Text>
              </View>
            ))}
          </CollapsibleSection>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backButtonHeader: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  placeholder: {
    width: 40,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    ...shadows.sm,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 2,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  trialWarningBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
  },
  trialWarningContent: {
    flex: 1,
  },
  trialWarningTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  trialWarningText: {
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContent: {
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  featureRow: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    flex: 1,
  },
  trialStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  trialDaysBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialDaysText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    color: "#666",
  },
  errorText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.semibold,
    color: "#000",
    marginTop: spacing.md,
  },
  errorSubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    color: "#666",
    marginTop: spacing.xs,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.semibold,
  },
});

const getStyles = (colors: ReturnType<typeof getColors>) => styles;
