import React from "react";
import CHARACTER from "/images/CHARACTER.png";
import LogoName from "../../svg/LogoName";
import Group from "/images/Group.png";
import Fname from "../../svg/Fname";

function Login() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* First Half - Logo and Picture */}
      <div className="md:w-1/2 h-screen bg-white flex flex-col items-center justify-center">
        <div className="mb-6 mt-20 pt-6">
          <LogoName />
        </div>
        <div className=" mb-3 ml-4">
          <img src={CHARACTER} alt="Image" className="max-w-full md:max-w-md" />
        </div>
        <div className=" mr-96 mt-auto">
          <img src={Group} alt="Image" />
        </div>
      </div>

      {/*================= Second Half - Form ================*/}
      <div className="md:w-1/2 h-screen bg-white flex items-center justify-center shadow-lg">
        <div className="w-full max-w-lg p-16 shadow-2xl">
          <form>
            <h1 className="text-[24px] font-Poppins font-medium text-center px-16 py-3">
              Please sign up to hire talented individuals
            </h1>
            <div className="relative">
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
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex mb-4 shadow  border rounded-xl w-full  py-3 px-3 bg-[#ECF0F1]   font-Poppins ">
                <div className="pr-3">
                  <Fname />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter Last Name"
                  className=" text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex mb-4 shadow  border rounded-xl w-full  py-3 px-3 bg-[#ECF0F1]   font-Poppins ">
                <div className="pr-3">
                  <Fname />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter work email address"
                  className=" text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex mb-4 shadow  border rounded-xl w-full  py-3 px-3 bg-[#ECF0F1]   font-Poppins ">
                <div className="pr-3">
                  <Fname />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Password (8 or more characters)"
                  className=" text-[#94A3B8] bg-[#ECF0F1] text-[14px] flex-1"
                />
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                className="mr-2 leading-tight"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the Terms and Conditions
              </label>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-[#4BCBEB] text-white font-bold py-3 px-7 w-full rounded-xl focus:outline-none focus:shadow-outline"
              >
                Create My Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
