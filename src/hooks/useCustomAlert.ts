import { useCallback, useState } from "react";
import { AlertButton, AlertType } from "../../components/CustomAlert";

interface AlertState {
  visible: boolean;
  title: string;
  message?: string;
  type?: AlertType;
  buttons?: AlertButton[];
}

export function useCustomAlert() {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: "",
  });

  const showAlert = useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      type?: AlertType
    ) => {
      setAlertState({
        visible: true,
        title,
        message,
        buttons: buttons || [{ text: "OK" }],
        type: type || "info",
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Convenience methods
  const showSuccess = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert(title, message, buttons, "success");
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert(title, message, buttons, "error");
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert(title, message, buttons, "warning");
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message?: string, buttons?: AlertButton[]) => {
      showAlert(title, message, buttons, "info");
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}


