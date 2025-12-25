import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// Camera permissions handled via ImagePicker
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/constants/theme';
import * as SecureStore from 'expo-secure-store';

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

interface SelectedImage {
  uri: string;
  type: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
}

export default function UploadScreen() {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<Branch[]>([]);

  const [uploadFiles] = useMutation(UPLOAD_MULTIPLE);
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER_DATA, {
    fetchPolicy: 'cache-and-network',
  });

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
            if (branch?.id && branch?.name && !branches.find((b) => b.id === branch.id)) {
              branches.push(branch);
            }
          });
        }
      });
      setAvailableBranches(branches);

      // If only one branch, auto-select it
      if (branches.length === 1) {
        setSelectedBranch(branches[0]);
        SecureStore.setItemAsync('branchId', branches[0].id);
      } else if (branches.length > 1) {
        // If multiple branches, check if we have a saved selection
        SecureStore.getItemAsync('branchId').then((savedBranchId) => {
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
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant camera and media library permissions to capture invoice images.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: 'image/jpeg',
          name: asset.fileName || `image_${Date.now()}.jpg`,
        }));
        setSelectedImages([...selectedImages, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select invoice image');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newImage = {
          uri: asset.uri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        };
        setSelectedImages([...selectedImages, newImage]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture invoice photo');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    SecureStore.setItemAsync('branchId', branch.id);
    setShowBranchModal(false);
  };

  const handleUpload = async () => {
      if (selectedImages.length === 0) {
      Alert.alert('No Invoices', 'Please select at least one invoice image to upload');
      return;
    }

    if (!selectedBranch && availableBranches.length > 1) {
      Alert.alert('Branch Required', 'Please select a branch before uploading');
      setShowBranchModal(true);
      return;
    }

    setUploading(true);
    try {
      // Use selected branch or get from secure store
      const branchId = selectedBranch?.id || (await SecureStore.getItemAsync('branchId')) || 'default';

      // For React Native, we need to create file-like objects from URIs
      // apollo-upload-client handles React Native file URIs
      const files = selectedImages.map((image) => ({
        uri: image.uri,
        type: image.type,
        name: image.name,
      }));

      const result = await uploadFiles({
        variables: {
          files,
          branchId,
        },
      });

      if (result.data?.uploadFile?.success) {
        Alert.alert('Success', 'Invoices uploaded successfully! Data extraction will begin shortly.', [
          {
            text: 'OK',
            onPress: () => {
              setSelectedImages([]);
            },
          },
        ]);
      } else {
        throw new Error(result.data?.uploadFile?.message || 'Upload failed');
      }
    } catch (error: any) {
      Alert.alert('Upload Failed', error.message || 'Failed to upload invoices. Please try again.');
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Ionicons name="document-attach" size={32} color={colors.primary.DEFAULT} />
        </View>
        <Text style={styles.title}>Upload Invoice</Text>
        <Text style={styles.subtitle}>Capture or select invoice images for data extraction and ERP integration</Text>
      </View>

      {/* Branch Selection */}
      {availableBranches.length > 1 && (
        <TouchableOpacity
          style={styles.branchSelector}
          onPress={() => setShowBranchModal(true)}
        >
          <View style={styles.branchSelectorContent}>
            <Ionicons name="business" size={20} color={colors.primary.DEFAULT} />
            <View style={styles.branchSelectorText}>
              <Text style={styles.branchSelectorLabel}>Branch</Text>
              <Text style={styles.branchSelectorValue}>
                {selectedBranch ? selectedBranch.name : 'Select Branch'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>
      )}

      {availableBranches.length === 1 && selectedBranch && (
        <View style={styles.branchInfo}>
          <Ionicons name="business" size={16} color={colors.text.secondary} />
          <Text style={styles.branchInfoText}>{selectedBranch.name}</Text>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.cameraButton]}
          onPress={takePhoto}
          disabled={uploading}
        >
          <Ionicons name="camera" size={32} color={colors.background.light} />
          <Text style={styles.actionButtonText}>Capture Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.galleryButton]}
          onPress={pickImage}
          disabled={uploading}
        >
          <Ionicons name="images" size={32} color={colors.background.light} />
          <Text style={styles.actionButtonText} numberOfLines={1}>Select Invoice</Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View style={styles.selectedImagesContainer}>
          <Text style={styles.sectionTitle}>
            Selected Invoices ({selectedImages.length})
          </Text>
          <View style={styles.imagesGrid}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                  disabled={uploading}
                >
                  <Ionicons name="close-circle" size={24} color={colors.status.rejected} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {selectedImages.length > 0 && (
        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={uploading}
          activeOpacity={0.8}
        >
          {uploading ? (
            <ActivityIndicator color={colors.background.light} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={24} color={colors.background.light} />
              <Text style={styles.uploadButtonText}>Upload {selectedImages.length} Invoice{selectedImages.length > 1 ? 's' : ''} for Processing</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {selectedImages.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="document-attach-outline" size={64} color={colors.text.muted} />
          <Text style={styles.emptyText}>No invoices selected</Text>
          <Text style={styles.emptySubtext}>
            Capture or select invoice images to extract data and sync with your ERP system
          </Text>
        </View>
      )}

      {/* Branch Selection Modal */}
      <Modal
        visible={showBranchModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBranchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Branch for Invoice Processing</Text>
              <TouchableOpacity
                onPress={() => setShowBranchModal(false)}
                style={styles.modalCloseButton}
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
                    selectedBranch?.id === item.id && styles.branchOptionSelected,
                  ]}
                  onPress={() => handleBranchSelect(item)}
                >
                  <Text
                    style={[
                      styles.branchOptionText,
                      selectedBranch?.id === item.id && styles.branchOptionTextSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedBranch?.id === item.id && (
                    <Ionicons name="checkmark" size={20} color={colors.primary.DEFAULT} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
    minHeight: 100,
    maxWidth: '48%',
  },
  cameraButton: {
    backgroundColor: colors.primary.DEFAULT,
  },
  galleryButton: {
    backgroundColor: colors.primary.DEFAULT,
  },
  actionButtonText: {
    color: colors.background.light,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  selectedImagesContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imageContainer: {
    width: '47%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  uploadButton: {
    backgroundColor: colors.primary.DEFAULT, // #2563eb - brand color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
    ...shadows.md,
    marginTop: spacing.md,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: colors.background.light,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.DEFAULT,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.text.secondary,
  },
  branchSelector: {
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    ...shadows.sm,
  },
  branchSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  branchSelectorText: {
    flex: 1,
  },
  branchSelectorLabel: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  branchSelectorValue: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
    fontWeight: typography.weights.medium,
  },
  branchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background.light,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  branchInfoText: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.light,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '70%',
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.DEFAULT,
  },
  modalTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  branchOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  branchOptionSelected: {
    backgroundColor: colors.primary.light + '20',
  },
  branchOptionText: {
    fontSize: typography.sizes.md,
    color: colors.text.primary,
  },
  branchOptionTextSelected: {
    fontWeight: typography.weights.semibold,
    color: colors.primary.DEFAULT,
  },
});

