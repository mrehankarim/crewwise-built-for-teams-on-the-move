import { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      onClose();
    } catch (err) {
      // handled by context toast
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center">
        <div
          className="p-3.5 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, var(--accent), #6366f1)',
            boxShadow: '0 8px 32px var(--accent-shadow)',
          }}
        >
          <Icon icon="mingcute:suitcase-line" width={28} height={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
          Welcome Back
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Sign in to your CrewWise account
        </p>

        <form className="w-full pt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div className="relative">
              <Icon
                icon="mdi:email-outline"
                width={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="themed-input w-full py-2.5 pl-10 pr-4 rounded-xl text-sm"
                id="modal-login-email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div className="relative">
              <Icon
                icon="mdi:lock-outline"
                width={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-tertiary)' }}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="themed-input w-full py-2.5 pl-10 pr-10 rounded-xl text-sm"
                id="modal-login-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width={18} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            id="modal-login-submit"
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <Icon icon="mdi:arrow-right" width={18} />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 w-full my-4">
          <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</span>
          <div className="flex-1 h-px" style={{ background: 'var(--border-primary)' }} />
        </div>

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <button
            onClick={() => { onClose(); onSwitchToRegister?.(); }}
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: 'var(--accent)' }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
