import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false); // Hide success message when editing
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/register/', formData);
      console.log('Registration successful:', response.data);
      setErrors({});
      setSuccess(true);
    } catch (error) {
      const responseErrors = error.response?.data || {};
      setErrors(responseErrors);

      if (error.response) {
        console.error('Registration error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Request setup error:', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) => {
    const error = errors[field];
    if (!error) return null;
    return (
      <div className='text-danger'>
        {Array.isArray(error) ? error[0] : error}
      </div>
    );
  };

  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100'>
      <div className='col-md-4 bg-dark text-light p-5 rounded shadow-lg'>
        <h3 className='text-center mb-4 text-white'>Create an Account</h3>
        <form onSubmit={handleRegistration}>
          <div className='mb-4'>
            <input
              type="text"
              name="username"
              className='form-control p-3 rounded-pill border-0'
              placeholder='Enter username'
              value={formData.username}
              onChange={handleChange}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
            <small>{renderError('username')}</small>
          </div>

          <div className='mb-4'>
            <input
              type="email"
              name="email"
              className='form-control p-3 rounded-pill border-0'
              placeholder='Enter email address'
              value={formData.email}
              onChange={handleChange}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
            <small>{renderError('email')}</small>
          </div>

          <div className='mb-4'>
            <input
              type="password"
              name="password"
              className='form-control p-3 rounded-pill border-0'
              placeholder='Set password'
              value={formData.password}
              onChange={handleChange}
              style={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
            <small>{renderError('password')}</small>
          </div>

          {success && <div className='alert alert-success'>Registration Successful</div>}

          {loading ? (
            <button type='submit' className='btn btn-info d-block w-100 p-3 rounded-pill text-white' disabled>
              <FontAwesomeIcon icon={faSpinner} spin />
            </button>
          ) : (
            <button type='submit' className='btn btn-info d-block w-100 p-3 rounded-pill text-white'>
              Register
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
