import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// Camera permissions handled via ImagePicker
import { gql, useMutation, useQuery } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  Upload,
  FileText,
  Zap,
  Shield,
} from "lucide-react-native";
import {
  borderRadius,
  getColors,
  shadows,
  spacing,
  typography,
} from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import * as Haptics from "expo-haptics";

const UPLOAD_MULTIPLE = gql`
  mutation UploadMultiple($files: [Upload!]!, $branchId: String!) {
    uploadFile(input: { files: $files, branchId: $branchId }) {
      success
      message
      branchId
      folderId
    }
  }
`;

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
      organization_number: organizationNumber
      organization_code: organizationCode
      is_onboarding_complete: isOnboardingComplete
      is_onboarding_email_sent: isOnboardingEmailSent
      folders {
        id
        name
        isActive
      }
      roleBranchAssignments {
        roleId
        roleName
        permissions
        branchInfo {
          id
          name
        }
        assignAll
      }
      licenses
    }
  }
`;

interface SelectedFile {
  uri: string;
  type: string;
  name: string;
  isImage?: boolean;
}

interface Branch {
  id: string;
  name: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bgColor,
  textColor,
  secondaryTextColor,
  iconBgColor,
  borderColor,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  secondaryTextColor: string;
  iconBgColor: string;
  borderColor: string;
}) {
  return (
    <View style={[featureCardStyles.featureCard, { backgroundColor: bgColor, borderColor }]}>
      <View
        style={[
          featureCardStyles.featureIcon,
          { backgroundColor: iconBgColor },
        ]}>
        <Icon size={24} color={color} />
      </View>
      <View style={featureCardStyles.featureContent}>
        <Text style={[featureCardStyles.featureTitle, { color: textColor }]}>{title}</Text>
        <Text style={[featureCardStyles.featureDescription, { color: secondaryTextColor }]}>
          {description}
        </Text>
      </View>
    </View>
  );
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
      style={[actionButtonStyles.actionButton, { backgroundColor: bgColor }, disabled && actionButtonStyles.actionButtonDisabled]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}>
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
              ]}>
              {description}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function UploadScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [selectedImages, setSelectedImages] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);

  const [uploadFiles] = useMutation(UPLOAD_MULTIPLE);
  const { data: userData, loading: userLoading } = useQuery(
    GET_CURRENT_USER_DATA,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  // Extract branches from user data
  useEffect(() => {
    if (userData?.getMyProfile?.roleBranchAssignments) {
      const branches: Branch[] = [];
      userData.getMyProfile.roleBranchAssignments.forEach((assignment: any) => {
        if (assignment.branchInfo) {
          // Handle both array and single object cases
          const branchArray = Array.isArray(assignment.branchInfo)
            ? assignment.branchInfo
            : [assignment.branchInfo];

          branchArray.forEach((branch: Branch) => {
            // Avoid duplicates and ensure branch has id and name
            if (
              branch?.id &&
              branch?.name &&
              !branches.find((b) => b.id === branch.id)
            ) {
              branches.push(branch);
            }
          });
        }
      });
      setAvailableBranches(branches);

      // If only one branch, auto-select it
      if (branches.length === 1) {
        setSelectedBranch(branches[0]);
        SecureStore.setItemAsync("branchId", branches[0].id);
      } else if (branches.length > 1) {
        // If multiple branches, check if we have a saved selection
        SecureStore.getItemAsync("branchId").then((savedBranchId) => {
          if (savedBranchId) {
            const savedBranch = branches.find((b) => b.id === savedBranchId);
            if (savedBranch) {
              setSelectedBranch(savedBranch);
            } else {
              // Show modal to select branch
              setShowBranchModal(true);
            }
          } else {
            // Show modal to select branch
            setShowBranchModal(true);
          }
        });
      }
    }
  }, [userData]);

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
        // @ts-ignore - MediaTypeOptions is deprecated but still works
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => {
          // Determine MIME type from asset
          let mimeType = "image/jpeg"; // default
          let extension = "jpg";

          if (asset.mimeType) {
            mimeType = asset.mimeType;
          } else {
            // Infer from file name extension
            const fileName = asset.fileName || asset.uri.split("/").pop() || "";
            extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
            const mimeMap: Record<string, string> = {
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              png: "image/png",
            };
            mimeType = mimeMap[extension] || "image/jpeg";
          }

          return {
            uri: asset.uri,
            type: mimeType,
            name: asset.fileName || `image_${Date.now()}.${extension}`,
            isImage: true,
          };
        });
        setSelectedImages([...selectedImages, ...newImages]);
      }
    } catch (error) {
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
          // Determine MIME type from asset
          let mimeType = asset.mimeType || "application/octet-stream";
          const fileName = asset.name || asset.uri.split("/").pop() || "";
          const extension = fileName.split(".").pop()?.toLowerCase() || "";

          // MIME type mapping for common document types
          const mimeMap: Record<string, string> = {
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            bmp: "image/bmp",
            webp: "image/webp",
          };

          if (!mimeType || mimeType === "application/octet-stream") {
            mimeType = mimeMap[extension] || "application/octet-stream";
          }

          const isImage = mimeType.startsWith("image/");

          return {
            uri: asset.uri,
            type: mimeType,
            name: asset.name || `document_${Date.now()}.${extension}`,
            isImage,
          };
        });
        setSelectedImages([...selectedImages, ...newFiles]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select document");
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        // @ts-ignore - MediaTypeOptions is deprecated but still works
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        // Determine MIME type from asset
        let mimeType = "image/jpeg"; // default
        if (asset.mimeType) {
          mimeType = asset.mimeType;
        }

        const newImage = {
          uri: asset.uri,
          type: mimeType,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          isImage: true,
        };
        setSelectedImages([...selectedImages, newImage]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture invoice photo");
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: SelectedFile) => {
    const mimeType = file.type?.toLowerCase() || "";
    if (file.isImage || mimeType.startsWith("image/")) {
      return "image";
    }
    if (mimeType.includes("pdf")) {
      return "document-text";
    }
    if (
      mimeType.includes("word") ||
      mimeType.includes("msword") ||
      mimeType.includes("wordprocessingml")
    ) {
      return "document";
    }
    return "document-text";
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    SecureStore.setItemAsync("branchId", branch.id);
    setShowBranchModal(false);
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      Alert.alert(
        "No Invoices",
        "Please select at least one invoice file to upload"
      );
      return;
    }

    if (!selectedBranch && availableBranches.length > 1) {
      Alert.alert("Branch Required", "Please select a branch before uploading");
      setShowBranchModal(true);
      return;
    }

    setUploading(true);
    try {
      // Use selected branch or get from secure store
      const branchId =
        selectedBranch?.id ||
        (await SecureStore.getItemAsync("branchId")) ||
        "default";

      // For React Native with apollo-upload-client, we need to use ReactNativeFile
      // This properly formats files for the backend which expects content_type attribute
      const files = selectedImages.map((file) => {
        // Ensure we have a proper MIME type
        let mimeType = file.type || "application/octet-stream";

        // If type is not set or invalid, try to infer from file name
        if (
          !mimeType ||
          mimeType === "image" ||
          mimeType === "application/octet-stream"
        ) {
          const extension = file.name.split(".").pop()?.toLowerCase();
          const mimeMap: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            bmp: "image/bmp",
            webp: "image/webp",
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          };
          mimeType =
            mimeMap[extension || ""] || file.type || "application/octet-stream";
        }

        // Use ReactNativeFile to properly format files for apollo-upload-client
        // This ensures the backend receives file objects with content_type attribute
        const fileObject = new ReactNativeFile({
          uri: file.uri,
          type: mimeType,
          name: file.name,
        });

        // Log for debugging (remove in production)
        console.log("Preparing file for upload:", {
          uri: fileObject.uri.substring(0, 50) + "...",
          type: fileObject.type,
          name: fileObject.name,
        });

        return fileObject;
      });

      const result = await uploadFiles({
        variables: {
          files,
          branchId,
        },
      });

      if (result.data?.uploadFile?.success) {
        Alert.alert(
          "Success",
          "Invoices uploaded successfully! Data extraction will begin shortly.",
          [
            {
              text: "OK",
              onPress: () => {
                setSelectedImages([]);
              },
            },
          ]
        );
      } else {
        throw new Error(result.data?.uploadFile?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error.message || "Failed to upload invoices. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  if (userLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={styles.loadingText}>Loading branch information...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Scan Invoice
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: colors.text.secondary },
            ]}>
            Choose how you'd like to add your invoice
          </Text>
        </View>

        {/* Branch Selection */}
        {availableBranches.length > 1 && (
          <View style={styles.branchContainer}>
            <TouchableOpacity
              style={styles.branchSelector}
              onPress={() => setShowBranchModal(true)}
            >
              <View style={styles.branchSelectorContent}>
                <Ionicons
                  name="business"
                  size={20}
                  color={colors.primary.DEFAULT}
                />
                <View style={styles.branchSelectorText}>
                  <Text style={styles.branchSelectorLabel}>Branch</Text>
                  <Text style={styles.branchSelectorValue}>
                    {selectedBranch ? selectedBranch.name : "Select Branch"}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.text.secondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {availableBranches.length === 1 && selectedBranch && (
          <View style={styles.branchInfo}>
            <Ionicons name="business" size={16} color={colors.text.secondary} />
            <Text style={styles.branchInfoText}>{selectedBranch.name}</Text>
          </View>
        )}

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
          <View style={styles.selectedImagesContainer}>
            <Text style={styles.sectionTitle}>
              Selected Invoices ({selectedImages.length})
            </Text>
            <View style={styles.imagesGrid}>
              {selectedImages.map((file, index) => (
                <View key={index} style={styles.imageContainer}>
                  {file.isImage ? (
                    <Image source={{ uri: file.uri }} style={styles.image} />
                  ) : (
                    <View style={styles.documentPreview}>
                      <Ionicons
                        name={getFileIcon(file)}
                        size={48}
                        color={colors.primary.DEFAULT}
                      />
                      <Text style={styles.documentName} numberOfLines={2}>
                        {file.name}
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                    disabled={uploading}
                  >
                    <Ionicons
                      name="close-circle"
                      size={24}
                      color={colors.status.rejected}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {selectedImages.length > 0 && (
          <TouchableOpacity
            onPress={handleUpload}
            disabled={uploading}
            activeOpacity={0.8}
            style={[
              styles.uploadButton,
              uploading && styles.uploadButtonDisabled,
            ]}
          >
            {uploading ? (
              <ActivityIndicator color={colors.background.light} />
            ) : (
              <>
                <Ionicons
                  name="cloud-upload"
                  size={20}
                  color={colors.background.light}
                />
                <Text style={styles.uploadButtonText}>
                  Upload {selectedImages.length} Invoice
                  {selectedImages.length > 1 ? "s" : ""} for Processing
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {selectedImages.length === 0 && (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                How it works
              </Text>
              <View style={styles.featuresContainer}>
                <FeatureCard
                  icon={Camera}
                  title="Capture Invoice"
                  description="Scan or upload your invoice document"
                  color={colors.primary.DEFAULT}
                  bgColor={colors.background.card}
                  textColor={colors.text.primary}
                  secondaryTextColor={colors.text.secondary}
                  iconBgColor={colors.stats.blue.bg}
                  borderColor={colors.border.DEFAULT}
                />
                <FeatureCard
                  icon={Zap}
                  title="Auto Extract Data"
                  description="AI extracts all key information instantly"
                  color={colors.stats.yellow.text}
                  bgColor={colors.background.card}
                  textColor={colors.text.primary}
                  secondaryTextColor={colors.text.secondary}
                  iconBgColor={colors.stats.yellow.bg}
                  borderColor={colors.border.DEFAULT}
                />
                <FeatureCard
                  icon={Shield}
                  title="Secure Storage"
                  description="Your data is encrypted and protected"
                  color={colors.stats.green.text}
                  bgColor={colors.background.card}
                  textColor={colors.text.primary}
                  secondaryTextColor={colors.text.secondary}
                  iconBgColor={colors.stats.green.bg}
                  borderColor={colors.border.DEFAULT}
                />
              </View>
            </View>

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.stats.blue.bg,
                },
              ]}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.background.card },
                ]}>
                <FileText size={20} color={colors.primary.DEFAULT} />
              </View>
              <View style={styles.infoContent}>
                <Text
                  style={[
                    styles.infoTitle,
                    {
                      color: colors.stats.blue.text,
                    },
                  ]}>
                  Supported Formats
                </Text>
                <Text
                  style={[
                    styles.infoText,
                    {
                      color: colors.stats.blue.text,
                    },
                  ]}>
                  PDF, JPG, PNG files up to 10MB
                </Text>
              </View>
            </View>

            <View style={styles.tipsSection}>
              <Text style={[styles.tipsTitle, { color: colors.text.primary }]}>
                Tips for best results:
              </Text>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <View
                    style={[
                      styles.tipBullet,
                      { backgroundColor: colors.primary.DEFAULT },
                    ]}
                  />
                  <Text
                    style={[styles.tipText, { color: colors.text.secondary }]}>
                    Ensure good lighting when taking photos
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View
                    style={[
                      styles.tipBullet,
                      { backgroundColor: colors.primary.DEFAULT },
                    ]}
                  />
                  <Text
                    style={[styles.tipText, { color: colors.text.secondary }]}>
                    Keep the invoice flat and in focus
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View
                    style={[
                      styles.tipBullet,
                      { backgroundColor: colors.primary.DEFAULT },
                    ]}
                  />
                  <Text
                    style={[styles.tipText, { color: colors.text.secondary }]}>
                    Capture all corners of the document
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <View
                    style={[
                      styles.tipBullet,
                      { backgroundColor: colors.primary.DEFAULT },
                    ]}
                  />
                  <Text
                    style={[styles.tipText, { color: colors.text.secondary }]}>
                    Avoid shadows and glare on the paper
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Branch Selection Modal */}
      <Modal
        visible={showBranchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBranchModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBranchModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Branch for Invoice Processing
              </Text>
              <TouchableOpacity
                onPress={() => setShowBranchModal(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableBranches}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.branchOption,
                    selectedBranch?.id === item.id &&
                      styles.branchOptionSelected,
                  ]}
                  onPress={() => handleBranchSelect(item)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.branchOptionText,
                      selectedBranch?.id === item.id &&
                        styles.branchOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedBranch?.id === item.id && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary.DEFAULT}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const featureCardStyles = StyleSheet.create({
  featureCard: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  featureContent: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
  },
});

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
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  actionButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 14,
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
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 24,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 15,
    },
    branchContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    actionsContainer: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    selectedImagesContainer: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    imagesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    imageContainer: {
      width: "47%",
      position: "relative",
      marginBottom: spacing.sm,
    },
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
      backgroundColor: colors.background.light,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.light,
      ...shadows.sm,
    },
    documentName: {
      fontSize: typography.sizes.xs,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.primary,
      marginTop: spacing.xs,
      textAlign: "center",
    },
    removeButton: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: colors.background.light,
      borderRadius: borderRadius.full,
      ...shadows.sm,
    },
    uploadButton: {
      backgroundColor: colors.primary.DEFAULT,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      gap: spacing.sm,
      ...shadows.sm,
      marginTop: spacing.md,
    },
    uploadButtonDisabled: {
      opacity: 0.6,
    },
    uploadButtonText: {
      color: colors.background.light,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
    },
    emptyState: {
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
      textAlign: "center",
      paddingHorizontal: spacing.lg,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background.DEFAULT,
    },
    loadingText: {
      marginTop: spacing.md,
      fontSize: typography.sizes.md,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
    },
    branchSelector: {
      backgroundColor: colors.background.card,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.DEFAULT,
      ...shadows.sm,
    },
    branchSelectorContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    branchSelectorText: {
      flex: 1,
    },
    branchSelectorLabel: {
      fontSize: typography.sizes.xs,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
      marginBottom: spacing.xs,
    },
    branchSelectorValue: {
      fontSize: typography.sizes.md,
      fontFamily: typography.fontFamily.medium,
      color: colors.text.primary,
      fontWeight: typography.weights.medium,
    },
    branchInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.background.light,
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      marginBottom: spacing.lg,
    },
    branchInfoText: {
      fontSize: typography.sizes.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.secondary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: colors.background.light,
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      maxHeight: "70%",
      paddingBottom: spacing.xl,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.DEFAULT,
    },
    modalTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: typography.weights.bold,
      fontFamily: typography.fontFamily.bold,
      color: colors.text.primary,
    },
    modalCloseButton: {
      padding: spacing.xs,
    },
    branchOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    branchOptionSelected: {
      backgroundColor: colors.primary.light + "20",
    },
    branchOptionText: {
      fontSize: typography.sizes.md,
      fontFamily: typography.fontFamily.regular,
      color: colors.text.primary,
    },
    branchOptionTextSelected: {
      fontWeight: typography.weights.semibold,
      fontFamily: typography.fontFamily.semibold,
      color: colors.primary.DEFAULT,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
    },
    featuresContainer: {
      gap: 12,
    },
    infoBox: {
      flexDirection: "row",
      padding: 18,
      borderRadius: 16,
      marginHorizontal: 20,
      marginBottom: 24,
      gap: 14,
      borderWidth: 1,
      borderColor: "rgba(30, 58, 138, 0.2)",
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    infoContent: {
      flex: 1,
      justifyContent: "center",
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 2,
    },
    infoText: {
      fontSize: 13,
    },
    tipsSection: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    tipsTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 12,
    },
    tipsList: {
      gap: 10,
    },
    tipItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },
    tipBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 6,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
    },
  });

const styles = getStyles(getColors("light")); // Default, will be overridden
