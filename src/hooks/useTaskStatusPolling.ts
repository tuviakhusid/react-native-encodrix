import { gql, useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GET_UPLOADED_INVOICE_STATUS = gql`
  query GetUploadedInvoiceStatus($taskIds: [String!]!) {
    multipleTasksStatus(taskIds: $taskIds) {
      taskId
      status
      progress {
        current
        total
        stage
      }
      result
      error
    }
  }
`;

const STORAGE_KEY = "encodrix_active_tasks";
const STORAGE_KEY_CLOSED = "encodrix_active_tasks_closed";
const POLL_INTERVAL_MS = 3000;
const COMPLETED_REMOVE_DELAY_MS = 5000;

export interface TaskStatus {
  taskId: string;
  status: string;
  progress?: { current: number; total: number; stage: string } | null;
  result?: string | null;
  error?: string | null;
}

const TERMINAL_STATUSES = ["completed", "success", "failed", "error"];

function isTerminal(status: string): boolean {
  return TERMINAL_STATUSES.includes(status.toLowerCase());
}

export function useTaskStatusPolling(onAllTasksComplete?: () => void) {
  const [activeTasks, setActiveTasks] = useState<string[]>([]);
  const [taskStatuses, setTaskStatuses] = useState<Map<string, TaskStatus>>(new Map());
  const [isPolling, setIsPolling] = useState(false);
  const [closedTasks, setClosedTasks] = useState<Set<string>>(new Set());
  const hadActiveTasksRef = useRef(false);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [getTaskStatus] = useLazyQuery(GET_UPLOADED_INVOICE_STATUS, {
    fetchPolicy: "network-only",
  });

  const persistTasks = useCallback(async (tasks: string[]) => {
    try {
      if (tasks.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const persistClosedTasks = useCallback(async (closed: Set<string>) => {
    try {
      const arr = Array.from(closed);
      if (arr.length > 0) {
        await AsyncStorage.setItem(STORAGE_KEY_CLOSED, JSON.stringify(arr));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY_CLOSED);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const pollTaskStatus = useCallback(
    async (taskIds: string[]) => {
      if (taskIds.length === 0) {
        setIsPolling(false);
        return;
      }
      try {
        const { data } = await getTaskStatus({
          variables: { taskIds },
        });
        if (data?.multipleTasksStatus) {
          const newStatuses = new Map<string, TaskStatus>();
          const completedTasks: string[] = [];
          const stillActive: string[] = [];

          data.multipleTasksStatus.forEach((task: TaskStatus) => {
            newStatuses.set(task.taskId, {
              taskId: task.taskId,
              status: task.status,
              progress: task.progress ?? null,
              result: task.result ?? null,
              error: task.error ?? null,
            });
            if (isTerminal(task.status)) {
              completedTasks.push(task.taskId);
            } else {
              stillActive.push(task.taskId);
            }
          });

          setTaskStatuses((prev) => {
            const next = new Map(prev);
            newStatuses.forEach((s, id) => next.set(id, s));
            return next;
          });

          if (completedTasks.length > 0) {
            setTimeout(() => {
              setActiveTasks((prev) => {
                const filtered = prev.filter((id) => !completedTasks.includes(id));
                persistTasks(filtered);
                if (filtered.length === 0 && hadActiveTasksRef.current) {
                  onAllTasksComplete?.();
                }
                return filtered;
              });
            }, COMPLETED_REMOVE_DELAY_MS);
          }

          if (stillActive.length === 0) {
            setIsPolling(false);
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            if (hadActiveTasksRef.current) {
              onAllTasksComplete?.();
            }
          }
        }
      } catch (e) {
        // ignore
      }
    },
    [getTaskStatus, persistTasks, onAllTasksComplete]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [stored, storedClosed] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(STORAGE_KEY_CLOSED),
        ]);
        if (!mounted) return;
        if (stored) {
          const tasks = JSON.parse(stored) as string[];
          if (tasks.length > 0) {
            setActiveTasks(tasks);
            setIsPolling(true);
          }
        }
        if (storedClosed) {
          const closed = JSON.parse(storedClosed) as string[];
          setClosedTasks(new Set(closed));
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (activeTasks.length > 0) hadActiveTasksRef.current = true;
  }, [activeTasks.length]);

  useEffect(() => {
    if (!isPolling || activeTasks.length === 0) return;

    const activeIds = activeTasks.filter((id) => !closedTasks.has(id));
    if (activeIds.length === 0) {
      setIsPolling(false);
      return;
    }

    pollTaskStatus(activeIds);

    pollIntervalRef.current = setInterval(() => {
      const current = activeTasks.filter((id) => !closedTasks.has(id));
      if (current.length > 0) {
        pollTaskStatus(current);
      } else {
        setIsPolling(false);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [isPolling, activeTasks, closedTasks, pollTaskStatus]);

  const addTasks = useCallback(
    (taskIds: string[]) => {
      setActiveTasks((prev) => {
        const next = Array.from(new Set([...prev, ...taskIds]));
        persistTasks(next);
        return next;
      });
      setIsPolling(true);
    },
    [persistTasks]
  );

  const closeTask = useCallback(
    (taskId: string) => {
      setClosedTasks((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        persistClosedTasks(next);
        return next;
      });
    },
    [persistClosedTasks]
  );

  const removeTask = useCallback(
    (taskId: string) => {
      setActiveTasks((prev) => {
        const next = prev.filter((id) => id !== taskId);
        persistTasks(next);
        return next;
      });
      setTaskStatuses((prev) => {
        const next = new Map(prev);
        next.delete(taskId);
        return next;
      });
      setClosedTasks((prev) => {
        const next = new Set(prev);
        next.delete(taskId);
        persistClosedTasks(next);
        return next;
      });
    },
    [persistTasks, persistClosedTasks]
  );

  const visibleTasks = activeTasks.filter((id) => !closedTasks.has(id));

  return {
    activeTasks,
    visibleTasks,
    taskStatuses,
    isPolling,
    addTasks,
    closeTask,
    removeTask,
  };
}
