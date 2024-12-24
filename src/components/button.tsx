import React from 'react';
import { ButtonProps } from '../types/button';


export const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled = false,
    type,
    className,
    children,
    showLabel = false, //set the showLabel as true from parent if there is o child component passed in to the button component else set it to false
    title,
}) => {
  return (
    <button
    title={title}
    type={type}
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={`${className} ${disabled ? 'cursor-not-allowed' : ''}`}
  >
    {children}
    {showLabel && !children && <span className="ml-2">{label}</span>}
  </button>
  );
};
