import React, { createContext, useCallback, useRef, useContext } from "react";
import { useTaskStatusPolling, TaskStatus } from "../hooks/useTaskStatusPolling";

type RefetchFn = () => void | Promise<unknown>;

interface UploadProgressContextType {
  addTasks: (taskIds: string[]) => void;
  closeTask: (taskId: string) => void;
  removeTask: (taskId: string) => void;
  visibleTasks: string[];
  taskStatuses: Map<string, TaskStatus>;
  isPolling: boolean;
  registerRefetch: (fn: RefetchFn | undefined) => void;
}

const UploadProgressContext = createContext<UploadProgressContextType | undefined>(undefined);

export function useUploadProgress() {
  const ctx = useContext(UploadProgressContext);
  if (ctx === undefined) {
    throw new Error("useUploadProgress must be used within UploadProgressProvider");
  }
  return ctx;
}

export function UploadProgressProvider({ children }: { children: React.ReactNode }) {
  const refetchRef = useRef<RefetchFn | undefined>(undefined);

  const onAllComplete = useCallback(() => {
    refetchRef.current?.();
  }, []);

  const registerRefetch = useCallback((fn: RefetchFn | undefined) => {
    refetchRef.current = fn;
  }, []);

  const {
    addTasks,
    closeTask,
    removeTask,
    visibleTasks,
    taskStatuses,
    isPolling,
  } = useTaskStatusPolling(onAllComplete);

  const value: UploadProgressContextType = {
    addTasks,
    closeTask,
    removeTask,
    visibleTasks,
    taskStatuses,
    isPolling,
    registerRefetch,
  };

  return (
    <UploadProgressContext.Provider value={value}>
      {children}
    </UploadProgressContext.Provider>
  );
}
