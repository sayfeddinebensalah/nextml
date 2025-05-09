import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {AuthContext} from '../AuthProvider'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext)
  const navigate = useNavigate(); // ✅ Fixed typo

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
      setIsLoggedIn(true)
      navigate('/'); // ✅ Navigation on success
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6 bg-dark p-5 rounded'>
          <h3 className='text-center mb-4 text-white'>Login</h3>
          
          {error && (
            <div className='alert alert-danger text-center'>{error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className='mb-3'>
              <input
                type='text'
                name='username'
                className='form-control mb-1'
                placeholder='Enter username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className='mb-3'>
              <input
                type='password'
                name='password'
                className='form-control mb-1'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type='submit'
              className='btn btn-info d-block mx-auto'
              disabled={loading}
            >
              {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
