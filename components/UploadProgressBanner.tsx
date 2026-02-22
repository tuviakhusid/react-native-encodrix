import { Loader2 } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../src/context/theme-context";
import { useUploadProgress } from "../src/context/upload-progress-context";
import { getColors } from "../src/constants/theme";
import type { TaskStatus } from "../src/hooks/useTaskStatusPolling";

function getProgressPercentage(status: TaskStatus | undefined): number {
  if (!status?.progress) return 0;
  const { current, total } = status.progress;
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

export function UploadProgressBanner() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const { visibleTasks, taskStatuses } = useUploadProgress();

  const { averagePercent, hasProgress } = useMemo(() => {
    if (visibleTasks.length === 0) return { averagePercent: 0, hasProgress: false };
    const withProgress = visibleTasks
      .map((id) => taskStatuses.get(id))
      .filter((s): s is TaskStatus => Boolean(s?.progress));
    if (withProgress.length === 0) return { averagePercent: 0, hasProgress: false };
    const sum = withProgress.reduce((acc, s) => acc + getProgressPercentage(s), 0);
    return { averagePercent: Math.round(sum / withProgress.length), hasProgress: true };
  }, [visibleTasks, taskStatuses]);

  if (visibleTasks.length === 0) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: colors.stats.blue.bg,
          borderColor: colors.stats.blue.text,
        },
      ]}
    >
      <View style={styles.row}>
        <Loader2 size={18} color={colors.stats.blue.text} strokeWidth={2.5} />
        <Text
          style={[styles.text, { color: colors.stats.blue.text }]}
          numberOfLines={1}
        >
          {visibleTasks.length} document{visibleTasks.length !== 1 ? "s" : ""} in progress
          {hasProgress ? ` • ${averagePercent}%` : ""}
        </Text>
      </View>
      {hasProgress && (
        <View style={[styles.track, { backgroundColor: colors.background.gray }]}>
          <View
            style={[
              styles.fill,
              {
                backgroundColor: colors.stats.blue.text,
                width: `${Math.min(100, Math.max(0, averagePercent))}%`,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  track: {
    height: 6,
    borderRadius: 3,
    marginTop: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});
