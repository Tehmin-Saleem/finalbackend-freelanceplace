// TextField.jsx
import React from "react";

const TextField = ({
  label,
  icon,
  value,
  placeholder,
  onChange,
  onBlur,
  errorMessage,
  className,
  textColor,
}) => {
  return (
    <div className={className}>
      {label && <label>{label}</label>}
      <div className="flex">
        {icon && <div className="icon pr-3">{icon}</div>}{" "}
        {/* Render the icon */}
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          style={{ color: textColor }}
          className="focus:outline-none bg-[#ECF0F1]"
        />
      </div>
      {errorMessage && <span className="error-message">{errorMessage}</span>}
    </div>
  );
};

export default TextField;

{
  /* <div className="relative">
  <div className="flex mb-4 shadow  border rounded-xl w-full  py-3 px-3 bg-[#ECF0F1]   font-Poppins ">
    <div className="pr-3">
      <Fname />
    </div>
    <input
      type="text"
      id="firstName"
      name="firstName"
      placeholder="Enter First Name"
      className=" text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
      onChange={(e) => setName(e.target.value)}
      onBlur={validateName}
    />
  </div>
</div>; */
}
