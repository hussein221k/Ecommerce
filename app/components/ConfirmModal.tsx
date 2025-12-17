"use client";

import React from "react";
import { useRouter } from "next/navigation";

import Modal from "./Modal";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Yes",
  cancelText = "No",
  type = "info",
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="confirm-modal-content">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button onClick={onClose} className="btn-cancel">
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={`btn-confirm btn-${type}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export interface LoginRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function LoginRedirectModal({
  isOpen,
  onClose,
  message = "You need to be logged in to access this feature.",
}: LoginRedirectModalProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login Required" size="sm">
      <div className="confirm-modal-content">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={handleLogin} className="btn-confirm btn-info">
            Go to Login
          </button>
        </div>
      </div>
    </Modal>
  );
}
