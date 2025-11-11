import React, { useState, useEffect } from 'react';
import './App.css';

const proposalTexts = [
  "I've filed a motion to find you guilty of being a baddie.",
  "As part of this ongoing investigation, I'm gathering evidence.",
  "Therefore, I would like to formally request your presence on a date.",
];

function App() {
  const [showProposal, setShowProposal] = useState(false);
  const [showYes, setShowYes] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [textIndex, setTextIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showProposal && !showYes && !showRetry) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        if (textIndex < proposalTexts.length - 1) {
          setTimeout(() => {
            setTextIndex(prev => prev + 1);
          }, 2000);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showProposal, textIndex, showYes, showRetry]);

  useEffect(() => {
    if (showYes) {
      const interval = setInterval(() => {
        setHearts(prev => [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * 100,
            delay: Math.random() * 2
          }
        ]);
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showYes]);

  const handleYesClick = () => {
    setShowYes(true);
  };

  const handleMaybeClick = () => {
    setShowRetry(true);
  };

  const handleReveal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowProposal(true);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="App">
      <div className="background">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {!showProposal ? (
        <div className="intro-screen">
          <div className="intro-content">
            <h1 className="intro-title">Hey Jia ☺️</h1>
            <p className="intro-text">I know you're stressed and busy with finals 😨😔 <br />
                but there's something I want to ask...</p>
            <button 
              className="reveal-button"
              onClick={handleReveal}
              disabled={isLoading}
            >
              {isLoading ? '...' : 'Continue'}
            </button>
          </div>
        </div>
      ) : showYes ? (
        <div className="success-screen">
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="floating-heart"
              style={{
                left: `${heart.left}%`,
                animationDelay: `${heart.delay}s`
              }}
            >
              💕
            </div>
          ))}
          <div className="success-content">
            <h1 className="success-title">Awesome!</h1>
            <p className="success-text">
              I'll text you to figure out the details. Looking forward to it! 😊
            </p>
          </div>
        </div>
      ) : showRetry ? (
        <div className="proposal-container">
          <div className="proposal-content">
            <div className="lawyer-icon">😏</div>
            <h1 className="proposal-title">Hmm...</h1>
            <div className="proposal-text">
              <p className="text-visible" style={{textAlign: 'center', marginBottom: '30px'}}>
                Let's try that again!
              </p>
              <div className="button-container">
                <button 
                  className="yes-button"
                  onClick={handleYesClick}
                >
                  Yes
                </button>
                <button 
                  className="yes-button"
                  onClick={handleYesClick}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="proposal-container">
          <div className="proposal-content">
            <div className="lawyer-icon">⚖️</div>
            <h1 className="proposal-title">Jia,</h1>
            <div className="proposal-text">
              {proposalTexts.slice(0, textIndex + 1).map((text, index) => (
                <p 
                  key={index} 
                  className={index === textIndex ? 'text-appearing' : 'text-visible'}
                >
                  {text}
                </p>
              ))}
              {isLoading && textIndex < proposalTexts.length - 1 && (
                <p className="loading-dots">...</p>
              )}
              {textIndex === proposalTexts.length - 1 && !isLoading && (
                <>
                  <p className="question-text">
                    Will you accept this motion?
                  </p>
                  <div className="button-container">
                    <button 
                      className="yes-button"
                      onClick={handleYesClick}
                    >
                      Yes
                    </button>
                    <button 
                      className="maybe-button"
                      onClick={handleMaybeClick}
                    >
                      Maybe later
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
