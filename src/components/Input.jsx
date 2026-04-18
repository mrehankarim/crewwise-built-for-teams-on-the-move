import { useState } from "react";
import { Icon } from "@iconify/react";

const Input = ({
  value,
  placeHolder,
  type,
  id,
  onChange,
  name,
  isPassword = false,
  disable=false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeHolder}
        value={value}
        id={id}
        onChange={onChange}
        disabled={disable}
        className={`block w-full my-2 text-gray-600 bg-gray rounded-md border-none py-2 px-4 pr-10 outline-none placeholder:text-gray-400 placeholder:font-semibold focus:ring-2 focus:ring-blueborder focus:ring-offset-2 focus:ring-offset-gray-100 ${disable ? 'cursor-not-allowed opacity-50 bg-gray-400 text-white' : '' }`}
      />

      {isPassword && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
          <Icon
            icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
            width={20}
            onClick={() => setShowPassword(prev=>!prev)}
          />
        </span>
      )}
    </div>
  );
};

export default Input;