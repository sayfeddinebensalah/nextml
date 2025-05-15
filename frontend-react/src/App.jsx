import './assets/css/style.css';
import Main from './components/Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './components/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import AuthProvider from './AuthProvider';
import ModelHub from './components/ModelHub';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute> } />
          {/* Change PrivateRoute to PublicRoute for login */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/modelhub" element={<PrivateRoute><ModelHub /></PrivateRoute>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
