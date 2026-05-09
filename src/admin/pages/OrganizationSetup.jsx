import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { organizationAPI } from '../../api/services';
import toast from 'react-hot-toast';

const OrganizationSetup = () => {
    const navigate = useNavigate();
    const { user, fetchMe } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        about: '',
        industry: '',
        location: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.industry || !formData.location) {
            toast.error('Name, industry, and location are required');
            return;
        }
        setLoading(true);
        try {
            await organizationAPI.create(formData);
            await fetchMe();
            toast.success('Organization created successfully!');
            navigate('/setup/subscribe');
        } catch (err) {
            // handled by interceptor
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Create Organization', active: true },
        { num: 2, label: 'Choose Plan', active: false },
        { num: 3, label: 'Start Working', active: false },
    ];

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center py-8" style={{ background: 'var(--bg-primary)' }}>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-bluelogo/5 rounded-full animate-float" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blueborder/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex items-center gap-4 mb-8 animate-slideDown">
                {steps.map((step, idx) => (
                    <div key={step.num} className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step.active
                            ? 'bg-bluelogo text-white shadow-lg shadow-bluelogo/25'
                            : 'border'
                            }`}
                            style={{ 
                                background: step.active ? '' : 'var(--bg-card)', 
                                color: step.active ? '' : 'var(--text-secondary)',
                                borderColor: step.active ? 'transparent' : 'var(--border-primary)'
                            }}
                        >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                                {step.active ? step.num : step.num}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="w-8 h-px" style={{ background: 'var(--border-primary)' }} />
                        )}
                    </div>
                ))}
            </div>

            <div className="relative lg:w-[40%] md:w-[60%] w-[90%] rounded-2xl shadow-xl animate-scaleIn"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 rounded-lg" style={{ background: 'var(--accent-light)' }}>
                            <Icon icon="mdi:office-building" width={24} height={24} style={{ color: 'var(--accent)' }} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Create Your Organization</h1>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Set up your workspace to get started</p>
                        </div>
                    </div>
                </div>

                <form className="px-8 pb-8" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Organization Name *</label>
                            <input
                                type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="e.g. Tech Solutions Inc."
                                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm transition-all"
                                id="org-name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Industry *</label>
                            <input
                                type="text" name="industry" value={formData.industry} onChange={handleChange}
                                placeholder="e.g. HVAC, Plumbing, Electrical"
                                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm transition-all"
                                id="org-industry"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>Location *</label>
                            <input
                                type="text" name="location" value={formData.location} onChange={handleChange}
                                placeholder="e.g. New York, NY"
                                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm transition-all"
                                id="org-location"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>About <span style={{ color: 'var(--text-tertiary)', fontWeight: 'normal' }}>(optional)</span></label>
                            <textarea
                                name="about" value={formData.about} onChange={handleChange}
                                placeholder="Brief description of your organization..."
                                rows={3}
                                className="themed-input w-full rounded-lg py-2.5 px-4 text-sm transition-all resize-none"
                                id="org-about"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-bluelogo text-white py-3 px-4 rounded-xl font-semibold text-sm
                            transition-all duration-200 hover:shadow-lg hover:shadow-bluelogo/25 hover:scale-[1.02]
                            active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        id="org-submit"
                    >
                        {loading ? (
                            <Icon icon="mdi:loading" width={20} className="animate-spin" />
                        ) : (
                            <Icon icon="mdi:arrow-right" width={20} />
                        )}
                        {loading ? 'Creating...' : 'Continue to Plans'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrganizationSetup;
