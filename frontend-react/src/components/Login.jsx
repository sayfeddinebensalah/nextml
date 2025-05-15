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
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/v1/token/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      setIsLoggedIn(true);
      navigate('/');
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="col-md-4 p-4 bg-dark rounded shadow border border-secondary">
        <h3 className="text-center text-white mb-4">Welcome Back</h3>

        {error && <div className="alert alert-danger text-center p-2 mb-4">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="form-label text-light">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control bg-secondary text-light rounded shadow-sm border-0"
              style={{ padding: '12px 20px' }}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control bg-secondary text-light rounded shadow-sm border-0"
              style={{ padding: '12px 20px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-info w-100 py-3 rounded"
          >
            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
