"use client";

// Simple simulated auth using localStorage
// In a real app, this would be handled by a secure backend

const ADMIN_CREDS_KEY = "admin_credentials";

const DEFAULT_ADMIN = {
    username: "Admin",
    password: "Hussein175#"
};

export const getAdminCredentials = () => {
    if (typeof window === "undefined") return DEFAULT_ADMIN;

    const stored = localStorage.getItem(ADMIN_CREDS_KEY);
    if (!stored) {
        localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(DEFAULT_ADMIN));
        return DEFAULT_ADMIN;
    }
    return JSON.parse(stored);
};

export const updateAdminPassword = (newPassword: string) => {
    const current = getAdminCredentials();
    const updated = { ...current, password: newPassword };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));
    return true;
};

export const verifyAdmin = (username: string, pass: string) => {
    const creds = getAdminCredentials();
    return creds.username === username && creds.password === pass;
};
