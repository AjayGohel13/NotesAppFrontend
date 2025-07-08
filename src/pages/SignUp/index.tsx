import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const signUpSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z
        .string()
        .min(8, 'Name must be at least 8 characters'),
    date: z.string().date(),
});

const otpSchema = z.object({
    verifyOtp: z.string().min(6, "OTP must be at least 6 numbers")
})
const SignUpForm: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [otp, setOtp] = useState('');
    const [verifyOtp, setVerifyOtp] = useState('');

    const handleGetOtp = async () => {
        try {
            setLoading(true)
            const result = signUpSchema.safeParse({ email, name, date });
            if (!result.success) {
                const errorMessage = result.error.errors[0]?.message;
                toast.error(errorMessage);
                return;
            }
            const userCheck = await axios.post(`${backendUrl}/auth/check-user`, { email });
            if (userCheck.status === 404) {

                const response = await axios.post(`${backendUrl}/auth/getOtp`, {
                    email,
                });
                setOtp(response.data.otp)
                toast.success('OTP has been sent to your email!');
            } else {
                toast.error('User already exist! Please sign in.');

            }
        } catch (error) {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false)
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        const result = otpSchema.safeParse({ verifyOtp });

        if (!result.success) {
            const errorMessage = result.error.errors[0]?.message;
            toast.error(errorMessage);
            setLoading(false);
            return;
        }

        if (otp === verifyOtp) {
            try {
                const response = await axios.post(`${backendUrl}/auth/sign-up`, {
                    name,
                    email,
                    date,
                });

                toast.success('Sign-Up successfully');
                navigate('/login');
                localStorage.setItem("user", JSON.stringify(response.data.user));
            } catch (error: any) {
                if (error.response && error.response.status === 401) {
                    toast.error(error.response.data.message || 'Email already exists! Sign-in instead');
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please enter valid OTP");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                <div>
                    <img src="/top.png"
                        className="w-96 mx-auto" />
                </div>
                <div className="mt-12 flex flex-col items-center">
                    <h1 className="text-2xl xl:text-3xl font-extrabold">
                        Sign up
                    </h1>
                    <div className="w-full flex-1 mt-8">
                        <div className=" mb-4 text-center">
                            <div
                                className=" px-2  text-sm text-gray-600  font-medium bg-white">
                                Sign up to enjoy the features of HD
                            </div>
                        </div>

                        <div className="mx-auto">
                            <div className=' flex flex-col items-start'>
                                <label htmlFor="email" className="mb-2 text-start text-lg">Email</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border p-3 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="email"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className=' flex flex-col items-start'>
                                <label htmlFor="name" className="mb-2 text-start text-lg">Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border p-3 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="text"
                                    placeholder='Name'
                                    required
                                />
                            </div>
                            <div className=' flex flex-col items-start'>
                                <label htmlFor="date" className="mb-2 text-start text-lg">Birth Date</label>
                                <input
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="border p-3 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                    type="date"
                                    placeholder='Birth date'
                                    required
                                />
                            </div>
                            {otp !== "" && (
                                <div className=' flex flex-col items-start'>
                                    <label htmlFor="OTP" className="mb-2 text-start text-lg">Enter OTP</label>
                                    <input
                                        value={verifyOtp}
                                        onChange={(e) => setVerifyOtp(e.target.value)}
                                        className="border p-3 dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full"
                                        type="text"
                                        placeholder='Enter OTP'
                                    />
                                </div>
                            )}
                            {otp === "" && (
                                <button
                                    onClick={handleGetOtp}
                                    disabled={loading}
                                    className="mt-5 cursor-pointer tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    Get OTP
                                </button>
                            )}
                            {otp !== "" && (
                                <button
                                    onClick={handleSignUp}
                                    disabled={loading}
                                    className="mt-5 cursor-pointer tracking-wide font-semibold bg-blue-500 text-gray-100 w-full py-4 rounded-lg hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center disabled:cursor-not-allowed disabled:bg-blue-300 justify-center focus:shadow-outline focus:outline-none">
                                    Sign-Up
                                </button>
                            )}

                            <div className="flex flex-col mt-4 items-center justify-center text-base">
                                <h3 className="text-gray-700">
                                    Already have an account?{" "}
                                    <Link
                                        className="group text-blue-400 transition-all duration-100 ease-in-out"
                                        to="/sign-in"
                                    >
                                        <span
                                            className="bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                        >
                                            Sign In
                                        </span>
                                    </Link>
                                </h3>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1  text-center hidden lg:flex">
                <div className=" w-full bg-contain bg-center bg-no-repeat">
                    <img src="/right-column.png"
                        className="w-fit mx-auto" />
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
