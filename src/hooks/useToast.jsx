'use client';

import { useCallback, useRef } from "react";
import { Toast } from "primereact/toast";

const toastOptions = {
    success: { severity: 'success', summary: 'Success', detail: 'Message Content', life: 3000 },
    info: { severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 },
    warn: { severity: 'warn', summary: 'Warning', detail: 'Message Content', life: 3000 },
    error: { severity: 'error', summary: 'Error', detail: 'Message Content', life: 3000 },
    secondary: { severity: 'secondary', summary: 'Secondary', detail: 'Message Content', life: 3000 },
    contrast: { severity: 'contrast', summary: 'Contrast', detail: 'Message Content', life: 3000 },
};

export function useToast() {
    const toastRef = useRef();


    const showToast = useCallback((type, message, options) => {
        if (toastRef.current && toastOptions[type]) {
            toastRef.current.show({ ...toastOptions[type], detail: message, ...options });
        }
    }, []);

    return { ToastComponent: <Toast ref={toastRef} />, showToast };
}