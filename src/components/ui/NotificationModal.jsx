import React, { useState } from "react";
import { notificationsList } from "../../data/mockData";
import { Bell, Check, X, Sparkles } from "lucide-react";

export default function NotificationModal({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(notificationsList);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: "var(--z-modal)",
        }}
      />

      {/* Popover Card */}
      <div
        className="magical-card ornate-corners"
        style={{
          position: "absolute",
          top: "100%",
          right: "0",
          marginTop: "0.6rem",
          width: "360px",
          maxWidth: "calc(100vw - 2rem)",
          zIndex: "calc(var(--z-modal) + 1)",
          background: "linear-gradient(180deg, #151D35 0%, #0B1020 100%)",
          border: "1px solid var(--antique-gold-border-bright)",
          boxShadow: "var(--shadow-floating)",
          padding: "1.2rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(214, 180, 106, 0.15)",
            paddingBottom: "0.8rem",
            marginBottom: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Bell size={16} color="var(--antique-gold)" />
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "0.92rem",
                color: "var(--ivory)",
              }}
            >
              Owl Dispatches
            </h4>
            {unreadCount > 0 && (
              <span className="badge-burgundy" style={{ padding: "0.15rem 0.45rem", fontSize: "0.65rem" }}>
                {unreadCount} new
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  fontSize: "0.72rem",
                  color: "var(--antique-gold)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.2rem",
                }}
              >
                <Check size={12} /> Mark read
              </button>
            )}
            <button
              onClick={onClose}
              style={{ color: "var(--parchment-muted)", cursor: "pointer" }}
              aria-label="Close notifications"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List of dispatches */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", maxHeight: "320px", overflowY: "auto" }}>
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRead(item.id)}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-sm)",
                background: item.read ? "rgba(21, 29, 53, 0.4)" : "rgba(214, 180, 106, 0.08)",
                border: item.read ? "1px solid rgba(214, 180, 106, 0.08)" : "1px solid rgba(214, 180, 106, 0.28)",
                cursor: "pointer",
                transition: "var(--transition-fast)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.25rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-display)",
                    color: "var(--antique-gold)",
                  }}
                >
                  {item.source}
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--parchment-muted)" }}>
                  {item.time}
                </span>
              </div>
              <h5
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "0.3rem",
                  color: item.read ? "var(--ivory)" : "var(--antique-gold-bright)",
                }}
              >
                {item.title}
              </h5>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--parchment)",
                  lineHeight: 1.45,
                }}
              >
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
