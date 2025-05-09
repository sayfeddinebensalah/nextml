import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ text, className, url }) => {
  return (
    <Link className={`btn ${className}`} to={url}>
      {text}
    </Link>
  );
};

export default Button;