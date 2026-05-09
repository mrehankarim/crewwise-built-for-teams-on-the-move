import { Icon } from '@iconify/react'
import Input from '../../components/Input'
import { useState } from 'react'
import FormButton from '../../components/FormButton'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        role: 'manager',
    })

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    }

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
                role: formData.role,
            });
            navigate('/login');
        } catch (err) {
            // handled by context
        }
    }

    return (
        <div className="w-screen min-h-screen bg-sky flex items-center justify-center py-8 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-bluelogo/5 rounded-full animate-float" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blueborder/5 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative lg:w-[35%] md:w-[55%] w-[90%] py-8 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_40px_rgba(77,110,240,0.12)] flex flex-col items-center justify-center animate-scaleIn">
                <div className='bg-bluelogo p-3 rounded-xl shadow-lg shadow-bluelogo/25'>
                    <Icon icon="mingcute:suitcase-line" width={32} height={32} className='text-white' />
                </div>
                <h1 className='text-2xl font-bold mt-3 font-grotesk text-gray-900'>Create Account</h1>
                <p className='text-sm font-medium font-grotesk text-gray-500'>Start managing your field operations</p>

                {error && (
                    <div className="mx-10 mt-4 w-[calc(100%-5rem)] bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-lg animate-slideDown">
                        {error}
                    </div>
                )}

                <form className='w-full px-10 pt-6' onSubmit={handleSubmit}>
                    <label htmlFor='name' className='block text-sm font-semibold text-gray-700 mb-1'>Full Name</label>
                    <Input type='text' id='reg-name' name="name" value={formData.name} placeHolder='Enter your full name' onChange={handleChange} />

                    <label htmlFor='email' className='block text-sm font-semibold text-gray-700 mb-1 mt-2'>Email Address</label>
                    <Input type='email' id='reg-email' name="email" value={formData.email} placeHolder='Enter your email address' onChange={handleChange} />

                    <label htmlFor='phoneNumber' className='block text-sm font-semibold text-gray-700 mb-1 mt-2'>Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                    <Input type='text' id='reg-phone' name="phoneNumber" value={formData.phoneNumber} placeHolder='+1 (555) 123-4567' onChange={handleChange} />

                    <label htmlFor='role' className='block text-sm font-semibold text-gray-700 mb-1 mt-2'>Account Type</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="block w-full my-2 text-gray-600 bg-gray-50 rounded-md border border-gray-200 py-2.5 px-4 outline-none focus:ring-2 focus:ring-blueborder focus:ring-offset-2 text-sm"
                        id="reg-role"
                    >
                        <option value="manager">Manager (Organization Owner)</option>
                        <option value="submanager">Sub-Manager</option>
                    </select>

                    <label htmlFor='password' className='block text-sm font-semibold text-gray-700 mb-1 mt-2'>Password</label>
                    <Input type='password' id='reg-password' name="password" value={formData.password} placeHolder='Create a password' onChange={handleChange} isPassword={true} />

                    <label htmlFor='confirmPassword' className='block text-sm font-semibold text-gray-700 mb-1 mt-2'>Confirm Password</label>
                    <Input type='password' id='reg-confirm' name="confirmPassword" value={formData.confirmPassword} placeHolder='Confirm your password' onChange={handleChange} isPassword={true} />

                    <FormButton text={loading ? "Creating Account..." : "Create Account"} />
                </form>

                <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-bluelogo font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
