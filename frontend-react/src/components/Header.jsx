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
    localStorage.removeItem('refreshToken'); // typo fixed: 'refereshToken' ➜ 'refreshToken'
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="navbar container pt-3 pb-3 align-items-start">
      <Link className="navbar-brand" to="/">
        <span className="brand-next">NEXT</span>
        <span className="brand-ml">ML</span>
      </Link>
      <div>
        {isLoggedIn ? (
          <>
            <Button text="Dashboard" className="btn-info" url="/dashboard" />
            {/* Fixed prop name 'class' ➜ 'className', and route from '/login' to '/dashboard' */}
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Button text="Login" className="btn-custom-outline" url="/login" />
            &nbsp;
            <Button text="Register" className="btn-info" url="/register" />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
