import React from 'react';
import Header from './header';
import Footer from './footer';
import Button from './Button';

const Main = () => {
  return (
    <>
      
      <div className='d-flex justify-content-center align-items-center min-vh-100'>
        <div className='container bg-light-dark rounded p-3' style={{ maxWidth: '600px' }}>
          <div className='text-center'>
            <h1 className='text-light'>Welcome to NEXTML</h1>
            <p className='text-light lead'>
              NEXTML is a simple, scalable platform that lets users upload, run, and manage machine learning models on the cloud, with pay-as-you-go pricing. It supports popular frameworks like TensorFlow, PyTorch, and Scikit-learn, and offers an easy-to-use interface for tracking usage and costs.
            </p>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Main;
