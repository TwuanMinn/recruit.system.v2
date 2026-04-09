import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UndoToastProps {
  id: string;
  message: string;
  duration: number;
  onUndo: () => void;
}

export function UndoToast({ id, message, duration, onUndo }: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const start = Date.now();
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / duration) * 100;
      setProgress(remaining);
      if (remaining > 0) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '280px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🗑️</span>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>{message}</span>
        </div>
        <button
          onClick={() => { onUndo(); toast.dismiss(id); }}
          style={{
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #6c47ff, #38bdf8)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Undo
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: '5px', width: '100%', borderRadius: '99px', overflow: 'hidden', background: 'rgba(0,0,0,0.08)' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '99px',
            width: `${progress}%`,
            background: progress > 30
              ? 'linear-gradient(90deg, #6c47ff, #38bdf8)'
              : '#ef4444',
            transition: 'background 0.3s',
          }}
        />
      </div>
    </div>
  );
}

/** Show an undo toast with a countdown progress bar. */
export function showUndoToast(message: string, onUndo: () => void, duration = 5000) {
  toast(
    (t) => (
      <UndoToast
        id={t.id}
        message={message}
        duration={duration}
        onUndo={onUndo}
      />
    ),
    {
      duration,
      style: { padding: '12px 16px' },
    },
  );
}
