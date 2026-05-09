import { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber || undefined,
        role: 'manager',
      });
      toast.success('Account created! Please sign in.');
      onClose();
      onSwitchToLogin?.();
    } catch (err) {
      // handled by context
    }
  };

  const inputField = (label, name, type, placeholder, icon, required = true) => (
    <div>
      <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div className="relative">
        <Icon
          icon={icon}
          width={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--text-tertiary)' }}
        />
        {name === 'password' || name === 'confirmPassword' ? (
          <>
            <input
              type={showPassword ? "text" : "password"}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="themed-input w-full py-2.5 pl-10 pr-10 rounded-xl text-sm"
              id={`modal-reg-${name}`}
              required={required}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: 'var(--text-tertiary)' }}
            >
              <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width={18} />
            </button>
          </>
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className="themed-input w-full py-2.5 pl-10 pr-4 rounded-xl text-sm"
            id={`modal-reg-${name}`}
            required={required}
          />
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col items-center">
        <div
          className="p-3.5 rounded-2xl mb-4"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          }}
        >
          <Icon icon="mdi:account-plus-outline" width={28} height={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold font-grotesk" style={{ color: 'var(--text-primary)' }}>
          Create Account
        </h1>
        <p className="text-sm font-medium mt-1 text-center" style={{ color: 'var(--text-tertiary)' }}>
          Register as an Organization Manager
        </p>

        <div
          className="flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
        >
          <Icon icon="mdi:information-outline" width={14} />
          Only organization managers can register
        </div>

        {error && (
          <div className="w-full mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl animate-slideDown flex items-center gap-2">
            <Icon icon="mdi:alert-circle" width={16} />
            {error}
          </div>
        )}

        <form className="w-full pt-5 space-y-3.5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inputField('Full Name', 'name', 'text', 'John Doe', 'mdi:account-outline')}
            {inputField('Phone', 'phoneNumber', 'text', '+1 (555) 123-4567', 'mdi:phone-outline', false)}
          </div>
          {inputField('Email Address', 'email', 'email', 'you@company.com', 'mdi:email-outline')}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {inputField('Password', 'password', 'password', 'Min 6 characters', 'mdi:lock-outline')}
            {inputField('Confirm Password', 'confirmPassword', 'password', 'Re-enter password', 'mdi:lock-check-outline')}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            id="modal-reg-submit"
          >
            {loading ? (
              <>
                <Icon icon="mdi:loading" width={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Manager Account
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
          Already have an account?{' '}
          <button
            onClick={() => { onClose(); onSwitchToLogin?.(); }}
            className="font-semibold hover:underline cursor-pointer"
            style={{ color: 'var(--accent)' }}
          >
            Sign In
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default RegisterModal;
