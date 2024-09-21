import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import backgroundImage from "../Images/background.jpg";

function LoginPage() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mobile || !password) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/login", {
        mobile,
        password,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.mytoken);
        alert("Login successful");
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (forgotPasswordStep === 1) {
        const res = await axios.post("http://localhost:5000/forgot-password", {
          email,
        });
        if (res.status === 200) {
          alert("OTP sent to your email");
          setForgotPasswordStep(2);
        } else {
          alert(res.data.message);
        }
      } else if (forgotPasswordStep === 2) {
        const res = await axios.post(
          "http://localhost:5000/forgot-password-verify-otp",
          { email, otp }
        );
        if (res.status === 200) {
          setForgotPasswordStep(3);
        } else {
          alert(res.data.message);
        }
      } else if (forgotPasswordStep === 3) {
        if (newPassword !== confirmNewPassword) {
          alert("Passwords do not match");
          return;
        }
        const res = await axios.post("http://localhost:5000/reset-password", {
          email,
          otp,
          newPassword,
        });
        if (res.status === 200) {
          alert("Password reset successful");
          setForgotPasswordMode(false);
          setForgotPasswordStep(1);
        } else {
          alert(res.data.message);
        }
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <>
            <div className="relative mb-4">
              <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div className="relative mb-4">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        );
      case 3:
        return (
          <>
            <div className="relative mb-4">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-96 backdrop-blur-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {forgotPasswordMode ? "Forgot Password" : "Login"}
        </h2>
        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            {renderForgotPasswordForm()}
            <button
              type="button"
              onClick={() => {
                setForgotPasswordMode(false);
                setForgotPasswordStep(1);
              }}
              className="w-full text-blue-500 text-sm hover:underline focus:outline-none flex items-center justify-center mt-4"
            >
              <ArrowLeft size={16} className="mr-1" /> Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Phone
                className="absolute top-3 left-3 text-gray-400"
                size={20}
              />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter Mobile Number"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ease-in-out"
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="text-blue-500 text-sm hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
              <Link
                to="/signup"
                className="text-blue-500 text-sm hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
