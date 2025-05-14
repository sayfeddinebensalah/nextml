import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Main = () => {
  return (
    <>
      <div className='d-flex justify-content-center align-items-center min-vh-100'>
        <div className='container bg-dark rounded p-5' style={{
          maxWidth: '700px',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', // Subtle but deeper shadow for depth
          borderRadius: '15px', // Slightly rounded corners
          color: '#f1f1f1', // Light text color for contrast
          backdropFilter: 'blur(5px)', // Slight background blur effect
          border: '1px solid rgba(255, 255, 255, 0.2)' // Light border for subtle separation
        }}>
          <div className='text-center'>
            <h1 className='text-light mb-4' style={{ fontSize: '2.5rem', fontWeight: '700' }}>Welcome to NEXTML</h1>

            {/* Pixel Art GIF (Transparent Robot Image) */}
            <img 
              src="/images/robot-idle.gif" 
              alt="Pixel Robot Idling" 
              style={{
                width: '180px', 
                marginBottom: '20px', 
                animation: 'pulse 2s infinite'
              }} 
            />

            <p className='text-light lead' style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              NEXTML is a simple, scalable platform that lets users upload, run, and manage machine learning models on the cloud, with pay-as-you-go pricing. It supports popular frameworks like TensorFlow, PyTorch, and Scikit-learn, and offers an easy-to-use interface for tracking usage and costs.
            </p>
          </div>
        </div>
      </div>

      {/* Optional Footer */}
      {/* <Footer /> */}
    </>
  );
};

export default Main;
