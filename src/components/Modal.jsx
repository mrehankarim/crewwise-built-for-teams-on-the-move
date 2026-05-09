import { Icon } from '@iconify/react';
import { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, title, children, size = 'md', hideClose = false }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-overlayIn">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'var(--bg-modal-overlay)' }}
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto rounded-2xl animate-modalIn scrollbar-hide`}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          boxShadow: 'var(--shadow-xl)',
        }}
      >
        {title && (
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl"
            style={{
              background: 'var(--bg-card)',
              borderBottom: '1px solid var(--border-secondary)',
            }}
          >
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            {!hideClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon icon="mdi:close" width={20} height={20} />
              </button>
            )}
          </div>
        )}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
