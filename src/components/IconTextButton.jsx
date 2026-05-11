import React from 'react'
import { Icon } from '@iconify/react'

const IconTextButton = ({ icon, text, onClickHandler }) => {
    return (
        <button
            onClick={onClickHandler}
            className='bg-black text-white text-sm font-medium flex items-center gap-1 py-2 px-4 rounded-md font-roboto
            transition-all duration-200 ease-in-out
            hover:bg-gray-900 hover:shadow-lg hover:scale-[1.02]
            active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black'
        >
            <Icon icon={icon} width={22} height={22} />
            <span>{text}</span>
        </button>
    )
}

export default IconTextButton