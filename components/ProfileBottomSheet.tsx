import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../src/context/theme-context';
import { getColors } from '../src/constants/theme';
import { Settings, LogOut, User } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.4;

interface ProfileBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  userProfileImage?: string;
}

export default function ProfileBottomSheet({
  visible,
  onClose,
  onSettings,
  onLogout,
  userName = 'User',
  userEmail = '',
  userProfileImage,
}: ProfileBottomSheetProps) {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_MAX_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: BOTTOM_SHEET_MAX_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11,
          }).start();
        }
      },
    })
  ).current;

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: BOTTOM_SHEET_MAX_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleClose();
    setTimeout(() => onSettings?.(), 250);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleClose();
    setTimeout(() => onLogout?.(), 250);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}>
      <TouchableOpacity
        style={styles.overlay}
        onPress={handleClose}
        activeOpacity={1}>
        <Animated.View
          style={[
            styles.overlayAnimated,
            {
              opacity,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          ]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.DEFAULT,
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.dragHandleContainer}>
            <View
              style={[
                styles.dragHandle,
                { backgroundColor: colors.text.secondary },
              ]}
            />
          </View>

          <View style={styles.header}>
            {userProfileImage ? (
              <Image
                source={{ uri: userProfileImage }}
                style={styles.profileAvatarImage}
              />
            ) : (
              <View
                style={[
                  styles.profileAvatarLarge,
                  { backgroundColor: colors.primary.DEFAULT },
                ]}>
                <Text style={styles.avatarInitials}>
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text.primary }]}>
                {userName}
              </Text>
              <Text
                style={[styles.userEmail, { color: colors.text.secondary }]}>
                {userEmail}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.DEFAULT }]} />

          <TouchableOpacity
            style={[
              styles.menuItem,
              { borderBottomColor: colors.border.DEFAULT },
            ]}
            onPress={handleSettings}
            activeOpacity={0.7}>
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: colors.primary.bg },
              ]}>
              <Settings
                size={20}
                color={colors.primary.DEFAULT}
                strokeWidth={2.5}
              />
            </View>
            <Text style={[styles.menuItemText, { color: colors.text.primary }]}>
              Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}>
            <View
              style={[
                styles.menuIconContainer,
                { backgroundColor: colors.status.rejectedBg },
              ]}>
              <LogOut size={20} color={colors.status.rejected} strokeWidth={2.5} />
            </View>
            <Text style={[styles.menuItemText, { color: colors.status.rejected }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlayAnimated: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  profileAvatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatarImage: {
    width: 64,
    height: 64,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
});

