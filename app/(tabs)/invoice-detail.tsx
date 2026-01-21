import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import invoiceService from "../../src/lib/services/invoice.service";

const GET_EXTRACTED_DATA = gql`
  query GetExtractedData($invoiceId: String!) {
    getExractedData(invoiceId: $invoiceId)
  }
`;

const DELETE_DOCUMENT = gql`
  mutation DeleteDocument($documentId: String!, $deleteFromS3: Boolean!) {
    deleteDocument(documentId: $documentId, deleteFromS3: $deleteFromS3) {
      ok
      deleted
      error
      message
    }
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
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const invoiceDataId = params.invoiceDataId as string;
  const documentId = params.documentId as string;
  const s3Url = params.s3Url as string;
  const fileFormat = params.fileFormat as string;
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isImage, setIsImage] = useState(false);
  const [loadingDocument, setLoadingDocument] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<any | null>(null);
  const [showLineItemModal, setShowLineItemModal] = useState(false);

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(GET_EXTRACTED_DATA, {
    variables: { invoiceId: invoiceDataId },
    skip: !invoiceDataId,
    fetchPolicy: "network-only",
  });

  const [deleteDocument, { loading: deleting }] = useMutation(DELETE_DOCUMENT);

  useEffect(() => {
    if (data?.getExractedData) {
      setExtractedData(data.getExractedData);
      setLoading(false);
    } else if (error) {
      setLoading(false);
    }
  }, [data, error]);

  useEffect(() => {
    setShowDocumentPreview(false);
    setDocumentUrl(null);
    setIsImage(false);
    setLoadingDocument(false);
  }, [invoiceDataId, documentId]);

  const formatCurrency = (value: string | number | undefined): string => {
    if (!value) return "N/A";
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

  const formatLabel = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getLineItems = () => {
    if (!extractedData?.extracted_data) {
      return [];
    }
    
    const data = extractedData.extracted_data;
    
    const lineItemFields = Object.keys(data).filter(
      (key) =>
        key.toLowerCase().includes("line") &&
        Array.isArray(data[key]) &&
        !key.toLowerCase().includes("general")
    );

    if (lineItemFields.length > 0) {
      return data[lineItemFields[0]];
    }

    if (data.line_items && Array.isArray(data.line_items)) {
      return data.line_items;
    }

    return [];
  };

  const getLineItemKeys = (items: any[]): string[] => {
    if (!items || items.length === 0) return [];
    
    const excludedKeys = [
      "predictions",
      "error",
      "errors",
      "id",
      "_id",
      "sourceProperty",
      "_sourceProperty",
      "selectedAccountId",
      "is_confirmed",
    ];

    const allKeys = Array.from(
      new Set(
        items.flatMap((item) =>
          typeof item === "object" && item !== null ? Object.keys(item) : []
        )
      )
    );

    return allKeys.filter(
      (key) =>
        !excludedKeys.includes(key) &&
        !key.toLowerCase().includes("error") &&
        items.some(
          (item) =>
            item[key] !== null &&
            item[key] !== undefined &&
            item[key] !== ""
        )
    );
  };

  const lineItems = getLineItems();
  const lineItemKeys = getLineItemKeys(lineItems);

  const getLineItemDisplayText = (item: any): string => {
    if (!item || typeof item !== "object") return "Line Item";
    
    const priorityKeys = [
      "description",
      "item_description",
      "name",
      "item_name",
      "title",
      "product",
      "service",
      "line_item_description",
    ];

    for (const key of priorityKeys) {
      if (item[key] && item[key] !== "" && item[key] !== null) {
        return String(item[key]);
      }
    }

    for (const key of lineItemKeys) {
      if (item[key] && item[key] !== "" && item[key] !== null) {
        const value = item[key];
        if (typeof value === "object") {
          return JSON.stringify(value);
        }
        return String(value);
      }
    }

    return `Line Item #${lineItems.indexOf(item) + 1}`;
  };

  const handleLineItemPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLineItem(item);
    setShowLineItemModal(true);
  };

  const handleDeleteDocument = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const documentName = extractedData?.extracted_data?.invoice_number || 
                         extractedData?.extracted_data?.vendor_name || 
                         "this document";
    
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
              const docId = documentId || invoiceDataId;
              if (!docId) {
                Alert.alert("Error", "Document ID is not available");
                return;
              }

              const { data: deleteData } = await deleteDocument({
                variables: {
                  documentId: docId,
                  deleteFromS3: true,
                },
              });

              if (deleteData?.deleteDocument?.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert("Success", "Document deleted successfully", [
                  {
                    text: "OK",
                    onPress: () => router.back(),
                  },
                ]);
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

  const handleOpenFile = async (fileId?: string) => {
    const file_id = fileId || documentId || invoiceDataId;

    if (!file_id) {
      Alert.alert("Error", "File ID is not available");
      return;
    }

    if (showDocumentPreview) {
      setShowDocumentPreview(false);
      return;
    }

    try {
      setLoadingDocument(true);
      const url = await invoiceService.getStreamingUrl(file_id);
      if (!url) {
        Alert.alert("Error", "Unable to generate file URL");
        setLoadingDocument(false);
        return;
      }

      const formatLower = (fileFormat || '').toLowerCase();
      const urlLower = url.toLowerCase();
      
      const isImageFile = formatLower.includes('image') || 
                         formatLower.match(/^(jpg|jpeg|png|gif|webp|bmp)$/) ||
                         urlLower.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/) ||
                         urlLower.includes('image/');
      
      const isPdfFile = formatLower === 'pdf' || 
                       formatLower.includes('pdf') ||
                       urlLower.match(/\.pdf$/i) ||
                       urlLower.includes('application/pdf');
      
      const isWordFile = formatLower.match(/^(doc|docx)$/) ||
                        formatLower.includes('word') ||
                        formatLower.includes('msword') ||
                        urlLower.match(/\.(doc|docx)$/i) ||
                        urlLower.includes('application/msword') ||
                        urlLower.includes('application/vnd.openxmlformats-officedocument.wordprocessingml');
      
      setIsImage(!!isImageFile);
      
      if (isPdfFile && !isImageFile && !isWordFile) {
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        setDocumentUrl(viewerUrl);
      } else if (isWordFile && !isImageFile && !isPdfFile) {
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
        setDocumentUrl(viewerUrl);
      } else {
        setDocumentUrl(url);
      }
      
      setShowDocumentPreview(true);
      setLoadingDocument(false);
    } catch (error) {
      Alert.alert("Error", "Failed to load file. Please try again.");
      setLoadingDocument(false);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonHeader}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <TouchableOpacity
          style={styles.deleteButtonHeader}
          onPress={handleDeleteDocument}
          disabled={deleting}
          activeOpacity={0.7}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={colors.status.rejected} />
          ) : (
            <Trash2 size={22} color={colors.status.rejected} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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

        {/* Line Items Section */}
        {lineItems.length > 0 && lineItemKeys.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Line Items</Text>
            <Text style={styles.cardSubtitle}>
              Tap on a line item to view details ({lineItems.length} items)
            </Text>

            <View style={styles.lineItemsList}>
              {lineItems.map((item: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.lineItemCard,
                    {
                      backgroundColor: colors.background.DEFAULT,
                      borderColor: colors.border.DEFAULT,
                    },
                  ]}
                  onPress={() => handleLineItemPress(item)}
                  activeOpacity={0.7}>
                  <View style={styles.lineItemCardContent}>
                    <View style={styles.lineItemCardLeft}>
                      <View style={[styles.lineItemNumberBadge, { backgroundColor: colors.primary.DEFAULT }]}>
                        <Text style={styles.lineItemNumberText}>
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        style={[styles.lineItemCardText, { color: colors.text.primary }]}
                        numberOfLines={2}>
                        {getLineItemDisplayText(item)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.text.secondary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Original File Section */}
        {(documentId || invoiceDataId) && (
          <View style={styles.fileSection}>
            <TouchableOpacity
              style={styles.fileButton}
              onPress={() => {
                handleOpenFile();
              }}
              activeOpacity={0.7}
              disabled={loadingDocument}
            >
              <Ionicons
                name="document-text"
                size={24}
                color={colors.primary.DEFAULT}
              />
              <View style={styles.fileButtonText}>
                <Text style={styles.fileButtonTitle}>View Original File</Text>
                <Text style={styles.fileButtonSubtitle}>
                  {loadingDocument ? "Loading..." : showDocumentPreview ? "Tap to hide" : "Tap to preview"}
                </Text>
              </View>
              {loadingDocument ? (
                <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
              ) : (
                <Ionicons
                  name={showDocumentPreview ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.text.secondary}
                />
              )}
            </TouchableOpacity>

            {/* Inline Document Preview */}
            {showDocumentPreview && documentUrl && (
              <View style={styles.documentPreviewContainer}>
                {isImage ? (
                  <Image
                    source={{ uri: documentUrl }}
                    style={styles.documentImage}
                    resizeMode="contain"
                    onError={() => {
                      Alert.alert("Error", "Unable to load image. The file may be corrupted or inaccessible.");
                      setShowDocumentPreview(false);
                    }}
                  />
                ) : (
                  <WebView
                    key={documentUrl} // Force remount when URL changes
                    source={{ uri: documentUrl }}
                    style={styles.documentWebView}
                    startInLoadingState={true}
                    scalesPageToFit={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    allowsInlineMediaPlayback={true}
                    mediaPlaybackRequiresUserAction={false}
                    onError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      
                      const formatLower = (fileFormat || '').toLowerCase();
                      const isWordFile = formatLower.match(/^(doc|docx)$/) ||
                                        documentUrl?.includes('officeapps.live.com');
                      const isPdfFile = formatLower === 'pdf' || 
                                       formatLower.includes('pdf') ||
                                       documentUrl?.includes('docs.google.com/viewer');
                      
                      if (isWordFile || isPdfFile) {
                        Alert.alert(
                          "Preview Unavailable",
                          `Unable to preview ${isPdfFile ? 'PDF' : 'Word'} document inline. Would you like to open it externally?`,
                          [
                            { text: "Cancel", style: "cancel", onPress: () => setShowDocumentPreview(false) },
                            {
                              text: "Open Externally",
                              onPress: async () => {
                                setShowDocumentPreview(false);
                                const file_id = documentId || invoiceDataId;
                                if (file_id) {
                                  await invoiceService.previewDocument(file_id);
                                }
                              },
                            },
                          ]
                        );
                      } else {
                        Alert.alert("Error", "Unable to display document. It may need to be downloaded.");
                        setShowDocumentPreview(false);
                      }
                    }}
                    onHttpError={(syntheticEvent) => {
                      const { nativeEvent } = syntheticEvent;
                      
                      const formatLower = (fileFormat || '').toLowerCase();
                      const isPdfFile = formatLower === 'pdf' || formatLower.includes('pdf');
                      
                      if (nativeEvent.statusCode === 403 || nativeEvent.statusCode === 401) {
                        Alert.alert(
                          "Authentication Required",
                          isPdfFile 
                            ? "This PDF requires authentication. The viewer service cannot access it. Opening externally..."
                            : "This document requires authentication. Opening externally...",
                          [
                            {
                              text: "OK",
                              onPress: async () => {
                                setShowDocumentPreview(false);
                                const file_id = documentId || invoiceDataId;
                                if (file_id) {
                                  await invoiceService.previewDocument(file_id);
                                }
                              },
                            },
                          ]
                        );
                      } else if (nativeEvent.statusCode >= 400) {
                        const formatLower = (fileFormat || '').toLowerCase();
                        const isPdfFile = formatLower === 'pdf' || formatLower.includes('pdf');
                        const isWordFile = formatLower.match(/^(doc|docx)$/);
                        
                        Alert.alert(
                          "Preview Error",
                          `Unable to load ${isPdfFile ? 'PDF' : isWordFile ? 'Word document' : 'document'}. Status: ${nativeEvent.statusCode}`,
                          [
                            { text: "Cancel", style: "cancel", onPress: () => setShowDocumentPreview(false) },
                            {
                              text: "Try Externally",
                              onPress: async () => {
                                setShowDocumentPreview(false);
                                const file_id = documentId || invoiceDataId;
                                if (file_id) {
                                  await invoiceService.previewDocument(file_id);
                                }
                              },
                            },
                          ]
                        );
                      }
                    }}
                    renderLoading={() => (
                      <View style={styles.documentLoadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
                        <Text style={styles.documentLoadingText}>Loading document...</Text>
                      </View>
                    )}
                  />
                )}
                <TouchableOpacity
                  style={styles.closePreviewButton}
                  onPress={() => setShowDocumentPreview(false)}
                >
                  <Ionicons name="close" size={24} color={colors.text.primary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Line Item Details Modal */}
      <Modal
        visible={showLineItemModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLineItemModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowLineItemModal(false);
            }}
          />
          <View
            style={[styles.modalContent, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border.light }]}>
              <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                Line Item Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowLineItemModal(false);
                }}
                style={styles.modalCloseButton}>
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalScrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalScrollContent}
              nestedScrollEnabled={true}
              bounces={true}>
              {selectedLineItem ? (
                (() => {
                  const excludedKeys = [
                    "predictions",
                    "error",
                    "errors",
                    "id",
                    "_id",
                    "sourceProperty",
                    "_sourceProperty",
                    "selectedAccountId",
                    "is_confirmed",
                  ];

                  const allKeys = selectedLineItem ? Object.keys(selectedLineItem) : [];
                  
                  const itemKeys = allKeys.filter(
                    (key) => {
                      const isExcluded = excludedKeys.includes(key);
                      const hasError = key.toLowerCase().includes("error");
                      const value = selectedLineItem[key];
                      const isEmpty = value === null || value === undefined || value === "";
                      
                      return !isExcluded && !hasError && !isEmpty;
                    }
                  );

                  if (itemKeys.length === 0) {
                    return (
                      <View style={styles.modalEmptyContainer}>
                        <Text style={[styles.modalEmptyText, { color: colors.text.secondary }]}>
                          No data available for this line item
                        </Text>
                        <Text style={[styles.modalEmptyText, { color: colors.text.secondary, marginTop: 8, fontSize: 12 }]}>
                          All keys: {allKeys.join(', ')}
                        </Text>
                      </View>
                    );
                  }

                  return (
                    <View>
                      {itemKeys.map((key) => {
                        const value = selectedLineItem[key];

                        return (
                          <View
                            key={key}
                            style={[
                              styles.modalFieldContainer,
                              { borderBottomColor: colors.border.light },
                            ]}>
                            <Text style={[styles.modalFieldLabel, { color: colors.text.secondary }]}>
                              {formatLabel(key)}
                            </Text>
                            <Text style={[styles.modalFieldValue, { color: colors.text.primary }]}>
                              {typeof value === "object" && value !== null
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  );
                })()
              ) : (
                <View style={styles.modalEmptyContainer}>
                  <Text style={[styles.modalEmptyText, { color: colors.text.secondary }]}>
                    No line item selected
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
      paddingHorizontal: 20,
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
    backButtonHeader: {
      padding: spacing.xs,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.text.primary,
    },
    deleteButtonHeader: {
      padding: spacing.xs,
      justifyContent: "center",
      alignItems: "center",
      minWidth: 40,
    },
    card: {
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 18,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text.primary,
      marginBottom: 8,
    },
    cardSubtitle: {
      fontSize: 13,
      color: colors.text.secondary,
      marginBottom: 16,
    },
    fieldsGrid: {
      gap: spacing.md,
    },
    fieldContainer: {
      marginBottom: spacing.sm,
    },
    fieldLabel: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.text.secondary,
      marginBottom: 8,
    },
    inputField: {
      backgroundColor: colors.background.DEFAULT,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 48,
    },
    inputText: {
      fontSize: 15,
      color: colors.text.primary,
      flex: 1,
    },
    fileSection: {
      marginBottom: spacing.md,
    },
    fileButton: {
      backgroundColor: colors.background.card,
      borderRadius: 16,
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
    },
    fileButtonText: {
      flex: 1,
      marginLeft: 16,
    },
    fileButtonTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text.primary,
      marginBottom: 2,
    },
    fileButtonSubtitle: {
      fontSize: 13,
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
    documentPreviewContainer: {
      marginTop: 12,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: colors.background.card,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      position: 'relative',
      minHeight: 400,
      maxHeight: 600,
    },
    documentWebView: {
      width: '100%',
      height: 500,
      backgroundColor: colors.background.DEFAULT,
    },
    documentImage: {
      width: '100%',
      height: 500,
      backgroundColor: colors.background.DEFAULT,
    },
    documentLoadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background.DEFAULT,
    },
    documentLoadingText: {
      marginTop: spacing.md,
      fontSize: typography.sizes.sm,
      color: colors.text.secondary,
    },
    closePreviewButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    lineItemsList: {
      marginTop: 12,
      gap: 12,
    },
    lineItemCard: {
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    lineItemCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    lineItemCardLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    lineItemNumberBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    lineItemNumberText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#ffffff',
    },
    lineItemCardText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      borderRadius: 20,
      width: '100%',
      maxWidth: 500,
      height: Dimensions.get('window').height * 0.85,
      maxHeight: 600,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
      borderWidth: 1,
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
    },
    modalCloseButton: {
      padding: 4,
    },
    modalScrollView: {
      flex: 1,
      minHeight: 0,
    },
    modalScrollContent: {
      padding: 20,
      paddingBottom: 30,
    },
    modalFieldContainer: {
      paddingVertical: 16,
      borderBottomWidth: 1,
    },
    modalFieldLabel: {
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
      textTransform: 'capitalize',
    },
    modalFieldValue: {
      fontSize: 15,
      lineHeight: 22,
    },
    modalEmptyContainer: {
      padding: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalEmptyText: {
      fontSize: 15,
      textAlign: 'center',
    },
  });

const styles = getStyles(getColors("light")); // Default, will be overridden
