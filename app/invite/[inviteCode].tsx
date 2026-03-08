import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors, typography } from "../../src/constants/theme";
import { useTheme } from "../../src/context/theme-context";
import guestInviteService from "../../src/lib/services/guest-invite.service";

type InviteParams = {
  inviteCode?: string;
};

export default function InviteScreen() {
  const router = useRouter();
  const { inviteCode } = useLocalSearchParams<InviteParams>();
  const { theme } = useTheme();
  const colors = getColors(theme);

  useEffect(() => {
    if (!inviteCode) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    (async () => {
      await guestInviteService.setInviteCode(inviteCode);
      if (!cancelled) {
        router.replace("/guest-upload");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inviteCode, router]);

  if (!inviteCode) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background.DEFAULT }]}
    >
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text style={[styles.helper, { color: colors.text.muted, marginTop: 16 }]}>
          Opening guest upload…
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    marginBottom: 24,
    textAlign: "center",
  },
  codeBadge: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.medium,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 20,
    fontFamily: typography.fontFamily.semibold,
  },
  helper: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    textAlign: "center",
    marginTop: 12,
  },
});

