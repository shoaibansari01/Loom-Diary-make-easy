import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmailVerification() {
  const [message, setMessage] = useState('Verifying your email...');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/verify-email/${token}`, {
          method: 'GET',
        });

        const data = await response.json();
        setMessage(data.message);

        if (response.ok) {
          // Redirect to login page after successful verification
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Email Verification</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default EmailVerification;