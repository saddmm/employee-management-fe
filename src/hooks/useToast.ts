import { useToast as useToastHook } from '../context/ToastContext';

export function useToast() {
  return useToastHook();
}
