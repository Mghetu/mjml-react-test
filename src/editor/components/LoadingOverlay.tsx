// src/editor/components/LoadingOverlay.tsx
type LoadingOverlayProps = {
  visible: boolean;
  title: string;
  message?: string;
};

export default function LoadingOverlay({ visible, title, message }: LoadingOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="loading-overlay"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message ? `${title}. ${message}` : title}
    >
      <div className="loading-card">
        <span className="loading-sr-only">{message ? `${title}. ${message}` : title}</span>
        <div className="loading-spinner" aria-hidden="true" />
        <div className="loading-title">{title}</div>
        {message ? <div className="loading-message">{message}</div> : null}
      </div>
    </div>
  );
}
