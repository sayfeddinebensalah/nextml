import { useContext } from 'react';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/style.css';
import { AuthContext } from '../AuthProvider';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar container pt-3 pb-3 d-flex justify-content-between align-items-center">
      <Link className="navbar-brand" to="/">
        <img src="/images/NEXTML.png" alt="NEXTML Logo" style={{ height: '150px' }} />
      </Link>
      <div className="d-flex gap-3">
        {isLoggedIn ? (
          <>
            <Button text="Model Hub" className="btn-info btn-lg" url="/modelhub" />
            <button className="btn btn-danger btn-lg" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Button text="Login" className="btn-custom-outline btn-lg" url="/login" />
            <Button text="Register" className="btn-info btn-lg" url="/register" />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;