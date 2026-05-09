import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { planAPI, subscriptionAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const Subscribe = () => {
    const navigate = useNavigate();
    const { user, fetchMe, setSubscriptionStatus } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await planAPI.getAll();
                setPlans(res.data.data || []);
            } catch (err) {
                toast.error('Failed to load plans');
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSubscribe = async (planId) => {
        if (!user?.organization) {
            toast.error('Please create an organization first');
            navigate('/setup/organization');
            return;
        }
        setSubscribing(true);
        setSelectedPlan(planId);
        try {
            await subscriptionAPI.subscribe({
                planId,
                organizationId: user.organization._id || user.organization,
            });
            setSubscriptionStatus({ active: true });
            await fetchMe();
            toast.success('Subscribed successfully!');
            navigate('/manager/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Subscription failed');
        } finally {
            setSubscribing(false);
            setSelectedPlan(null);
        }
    };

    const steps = [
        { num: 1, label: 'Create Organization', active: false, done: true },
        { num: 2, label: 'Choose Plan', active: true },
        { num: 3, label: 'Start Working', active: false },
    ];

    const planIcons = ['mdi:rocket-launch', 'mdi:star-four-points', 'mdi:crown'];
    const planColors = ['from-blue-500 to-blue-600', 'from-indigo-500 to-purple-600', 'from-amber-500 to-orange-600'];

    return (
        <div className="w-full min-h-screen flex flex-col items-center py-8" style={{ background: 'var(--bg-primary)' }}>
            <div className="absolute top-6 right-6 z-50">
                <button onClick={toggleTheme} className="p-2 rounded-lg shadow-sm transition-colors hover:opacity-80" style={{ background: 'var(--bg-card)' }}>
                    <Icon icon={isDark ? "heroicons:sun" : "heroicons:moon"} width={24} height={24} style={{ color: 'var(--text-secondary)' }} />
                </button>
            </div>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-bluelogo/5 rounded-full animate-float" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blueborder/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex items-center gap-4 mb-8 animate-slideDown">
                {steps.map((step, idx) => (
                    <div key={step.num} className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${step.active
                            ? 'bg-bluelogo text-white shadow-lg shadow-bluelogo/25'
                            : step.done
                                ? 'bg-green-500 text-white'
                                : 'border'
                            }`}
                            style={(!step.active && !step.done) ? { 
                                background: 'var(--bg-card)', 
                                color: 'var(--text-secondary)',
                                borderColor: 'var(--border-primary)'
                            } : {}}
                        >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                                {step.done ? '✓' : step.num}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                        </div>
                        {idx < steps.length - 1 && <div className="w-8 h-px" style={{ background: 'var(--border-primary)' }} />}
                    </div>
                ))}
            </div>

            <div className="relative text-center mb-8 animate-slideUp">
                <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Choose Your Plan</h1>
                <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>Select the perfect plan for your team</p>
            </div>

            {loading ? (
                <div className="flex gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-80 h-96 loading-skeleton" />
                    ))}
                </div>
            ) : (
                <div className="relative flex flex-wrap justify-center gap-6 px-4">
                    {plans.map((plan, idx) => (
                        <div
                            key={plan._id}
                            className={`w-80 rounded-2xl border shadow-lg overflow-hidden
                                transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1 animate-slideUp`}
                            style={{ animationDelay: `${idx * 0.1}s`, background: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
                        >
                            <div className={`bg-gradient-to-r ${planColors[idx % 3]} p-6 text-white`}>
                                <div className="flex items-center justify-between">
                                    <Icon icon={planIcons[idx % 3]} width={32} height={32} />
                                    {idx === 1 && (
                                        <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mt-3">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-extrabold">${plan.price}</span>
                                    <span className="text-white/70 text-sm">/{plan.duration || 30} days</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <Icon icon="mdi:check-circle" width={18} className="text-green-500 flex-shrink-0" />
                                        <span>Up to <strong style={{ color: 'var(--text-primary)' }}>{plan.maxUsers}</strong> team members</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <Icon icon="mdi:check-circle" width={18} className="text-green-500 flex-shrink-0" />
                                        <span>Up to <strong style={{ color: 'var(--text-primary)' }}>{plan.maxWorkOrders}</strong> work orders</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <Icon icon="mdi:check-circle" width={18} className="text-green-500 flex-shrink-0" />
                                        <span>Full dashboard & reports</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <Icon icon="mdi:check-circle" width={18} className="text-green-500 flex-shrink-0" />
                                        <span>Worker & schedule management</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan._id)}
                                    disabled={subscribing}
                                    className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                                        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                        ${idx === 1
                                            ? 'bg-bluelogo text-white hover:shadow-bluelogo/25'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                    id={`subscribe-plan-${plan._id}`}
                                >
                                    {subscribing && selectedPlan === plan._id ? (
                                        <Icon icon="mdi:loading" width={20} className="animate-spin" />
                                    ) : null}
                                    {subscribing && selectedPlan === plan._id ? 'Processing...' : 'Get Started'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {plans.length === 0 && !loading && (
                <div className="text-center animate-fadeIn" style={{ color: 'var(--text-secondary)' }}>
                    <Icon icon="mdi:alert-circle-outline" width={48} className="mx-auto mb-3 opacity-50" />
                    <p className="font-medium">No plans available yet</p>
                    <p className="text-sm">Please contact the administrator to set up subscription plans.</p>
                </div>
            )}
        </div>
    );
};

export default Subscribe;
