import React from 'react'

const FormButton = ({ text }) => {
  return (
    <button
      type="submit"
      className="w-full cursor-pointer bg-black text-white py-2.5 px-4 rounded-lg my-4 text-lg font-semibold 
             transition-all duration-200 ease-in-out
             hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02] 
             active:scale-[0.98]
             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
    >
      {text}
    </button>
  )
}

export default FormButton
