import React, { MouseEvent } from "react";
import styled from "styled-components";

// Define the props interface for the Button component
interface ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void; // Explicitly type onClick
  children: React.ReactNode; // Type for children
  className?: string; // Optional className prop
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    min-width: 180px;
    height: 40px;
    background-color: #000;
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    cursor: pointer;
    z-index: 1;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .button::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  .button:hover::after {
    filter: blur(30px);
  }

  .button:hover::before {
    transform: rotate(-180deg);
  }

  .button:active::before {
    scale: 0.7;
  }
`;

// Use the ButtonProps interface for the component
const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
  return (
    <StyledWrapper className={className}>
      <button className="button" onClick={onClick}>
        {children}
      </button>
    </StyledWrapper>
  );
};

export default Button;