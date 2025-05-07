import { create } from 'zustand';
import { toast } from 'react-toastify';

const useUiStore = create((set, get) => ({
  // Loading states
  loadingStates: {}, // { key: boolean } - e.g., { 'login': true }

  // Modal states
  modalStates: {}, // { key: boolean } - e.g., { 'confirmDelete': true }
  modalData: {}, // { key: any } - e.g., { 'confirmDelete': { id: '123', name: 'Item' } }

  // Set loading state for a specific action
  setLoading: (key, isLoading) =>
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: isLoading,
      },
    })),

  // Check if a specific action is loading
  isLoading: (key) => get().loadingStates[key] || false,

  // Check if any loading state is active
  isAnyLoading: () => Object.values(get().loadingStates).some((state) => state),

  // Open a modal with optional data
  openModal: (modalKey, data = null) =>
    set((state) => ({
      modalStates: {
        ...state.modalStates,
        [modalKey]: true,
      },
      modalData: {
        ...state.modalData,
        [modalKey]: data,
      },
    })),

  // Close a modal
  closeModal: (modalKey) =>
    set((state) => ({
      modalStates: {
        ...state.modalStates,
        [modalKey]: false,
      },
    })),

  // Check if a modal is open
  isModalOpen: (modalKey) => get().modalStates[modalKey] || false,

  // Get data for a specific modal
  getModalData: (modalKey) => get().modalData[modalKey] || null,

  // Notifications using react-toastify
  showNotification: (message, type = 'info', options = {}) => {
    const toastOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      case 'info':
      default:
        toast.info(message, toastOptions);
        break;
    }
  },
}));

export default useUiStore;
