/**
 * Notification System - Easy Imports
 * 
 * Import everything you need from this single file
 */

// Context and Hook
export { NotificationProvider, useNotification } from './context/NotificationContext';

// Components
export { default as Modal } from './components/Modal';
export { default as ConfirmModal, LoginRedirectModal } from './components/ConfirmModal';
export { default as Toast } from './components/Toast';
export { default as ToastContainer } from './components/ToastContainer';

// Types
export type { ToastType } from './components/Toast';
export type { ModalProps } from './components/Modal';
export type { ConfirmModalProps, LoginRedirectModalProps } from './components/ConfirmModal';

/**
 * USAGE EXAMPLE:
 * 
 * import { useNotification, ConfirmModal, LoginRedirectModal } from '@/app/notifications';
 */
