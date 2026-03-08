import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import {
  Camera,
  FileText,
  LogOut,
  Upload,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../src/constants/theme";
import { useTheme } from "../src/context/theme-context";
import guestInviteService from "../src/lib/services/guest-invite.service";

const UPLOAD_FILE_VIA_INVITE = gql`
  mutation UploadFileViaInvite($inviteUuid: String!, $files: [Upload!]!) {
    uploadFileViaInvite(inviteUuid: $inviteUuid, files: $files) {
      success
      message
      branchId
      folderId
      uploadedFiles
      duplicateFiles
      uploadedCount
      duplicateCount
      taskIds
    }
  }
`;

interface SelectedFile {
  uri: string;
  type: string;
  name: string;
  isImage?: boolean;
}

function ActionButton({
  icon: Icon,
  title,
  description,
  color,
  bgColor,
  onPress,
  textColor,
  secondaryTextColor,
  disabled,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  onPress?: () => void;
  textColor: string;
  secondaryTextColor: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        actionButtonStyles.actionButton,
        { backgroundColor: bgColor },
        disabled && actionButtonStyles.actionButtonDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={actionButtonStyles.actionButtonContent}>
        <View style={actionButtonStyles.actionButtonLeft}>
          <View style={[actionButtonStyles.actionIconContainer, { backgroundColor: color }]}>
            <Icon size={28} color="#ffffff" strokeWidth={2.5} />
          </View>
          <View style={actionButtonStyles.actionTextContainer}>
            <Text style={[actionButtonStyles.actionButtonTitle, { color: textColor }]}>
              {title}
            </Text>
            <Text
              style={[
                actionButtonStyles.actionButtonDescription,
                { color: secondaryTextColor },
              ]}
            >
              {description}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function GuestUploadScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);

  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [uploadViaInvite] = useMutation(UPLOAD_FILE_VIA_INVITE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const code = await guestInviteService.getInviteCode();
      if (cancelled) return;
      if (!code || !code.trim()) {
        router.replace("/login");
        return;
      }
      setInviteCode(code);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogoutGuest = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Leave guest mode",
      "You will need to enter your invite code again to upload as guest.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await guestInviteService.clearInviteCode();
            router.replace("/login");
          },
        },
      ]
    );
  }, [router]);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to capture invoice images."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        // @ts-ignore
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => {
          let mimeType = asset.mimeType || "image/jpeg";
          const fileName = asset.fileName || asset.uri.split("/").pop() || "";
          const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
          const mimeMap: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
          };
          mimeType = mimeMap[ext] || mimeType;
          return {
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `image_${Date.now()}.${ext}`,
            isImage: true,
          };
        });
        setSelectedImages((prev) => [...prev, ...newImages]);
      }
    } catch {
      Alert.alert("Error", "Failed to select invoice image");
    }
  };

  const pickDocument = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/*",
        ],
        multiple: true,
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => {
          let mimeType = asset.mimeType || "application/octet-stream";
          const fileName = asset.name || asset.uri.split("/").pop() || "";
          const ext = fileName.split(".").pop()?.toLowerCase() || "";
          const mimeMap: Record<string, string> = {
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
          };
          if (!mimeType || mimeType === "application/octet-stream") {
            mimeType = mimeMap[ext] || "application/octet-stream";
          }
          return {
            uri: asset.uri,
            type: mimeType,
            name: asset.name || `document_${Date.now()}.${ext}`,
            isImage: mimeType.startsWith("image/"),
          };
        });
        setSelectedImages((prev) => [...prev, ...newFiles]);
      }
    } catch {
      Alert.alert("Error", "Failed to select document");
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        // @ts-ignore
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newImage = {
          uri: asset.uri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          isImage: true,
        };
        setSelectedImages((prev) => [...prev, newImage]);
      }
    } catch {
      Alert.alert("Error", "Failed to capture invoice photo");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: SelectedFile) => {
    const mimeType = file.type?.toLowerCase() || "";
    if (file.isImage || mimeType.startsWith("image/")) return "image";
    if (mimeType.includes("pdf")) return "document-text";
    return "document-text";
  };

  const handleUpload = async () => {
    if (!inviteCode || selectedImages.length === 0) {
      Alert.alert("No Invoices", "Please select at least one invoice file to upload");
      return;
    }
    setUploading(true);
    try {
      const files = selectedImages.map((file) => {
        let mimeType = file.type || "application/octet-stream";
        if (!mimeType || mimeType === "image" || mimeType === "application/octet-stream") {
          const ext = file.name.split(".").pop()?.toLowerCase();
          const mimeMap: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          };
          mimeType = mimeMap[ext || ""] || mimeType;
        }
        return new ReactNativeFile({
          uri: file.uri,
          type: mimeType,
          name: file.name,
        });
      });

      // Log request (no file URIs/binary)
      const fileMeta = selectedImages.map((f) => ({ name: f.name, type: f.type }));
      console.log("[Guest Upload] Request:", {
        inviteUuid: inviteCode,
        fileCount: files.length,
        fileMeta,
      });

      const result = await uploadViaInvite({
        variables: {
          inviteUuid: inviteCode,
          files,
        },
      });

      const data = result.data?.uploadFileViaInvite;
      console.log("[Guest Upload] Response:", {
        success: data?.success,
        message: data?.message,
        uploadedCount: data?.uploadedCount,
        duplicateCount: data?.duplicateCount,
        taskIds: data?.taskIds,
        fullData: data,
      });

      if (data?.success) {
        setSelectedImages([]);
        Alert.alert(
          "Upload complete",
          data.message || "Invoices uploaded. Extraction in progress.",
          [{ text: "OK" }]
        );
      } else {
        throw new Error(data?.message || "Upload failed");
      }
    } catch (error: any) {
      // Log full error for 500 / server errors
      const graphQLErrors = error?.graphQLErrors;
      const networkError = error?.networkError;
      const statusCode = networkError?.statusCode ?? networkError?.response?.status;
      console.warn("[Guest Upload] Error:", {
        message: error?.message,
        statusCode,
        graphQLErrors: graphQLErrors?.map((e: any) => ({
          message: e?.message,
          extensions: e?.extensions,
        })),
        networkError: networkError
          ? {
              message: networkError?.message,
              statusCode: networkError?.statusCode,
              response: networkError?.response
                ? { status: networkError.response.status, data: networkError.response.data }
                : undefined,
            }
          : undefined,
      });
      Alert.alert(
        "Upload Failed",
        error?.message || "Failed to upload invoices. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  if (!ready || !inviteCode) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            Loading…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.DEFAULT }]} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Guest upload
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.text.secondary }]}>
            Upload invoices with your invite code
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.background.card, borderColor: colors.border.DEFAULT }]}
          onPress={handleLogoutGuest}
          activeOpacity={0.7}
        >
          <LogOut size={18} color={colors.text.secondary} strokeWidth={2.5} />
          <Text style={[styles.logoutButtonText, { color: colors.text.secondary }]}>
            Leave guest
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsContainer}>
          <ActionButton
            icon={Camera}
            title="Scan with Camera"
            description="Take a photo of your invoice"
            color={colors.primary.DEFAULT}
            bgColor={colors.stats.blue.bg}
            onPress={takePhoto}
            textColor={colors.text.primary}
            secondaryTextColor={colors.text.secondary}
            disabled={uploading}
          />
          <ActionButton
            icon={Upload}
            title="Upload from Gallery"
            description="Select from your photos"
            color={colors.stats.purple.text}
            bgColor={colors.stats.purple.bg}
            onPress={pickImage}
            textColor={colors.text.primary}
            secondaryTextColor={colors.text.secondary}
            disabled={uploading}
          />
          <ActionButton
            icon={FileText}
            title="Select Document"
            description="Choose PDF or document files"
            color={colors.stats.orange.text}
            bgColor={colors.stats.orange.bg}
            onPress={pickDocument}
            textColor={colors.text.primary}
            secondaryTextColor={colors.text.secondary}
            disabled={uploading}
          />
        </View>

        {selectedImages.length > 0 && (
          <>
            <View style={styles.selectedImagesContainer}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                Selected Invoices ({selectedImages.length})
              </Text>
              <View style={styles.imagesGrid}>
                {selectedImages.map((file, index) => (
                  <View key={index} style={styles.imageContainer}>
                    {file.isImage ? (
                      <Image source={{ uri: file.uri }} style={styles.image} />
                    ) : (
                      <View style={[styles.documentPreview, { backgroundColor: colors.background.light, borderColor: colors.border.light }]}>
                        <Ionicons name={getFileIcon(file) as any} size={48} color={colors.primary.DEFAULT} />
                        <Text style={[styles.documentName, { color: colors.text.primary }]} numberOfLines={2}>
                          {file.name}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: colors.background.light }]}
                      onPress={() => removeImage(index)}
                      disabled={uploading}
                    >
                      <Ionicons name="close-circle" size={24} color={colors.status.rejected} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleUpload}
              disabled={uploading}
              activeOpacity={0.8}
              style={[
                styles.uploadButton,
                { backgroundColor: colors.primary.DEFAULT },
                uploading && styles.uploadButtonDisabled,
              ]}
            >
              {uploading ? (
                <ActivityIndicator color={colors.background.light} />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={20} color={colors.background.light} />
                  <Text style={styles.uploadButtonText}>
                    Upload {selectedImages.length} Invoice
                    {selectedImages.length > 1 ? "s" : ""} for Processing
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}

        {selectedImages.length === 0 && (
          <View style={[styles.infoBox, { backgroundColor: colors.stats.blue.bg }]}>
            <FileText size={20} color={colors.primary.DEFAULT} />
            <Text style={[styles.infoText, { color: colors.stats.blue.text }]}>
              Supported: PDF, JPG, PNG. Use the options above to scan or select files.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const actionButtonStyles = StyleSheet.create({
  actionButton: {
    borderRadius: 18,
    padding: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  actionButtonDisabled: { opacity: 0.6 },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtonLeft: { flexDirection: "row", alignItems: "center", gap: 16 },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextContainer: { flex: 1 },
  actionButtonTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  actionButtonDescription: { fontSize: 14 },
});

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 20,
      gap: 12,
    },
    headerTitle: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
    headerSubtitle: { fontSize: 14 },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
    },
    logoutButtonText: { fontSize: 13, fontWeight: "600" },
    actionsContainer: { paddingHorizontal: 20, marginBottom: 24 },
    selectedImagesContainer: { marginBottom: spacing.lg, paddingHorizontal: 20 },
    sectionTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      marginBottom: spacing.md,
    },
    imagesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
    imageContainer: { width: "47%", position: "relative", marginBottom: spacing.sm },
    image: {
      width: "100%",
      height: 150,
      borderRadius: borderRadius.md,
      resizeMode: "cover",
      ...shadows.sm,
    },
    documentPreview: {
      width: "100%",
      height: 150,
      borderRadius: borderRadius.md,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.md,
      borderWidth: 1,
      ...shadows.sm,
    },
    documentName: {
      fontSize: typography.sizes.xs,
      marginTop: spacing.xs,
      textAlign: "center",
    },
    removeButton: {
      position: "absolute",
      top: -8,
      right: -8,
      borderRadius: borderRadius.full,
      ...shadows.sm,
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
      marginHorizontal: 20,
      marginTop: spacing.md,
      ...shadows.sm,
    },
    uploadButtonDisabled: { opacity: 0.6 },
    uploadButtonText: {
      color: colors.background.light,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: { marginTop: spacing.md, fontSize: typography.sizes.md },
    infoBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 18,
      borderRadius: 16,
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: "rgba(30, 58, 138, 0.2)",
    },
    infoText: { flex: 1, fontSize: 14 },
  });
