import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await axios.post('http://127.0.0.1:8000/api/v1/register/', formData);
      setSuccess(true);
      setFormData({ username: '', email: '', password: '' });
    } catch (error) {
      setErrors(error.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) => {
    const error = errors[field];
    if (!error) return null;
    return <small className="text-danger d-block mb-2">{Array.isArray(error) ? error[0] : error}</small>;
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-4 p-4 bg-dark rounded shadow border border-secondary">
        <h3 className="text-center text-white mb-4">Create an Account</h3>

        <form onSubmit={handleRegistration}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-light">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="form-control bg-secondary text-light rounded shadow-sm border-0"
              required
              style={{ padding: '12px 20px' }}
            />
            {renderError('username')}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="form-control bg-secondary text-light rounded shadow-sm border-0"
              required
              style={{ padding: '12px 20px' }}
            />
            {renderError('email')}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Set password"
              value={formData.password}
              onChange={handleChange}
              className="form-control bg-secondary text-light rounded shadow-sm border-0"
              required
              style={{ padding: '12px 20px' }}
            />
            {renderError('password')}
          </div>

          {success && <div className="alert alert-success my-3">Registration Successful</div>}

          <button
            type="submit"
            className="btn btn-info w-100 py-3 rounded"
            disabled={loading}
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
