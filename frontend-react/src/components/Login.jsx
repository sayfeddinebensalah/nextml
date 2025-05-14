import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const userData = { username, password };
    console.log('userData =>', userData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', userData);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      console.log('Login successful');
      setIsLoggedIn(true);
      navigate('/'); 
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100'>
      <div className='col-md-4 bg-dark text-light p-5 rounded shadow-lg'>
        <h3 className='text-center mb-4 text-white'>Welcome Back</h3>

        {error && (
          <div className='alert alert-danger text-center p-2 mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className='mb-4'>
            <input
              type='text'
              name='username'
              className='form-control p-3 rounded-pill border-0'
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>

          <div className='mb-4'>
            <input
              type='password'
              name='password'
              className='form-control p-3 rounded-pill border-0'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '50px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            />
          </div>

          <button
            type='submit'
            className='btn btn-info d-block w-100 p-3 rounded-pill text-white'
            disabled={loading}
          >
            {loading ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
