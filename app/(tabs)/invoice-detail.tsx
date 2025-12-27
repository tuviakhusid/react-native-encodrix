import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import invoiceService from "../../src/lib/services/invoice.service";
import { Alert } from "react-native";

const GET_EXTRACTED_DATA = gql`
  query GetExtractedData($invoiceId: String!) {
    getExractedData(invoiceId: $invoiceId)
  }
`;

interface ExtractedData {
  _id?: string;
  extracted_data?: {
    invoice_number?: string;
    issue_date?: string;
    total_amount?: string | number;
    subtotal_amount?: string | number;
    tax_amount?: string | number;
    currency?: string;
    vendor_name?: string;
    vendor_business_number?: string;
    client_name?: string;
    tax_code?: string;
    payment_terms?: string;
    invoice_reference?: string;
    purchase_order_number?: string;
    due_date?: string;
    vendor_contact?: {
      name?: string;
      account_number?: string;
      contact_id?: string;
    };
    document_meta?: {
      document_type?: string;
      document_high_level_type?: string;
      document_high_level_group?: string;
    };
    [key: string]: any;
  };
  s3_url?: string;
  workflow_status?: string;
  stage_status?: string;
  [key: string]: any;
}

export default function InvoiceDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const invoiceDataId = params.invoiceDataId as string;
  const documentId = params.documentId as string;
  const s3Url = params.s3Url as string;
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(GET_EXTRACTED_DATA, {
    variables: { invoiceId: invoiceDataId },
    skip: !invoiceDataId,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.getExractedData) {
      setExtractedData(data.getExractedData);
      setLoading(false);
    } else if (error) {
      setLoading(false);
    }
  }, [data, error]);

  const formatCurrency = (value: string | number | undefined): string => {
    if (!value) return "N/A";
    // If value is already formatted as currency string (e.g., "$3,003.00"), return as is
    if (typeof value === "string" && value.includes("$")) {
      return value;
    }
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numValue);
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleOpenFile = async (url: string) => {
    if (!url) {
      Alert.alert("Error", "File URL is not available");
      return;
    }

    try {
      // Use invoice service to preview document with streaming endpoint
      // This handles authentication and proper URL construction
      await invoiceService.previewDocument(url);
    } catch (error) {
      console.error("Error opening file:", error);
      Alert.alert("Error", "Failed to open file. Please try again.");
    }
  };

  const extracted = extractedData?.extracted_data || {};

  if (loading || queryLoading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>Loading invoice data...</Text>
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
        <Text style={styles.errorText}>Error loading invoice data</Text>
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
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: spacing.md },
        ]}
      >
        {/* Document Information Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Document Information</Text>
          <Text style={styles.cardSubtitle}>
            (Review the extracted information.)
          </Text>

          <View style={styles.fieldsGrid}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Invoice Number</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.invoice_number || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Issue Date</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {formatDate(extracted.issue_date)}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.text.secondary}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Total Amount</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {formatCurrency(extracted.total_amount)}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Subtotal Amount</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {formatCurrency(extracted.subtotal_amount)}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tax Amount</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {formatCurrency(extracted.tax_amount)}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Currency</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.currency || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Vendor Name</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.vendor_name || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Vendor Business Number</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.vendor_business_number || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Client Name</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.client_name || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Tax Code</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.tax_code || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vendor Information Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vendor Information</Text>
          <Text style={styles.cardSubtitle}>
            Review the extracted vendor information from the document.
          </Text>

          <View style={styles.fieldsGrid}>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Vendor Name</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>
                  {extracted.vendor_name || "N/A"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Vendor Contact</Text>
              <View style={styles.inputField}>
                <Text style={styles.inputText} numberOfLines={1}>
                  {extracted.vendor_contact?.name
                    ? `${extracted.vendor_contact.name}${
                        extracted.vendor_contact.account_number
                          ? ` (${extracted.vendor_contact.account_number})`
                          : ""
                      }`
                    : "N/A"}
                </Text>
                {extracted.vendor_contact && (
                  <Ionicons
                    name="chevron-down-outline"
                    size={20}
                    color={colors.text.secondary}
                  />
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Original File Link */}
        {(extractedData?.s3_url || s3Url) && (
          <TouchableOpacity
            style={styles.fileButton}
            onPress={() => {
              const fileUrl = extractedData?.s3_url || s3Url;
              if (fileUrl) {
                handleOpenFile(fileUrl);
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="document-text"
              size={24}
              color={colors.primary.DEFAULT}
            />
            <View style={styles.fileButtonText}>
              <Text style={styles.fileButtonTitle}>View Original File</Text>
              <Text style={styles.fileButtonSubtitle}>Tap to open</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.DEFAULT,
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
      paddingHorizontal: spacing.lg,
    },
    header: {
      backgroundColor: colors.background.light,
      paddingBottom: spacing.md,
      paddingHorizontal: spacing.lg,
      ...shadows.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButtonHeader: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.bold,
      fontFamily: typography.fontFamily.bold,
      color: colors.text.primary,
    },
    placeholder: {
      width: 40,
    },
    card: {
      backgroundColor: colors.background.light,
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    cardTitle: {
      fontSize: typography.sizes.xl,
      fontWeight: typography.weights.bold,
      fontFamily: typography.fontFamily.bold,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    cardSubtitle: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.primary.DEFAULT,
      marginBottom: spacing.md,
    },
    fieldsGrid: {
      gap: spacing.md,
    },
    fieldContainer: {
      marginBottom: spacing.sm,
    },
    fieldLabel: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    inputField: {
      backgroundColor: colors.background.DEFAULT,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.light,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44,
    },
    inputText: {
      fontSize: typography.sizes.md,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.primary,
      flex: 1,
    },
    fileButton: {
      backgroundColor: colors.background.light,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      ...shadows.sm,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    fileButtonText: {
      flex: 1,
      marginLeft: spacing.md,
    },
    fileButtonTitle: {
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
      color: colors.text.primary,
      marginBottom: spacing.xs / 2,
    },
    fileButtonSubtitle: {
      fontSize: typography.sizes.xs,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.sizes.md,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
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
    backButton: {
      backgroundColor: colors.primary.DEFAULT,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.md,
      marginTop: spacing.md,
      ...shadows.sm,
    },
    backButtonText: {
      color: "#ffffff", // Always white for buttons
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
    },
  });

const styles = getStyles(getColors("light")); // Default, will be overridden
