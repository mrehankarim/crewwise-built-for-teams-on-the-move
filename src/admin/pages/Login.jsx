import { Icon } from '@iconify/react'
import Input from '../../components/Input'
import { useState } from 'react'
import FormButton from '../../components/FormButton'
const Login = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    }
    return (
        <>
            <div className="w-screen h-screen bg-sky flex items-center justify-center">
                <div className="lg:w-[30%] md:w-[80%] sm:w-[90%] py-8 bg-white border-2 border-blueborder rounded-lg shadow-md flex flex-col items-center justify-center">
                    <div className='bg-bluelogo p-2 rounded-md'>
                        <Icon icon="mingcute:suitcase-line" width={30} height={30} className='text-white' />
                    </div>
                    <h1 className='text-xl font-bold mt-2 font-grotesk'>Job Glide</h1>
                    <p className='text-md font-medium font-grotesk'>Build For Teams on the Move</p>
                    <form className='w-full p-10' onSubmit={handleSubmit}>
                        <label htmlFor='email' className='block text-md font-semibold'>Email Address</label>
                        <Input type='email' id='email' name="email" value={formData.email} placeHolder='Enter your email address' onChange={handleChange} />
                        <label htmlFor='password' className='block text-md font-semibold'>Password</label>
                        <Input type='password' id='password' name="password" value={formData.password} placeHolder='Enter your password' onChange={handleChange} isPassword={true} />
                        <FormButton text="Login" />
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
