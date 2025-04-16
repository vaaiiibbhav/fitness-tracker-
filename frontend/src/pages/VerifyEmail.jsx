import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-email`, { token });
        if (response.data.success) {
          setVerificationStatus('success');
          setTimeout(() => {
            navigate('/SignIn');
          }, 3000);
        }
      } catch (error) {
        setVerificationStatus('error');
        console.error('Email verification failed:', error);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {verificationStatus === 'verifying' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Verifying your email...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div className="text-center text-green-600">
            <h2 className="text-2xl font-semibold mb-4">Email Verified Successfully!</h2>
            <p>Your email has been verified. Redirecting to login...</p>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div className="text-center text-red-600">
            <h2 className="text-2xl font-semibold mb-4">Verification Failed</h2>
            <p>The verification link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/SignIn')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 