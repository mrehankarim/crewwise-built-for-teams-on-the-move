import { Icon } from '@iconify/react'
import Input from '../../components/Input'
import { useState } from 'react'
import FormButton from '../../components/FormButton'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(formData.email, formData.password);
            const { user, subscriptionStatus } = result;

            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'manager') {
                if (!user.organization) {
                    navigate('/setup/organization');
                } else if (!subscriptionStatus?.active) {
                    navigate('/setup/subscribe');
                } else {
                    navigate('/manager/dashboard');
                }
            } else if (user.role === 'submanager') {
                navigate('/submanager/dashboard');
            } else {
                navigate('/login');
            }
        } catch (err) {
            // handled by context
        }
    }

    return (
        <div className="w-screen h-screen bg-sky flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-bluelogo/5 rounded-full animate-float" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blueborder/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-bluelogo/3 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative lg:w-[30%] md:w-[50%] w-[90%] py-8 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_40px_rgba(77,110,240,0.12)] flex flex-col items-center justify-center animate-scaleIn">
                <div className='bg-bluelogo p-3 rounded-xl shadow-lg shadow-bluelogo/25'>
                    <Icon icon="mingcute:suitcase-line" width={32} height={32} className='text-white' />
                </div>
                <h1 className='text-2xl font-bold mt-3 font-grotesk text-gray-900'>CrewWise</h1>
                <p className='text-sm font-medium font-grotesk text-gray-500'>Field Service Management</p>

                <form className='w-full px-10 pt-8' onSubmit={handleSubmit}>
                    <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-1'>Email Address</label>
                    <Input type='email' id='login-email' name="email" value={formData.email} placeHolder='Enter your email address' onChange={handleChange} />

                    <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-1 mt-3'>Password</label>
                    <Input type='password' id='login-password' name="password" value={formData.password} placeHolder='Enter your password' onChange={handleChange} isPassword={true} />

                    <FormButton text={loading ? "Signing in..." : "Sign In"} />
                </form>

                <div className="px-10 w-full">
                    <div className="flex items-center gap-3 my-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-bluelogo font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
