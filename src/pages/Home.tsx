import React from "react";
import { ArrowRight, Code, User } from "lucide-react";
import Button from "../components/ui/Button";

const Home: React.FC = () => {
  // Navigation functions to simulate router behavior
  const navigateToDeveloper = () => {
    console.log("Navigating to /developer");
    window.location.href = "/developer";
  };
  const navigateToUser = () => {
    console.log("Navigating to /user");
    window.location.href = "/user";
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Hero Section with 3D Glow Effect */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-4">
        {/* 3D Glow Text in Figure Container */}
        <figure style={figureStyle}>
          {/* Multiple layers of the same text to create 3D effect */}
          {[...Array(10)].map((_, index) => (
            <h1 
              key={index} 
              style={{
                ...h1Style,
                transform: `translateZ(${index * 5}px)`
              }}
            >
              MetaKeep Transaction Generator
            </h1>
          ))}
        </figure>
        
       

        {/* Masked Text Section */}
        <div style={containerStyle}>
          <p style={maskedTextStyle}>
            <span style={{ display: 'block' }}>
              Generate and execute blockchain transactions with MetaKeep's
            </span>
            <span style={{ display: 'block' }}>
              seamless, user-friendly interface. Perfect for developers and end-users alike.
            </span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "2rem", 
          marginTop: "2rem" 
        }}>
          <Button onClick={navigateToDeveloper}>
            <div className="flex items-center justify-center">
              <Code className="mr-2 h-5 w-5" />
              <span>Create Transaction</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Button>
          <Button onClick={navigateToUser}>
            <div className="flex items-center justify-center">
              <User className="mr-2 h-5 w-5" />
              <span>User Dashboard</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </div>

        {/* CSS keyframes and imported font */}
        <style>
          {`
            @import url(https://fonts.googleapis.com/css?family=Concert+One);
            
            @keyframes animate-background {
              0% {
                background-position: 0 50%;
              }
              100% {
                background-position: 100% 50%;
              }
            }
            
            @keyframes glow {
              0%,100%{ text-shadow:0 0 30px red; }
              25%{ text-shadow:0 0 30px orange; }
              50%{ text-shadow:0 0 30px forestgreen; }
              75%{ text-shadow:0 0 30px cyan; }
            }
            
            @keyframes wobble {
              0%,100%{ transform:rotate3d(1,1,0,40deg); }
              25%{ transform:rotate3d(-1,1,0,40deg); }
              50%{ transform:rotate3d(-1,-1,0,40deg); }
              75%{ transform:rotate3d(1,-1,0,40deg); }
            }
          `}
        </style>
      </div>


    </div>
  );
};

// Styles for the 3D glow effect
const figureStyle: React.CSSProperties = {
  animation: 'wobble 5s ease-in-out infinite',
  transformOrigin: 'center center',
  transformStyle: 'preserve-3d',
  position: 'relative',
  height: '200px',
  width: '100%',
  marginBottom: '40px'
};

const h1Style: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '40px',
  lineHeight: '1.5',
  fontFamily: "'Concert One', sans-serif",
  fontWeight: 900,
  fontSize: '4em',
  textTransform: 'uppercase',
  position: 'absolute',
  color: '#0a0a0a',
  animation: 'glow 10s ease-in-out infinite'
};

const containerStyle: React.CSSProperties = {
  textAlign: 'center',
  maxWidth: '48rem',
  margin: '2rem auto',
};

const maskedTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontFamily: "fantasy",
  fontWeight: 'bold',
  color: 'transparent',
  backgroundImage: `url('https://images.unsplash.com/photo-1732535725600-f805d8b33c9c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
  backgroundSize: '200%',
  backgroundPosition: '0 50%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: 'animate-background 5s infinite alternate linear',
  lineHeight: '1.5',
};

export default Home;