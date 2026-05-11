import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { planAPI, subscriptionAPI, paymentAPI } from '../../api/services';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useTheme } from '../../context/ThemeContext';

const Subscribe = () => {
    const navigate = useNavigate();
    const { user, fetchMe, setSubscriptionStatus } = useAuth();
    const { toggleTheme, isDark } = useTheme();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [pendingInvoice, setPendingInvoice] = useState(null);

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
            const res = await subscriptionAPI.subscribe({
                planId,
                organizationId: user.organization._id || user.organization,
            });
            const invoice = res.data.data.invoice;
            setPendingInvoice(invoice);
            toast.success('Subscription created! Please complete payment.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Subscription failed');
            setSubscribing(false);
            setSelectedPlan(null);
        }
    };

    const handleApprove = async (data, actions) => {
        try {
            await paymentAPI.capturePaypalOrder(data.orderID);
            setSubscriptionStatus({ active: true });
            await fetchMe();
            toast.success('Payment successful! Subscribed to plan.');
            navigate('/manager/dashboard');
        } catch (err) {
            toast.error('Payment capture failed. Please try again.');
            setPendingInvoice(null);
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
                            className={`w-80 rounded-2xl border overflow-hidden
                                transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] animate-slideUp`}
                            style={{ 
                                animationDelay: `${idx * 0.1}s`, 
                                background: 'var(--bg-card)', 
                                borderColor: 'var(--border-primary)',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            <div className={`bg-gradient-to-br ${planColors[idx % 3]} p-8 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Icon icon={planIcons[idx % 3]} width={100} height={100} />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                                        <Icon icon={planIcons[idx % 3]} width={28} height={28} />
                                    </div>
                                    {idx === 1 && (
                                        <span className="bg-white text-indigo-600 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold mt-4 relative z-10">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2 relative z-10">
                                    <span className="text-4xl font-black">${plan.price}</span>
                                    <span className="text-white/80 text-xs font-medium uppercase tracking-widest">/{plan.duration || 30} days</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="p-1 rounded-full bg-green-500/10">
                                            <Icon icon="mdi:check" width={14} className="text-green-500" />
                                        </div>
                                        <span>Up to <strong style={{ color: 'var(--text-primary)' }}>{plan.maxUsers}</strong> team members</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="p-1 rounded-full bg-green-500/10">
                                            <Icon icon="mdi:check" width={14} className="text-green-500" />
                                        </div>
                                        <span>Up to <strong style={{ color: 'var(--text-primary)' }}>{plan.maxWorkOrders}</strong> work orders</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="p-1 rounded-full bg-green-500/10">
                                            <Icon icon="mdi:check" width={14} className="text-green-500" />
                                        </div>
                                        <span>Full dashboard & reports</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <div className="p-1 rounded-full bg-green-500/10">
                                            <Icon icon="mdi:check" width={14} className="text-green-500" />
                                        </div>
                                        <span>Priority Support</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan._id)}
                                    disabled={subscribing}
                                    className={`w-full mt-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300
                                        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                                        ${idx === 1
                                            ? 'bg-bluelogo text-white hover:shadow-bluelogo/30 shadow-lg shadow-bluelogo/20'
                                            : 'bg-gray-800 text-white hover:bg-black'
                                        }`}
                                    style={idx !== 1 ? { background: 'var(--text-primary)', color: 'var(--bg-card)' } : {}}
                                    id={`subscribe-plan-${plan._id}`}
                                >
                                    {subscribing && selectedPlan === plan._id ? (
                                        <Icon icon="mdi:loading" width={18} className="animate-spin" />
                                    ) : (
                                        <Icon icon="mdi:rocket-launch" width={18} />
                                    )}
                                    {subscribing && selectedPlan === plan._id ? 'Processing...' : 'Choose Plan'}
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

            {pendingInvoice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-slideUp">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complete Payment</h2>
                            <p className="text-gray-500 dark:text-gray-400">
                                You are subscribing to the selected plan for <strong>${pendingInvoice.amount}</strong>.
                            </p>
                        </div>
                        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test", currency: "USD" }}>
                            <PayPalButtons
                                createOrder={async () => {
                                    try {
                                        const res = await paymentAPI.createPaypalOrder({ invoiceId: pendingInvoice._id });
                                        return res.data.data.paypalOrderId;
                                    } catch (error) {
                                        toast.error("Failed to initiate PayPal checkout");
                                        throw error;
                                    }
                                }}
                                onApprove={handleApprove}
                                onCancel={() => {
                                    toast.error('Payment was cancelled');
                                    setPendingInvoice(null);
                                    setSubscribing(false);
                                    setSelectedPlan(null);
                                }}
                                onError={() => {
                                    toast.error('PayPal encountered an error');
                                    setPendingInvoice(null);
                                    setSubscribing(false);
                                    setSelectedPlan(null);
                                }}
                                style={{ layout: "vertical", shape: "rect" }}
                            />
                        </PayPalScriptProvider>
                        {import.meta.env.DEV && (
                            <button 
                                onClick={async () => {
                                    try {
                                        await paymentAPI.capturePaypalOrder(`DEV_BYPASS_${pendingInvoice._id}`);
                                        setSubscriptionStatus({ active: true });
                                        await fetchMe();
                                        toast.success('Dev Payment successful! Subscribed to plan.');
                                        navigate('/manager/dashboard');
                                    } catch (err) {
                                        toast.error('Dev Payment failed.');
                                    }
                                }}
                                className="w-full mt-2 py-3 rounded-xl font-bold text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon icon="mdi:test-tube" width={18} />
                                Mock Payment (Dev Mode)
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                setPendingInvoice(null);
                                setSubscribing(false);
                                setSelectedPlan(null);
                            }}
                            className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscribe;
