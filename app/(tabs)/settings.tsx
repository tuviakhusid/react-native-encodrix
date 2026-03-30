"use client";

import { useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import {
  GetCurrentUserDataDocument,
  UpdateUserProfileDocument,
} from "../../src/graphql/schema";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const styles = getStyles(colors);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const { data, loading, refetch } = useQuery(GetCurrentUserDataDocument, {
    fetchPolicy: "cache-and-network",
  });

  const [updateProfile] = useMutation(UpdateUserProfileDocument);

  useEffect(() => {
    if (data?.getMyProfile) {
      const profile = data.getMyProfile;
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setProfileImage(profile.profile_image || null);
    }
  }, [data]);

  const requestPermissions = async () => {
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (mediaStatus !== "granted" || cameraStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "Please grant camera and media library permissions to update your profile picture."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image");
    }
  };

  const takePhoto = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture photo");
    }
  };

  const uploadProfileImage = async (uri: string) => {
    setIsUploadingImage(true);
    try {
      // TODO: Implement profile image upload to backend
      Alert.alert(
        "Feature in Development",
        "Profile image upload will be available soon. Please use the web platform to update your profile picture."
      );
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to upload profile picture");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        variables: {
          input: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          },
        },
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
      await refetch();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (data?.getMyProfile) {
      const profile = data.getMyProfile;
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setProfileImage(profile.profile_image || null);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  const user = data?.getMyProfile;
  const displayName = user?.first_name || user?.email?.split("@")[0] || "User";
  const initials = `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`.toUpperCase() || displayName.charAt(0).toUpperCase();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Settings
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.text.secondary }]}
          >
            Manage your profile and preferences
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Profile Picture
          </Text>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profileImageWrapper}>
              {isUploadingImage ? (
                <View style={styles.profileImagePlaceholder}>
                  <ActivityIndicator
                    size="large"
                    color={colors.primary.DEFAULT}
                  />
                </View>
              ) : profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImagePlaceholder,
                    { backgroundColor: colors.primary.DEFAULT },
                  ]}
                >
                  <Text style={styles.profileInitials}>{initials}</Text>
                </View>
              )}
              {isEditing && (
                <TouchableOpacity
                  style={[
                    styles.editImageButton,
                    { backgroundColor: colors.primary.DEFAULT },
                  ]}
                  onPress={() => {
                    Alert.alert(
                      "Change Profile Picture",
                      "Choose an option",
                      [
                        {
                          text: "Take Photo",
                          onPress: takePhoto,
                        },
                        {
                          text: "Choose from Gallery",
                          onPress: pickImage,
                        },
                        {
                          text: "Cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  }}
                  disabled={isUploadingImage}
                >
                  <Ionicons name="camera" size={20} color="#ffffff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Basic Information
          </Text>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.DEFAULT,
                  color: colors.text.primary,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={colors.text.muted}
              editable={isEditing}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.DEFAULT,
                  color: colors.text.primary,
                },
                !isEditing && styles.inputDisabled,
              ]}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={colors.text.muted}
              editable={isEditing}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.gray,
                  borderColor: colors.border.light,
                  color: colors.text.secondary,
                },
                styles.inputDisabled,
              ]}
              value={user?.email || ""}
              placeholder="Email"
              placeholderTextColor={colors.text.muted}
              editable={false}
            />
            <Text style={[styles.helperText, { color: colors.text.muted }]}>
              Email cannot be changed
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>
              Organization
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background.gray,
                  borderColor: colors.border.light,
                  color: colors.text.secondary,
                },
                styles.inputDisabled,
              ]}
              value={user?.organization_name || ""}
              placeholder="Organization"
              placeholderTextColor={colors.text.muted}
              editable={false}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          {!isEditing ? (
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.primary.DEFAULT },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsEditing(true);
              }}
            >
              <Ionicons name="pencil" size={18} color="#ffffff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.saveCancelButtons}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: colors.border.DEFAULT,
                  },
                ]}
                onPress={handleCancel}
                disabled={isSaving}
              >
                <Text
                  style={[styles.cancelButtonText, { color: colors.text.primary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { backgroundColor: colors.primary.DEFAULT },
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={18} color="#ffffff" />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background.DEFAULT,
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
    section: {
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
    },
    profilePictureContainer: {
      alignItems: "center",
      marginBottom: 8,
    },
    profileImageWrapper: {
      position: "relative",
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colors.border.light,
    },
    profileImagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 4,
      borderColor: colors.border.light,
    },
    profileInitials: {
      fontSize: 36,
      fontWeight: "700",
      color: "#ffffff",
    },
    editImageButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: colors.background.light,
      ...shadows.md,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    required: {
      color: colors.status.rejected,
    },
    input: {
      height: 50,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    inputDisabled: {
      opacity: 0.6,
    },
    helperText: {
      fontSize: 12,
      marginTop: 4,
    },
    actionButtons: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    editButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: borderRadius.md,
      gap: 8,
      ...shadows.sm,
    },
    editButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
    saveCancelButtons: {
      flexDirection: "row",
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    saveButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: borderRadius.md,
      gap: 8,
      ...shadows.sm,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

