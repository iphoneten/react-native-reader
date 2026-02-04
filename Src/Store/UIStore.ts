import { create } from "zustand";

interface IUIState {
  loadingCount: number;
  showLoading: boolean;
  startLoading(): void;
  endLoading(): void;
}

const useUIStore = create<IUIState>()(
  (set) => ({
    loadingCount: 0,
    showLoading: false,
    startLoading: () => set((state) => ({ loadingCount: state.loadingCount + 1, showLoading: true })),
    endLoading: () => set((state) => {
      const newCount = Math.max(state.loadingCount - 1, 0);
      return { loadingCount: newCount, showLoading: newCount > 0 };
    }),
  })
)

export const startLoading = () => {
  return useUIStore.getState().startLoading();
}

export const endLoading = () => {
  return useUIStore.getState().endLoading();
}

export default useUIStore
