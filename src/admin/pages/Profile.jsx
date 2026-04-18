import React from 'react'
import Input from "../../components/Input"
import FormButton from "../../components/FormButton"
import { useState } from 'react'
const Profile = () => {

  const [user,setUser]=useState({
    name:'John Doe',
    email:'john.doe@gmail.com',
    phone:'+1 (555) 123-4567',
    role:'Manager',
    organization:'Tech Inc. Solutions'
  })
  const handleSubmit=(e)=>{
    e.preventDefault();
    //handle form submission logic here
  }

  const handleChange = (e) => {
        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }));

    }
  return (
    <div className='w-full px-8 py-4'>
          <h1 className='text-2xl font-bold'>Profile Settings</h1>
          <p className='text-sm text-gray-500'>Manage your account settings and preferences</p>
          <div className='bg-white rounded-2xl p-6 w-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-100 my-6'>
            <form className='w-full p-10' onSubmit={handleSubmit}>
                        <label htmlFor='name' className='block text-md font-semibold'>Name </label>
                        <Input type='text' id='name' name="name" value={user.name} placeHolder='Enter your name' onChange={handleChange} />
                        <label htmlFor='email' className='block text-md font-semibold'>Email Address</label>
                        <Input type='email' id='email' name="email" value={user.email} placeHolder='Enter your email address' onChange={handleChange} disable={true}/>
                        <label htmlFor='phone' className='block text-md font-semibold'>Phone Number</label>
                        <Input type='text' id='phone' name="phone" value={user.phone} placeHolder='Enter your phone number' onChange={handleChange} />
                        <label htmlFor='role' className='block text-md font-semibold'>Role</label>
                        <Input type='text' id='role' name="role" value={user.role} placeHolder='Enter your role' onChange={handleChange} disable={true} />
                        <label htmlFor='organization' className='block text-md font-semibold'>Organization</label>
                        <Input type='text' id='organization' name="organization" value={user.organization} placeHolder='Enter your organization' onChange={handleChange} disable={true} />
                        <FormButton text="Save" />
                    </form>
          </div>

    </div>
  )

}

export default Profile
