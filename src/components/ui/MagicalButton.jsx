import React from "react";
import { Link } from "react-router-dom";

export default function MagicalButton({
  children,
  onClick,
  variant = "primary", // 'primary' | 'secondary' | 'ghost' | 'emerald' | 'burgundy'
  size = "md", // 'sm' | 'md' | 'lg'
  icon: Icon,
  to,
  className = "",
  disabled = false,
  ...rest
}) {
  const getStyles = () => {
    const base = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.55rem",
      fontFamily: "var(--font-display)",
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      borderRadius: "var(--radius-sm)",
      transition: "var(--transition-normal)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      position: "relative",
      overflow: "hidden",
      textDecoration: "none",
    };

    const sizeStyles = {
      sm: { padding: "0.45rem 0.95rem", fontSize: "0.76rem" },
      md: { padding: "0.75rem 1.45rem", fontSize: "0.85rem" },
      lg: { padding: "0.95rem 2.1rem", fontSize: "0.96rem" },
    }[size];

    const variantStyles = {
      primary: {
        background: "linear-gradient(135deg, #FBF4DD 0%, #D6B46A 45%, #AA8438 100%)",
        color: "var(--midnight)",
        boxShadow: "0 4px 18px rgba(214, 180, 106, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
        border: "1px solid #F4D38B",
      },
      secondary: {
        background: "rgba(21, 29, 53, 0.75)",
        color: "var(--ivory)",
        border: "1px solid var(--antique-gold-border)",
        backdropFilter: "blur(8px)",
      },
      ghost: {
        background: "transparent",
        color: "var(--parchment)",
        border: "1px solid transparent",
      },
      emerald: {
        background: "linear-gradient(135deg, #447B63 0%, #315C4A 60%, #1E3B2F 100%)",
        color: "var(--ivory)",
        border: "1px solid rgba(121, 194, 164, 0.4)",
        boxShadow: "0 4px 14px rgba(49, 92, 74, 0.4)",
      },
      burgundy: {
        background: "linear-gradient(135deg, #8E445B 0%, #6D3345 60%, #46202C 100%)",
        color: "var(--ivory)",
        border: "1px solid rgba(226, 136, 161, 0.4)",
        boxShadow: "0 4px 14px rgba(109, 51, 69, 0.4)",
      },
    }[variant];

    return { ...base, ...sizeStyles, ...variantStyles };
  };

  const content = (
    <>
      {Icon && <Icon size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`magical-btn magical-btn-${variant} ${className}`}
        style={getStyles()}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`magical-btn magical-btn-${variant} ${className}`}
      style={getStyles()}
      {...rest}
    >
      {content}
    </button>
  );
}
