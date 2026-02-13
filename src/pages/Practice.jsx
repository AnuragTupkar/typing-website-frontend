import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitPracticeResult } from '../api/practiceApi';

const PASSAGES = [
  "The quick brown fox jumps over the lazy dog. It is a pangram, which means it uses every letter of the alphabet. Typing pangrams is a good way to practice your typing skills.",
  "In the middle of difficulty lies opportunity. Einstein said this to remind us that challenges are often the gateway to new discoveries and personal growth. Embrace the struggle.",
  "To be or not to be, that is the question. Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Winston Churchill understood that resilience is key to overcoming life's obstacles.",
  "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it."
];

const Practice = () => {
  const navigate = useNavigate();
  const [passage, setPassage] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Select a random passage
    const randomIndex = Math.floor(Math.random() * PASSAGES.length);
    setPassage(PASSAGES[randomIndex]);
    // Focus input on mount
    if(inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishSession();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const calculateStats = (currentInput) => {
    const wordsTyped = currentInput.trim().split(/\s+/).length;
    let errorCount = 0;
    const passageChars = passage.split('');
    const inputChars = currentInput.split('');
    
    inputChars.forEach((char, index) => {
      if (char !== passageChars[index]) {
        errorCount++;
      }
    });

    // Accuracy
    const correctChars = inputChars.length - errorCount;
    const acc = inputChars.length > 0 ? (correctChars / inputChars.length) * 100 : 100;

    // WPM (Gross WPM: (all typed entries / 5) / time in minutes)
    // Time elapsed in minutes
    const timeElapsed = (60 - timeLeft) / 60; 
    // Avoid division by zero
    const calculatedWpm = timeElapsed > 0 ? Math.round((currentInput.length / 5) / timeElapsed) : 0;

    setErrors(errorCount);
    setAccuracy(Math.round(acc));
    setWpm(calculatedWpm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setInput(value);
    calculateStats(value);

    // Auto-finish if completed
    if (value.length >= passage.length) {
      finishSession(value);
    }
  };

  const finishSession = async (finalInput = input) => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    // Final stats calculation
    const timeSpent = 60 - timeLeft;
    const wordsTyped = finalInput.trim().split(/\s+/).length;
    let errorCount = 0;
    const passageChars = passage.split('');
    const inputChars = finalInput.split('');
    
    inputChars.forEach((char, index) => {
      if (char !== passageChars[index]) {
        errorCount++;
      }
    });
    
    const correctChars = inputChars.length - errorCount;
    const acc = inputChars.length > 0 ? (correctChars / inputChars.length) * 100 : 100;
    const finalWpm = timeSpent > 0 ? Math.round((finalInput.length / 5) / (timeSpent / 60)) : 0;

    const sessionData = {
      textId: "random-passage", // Placeholder
      textContent: passage,
      duration: timeSpent === 0 ? 1 : timeSpent, // Minimum 1 sec
      wpm: finalWpm,
      accuracy: Math.round(acc),
      errorCount,
      errorDetails: [] 
    };

    try {
      await submitPracticeResult(sessionData);
      navigate('/results', { state: sessionData });
    } catch (error) {
      console.error("Failed to submit results", error);
      // Still navigate to results to show local stats? 
      // Or show error. For now, navigate.
      navigate('/results', { state: sessionData });
    }
  };

  return (
    <div className="flex h-full w-full bg-background overflow-hidden relative">
      {/* Timer Overlay/Display */}
      <div className="absolute top-4 right-4 z-10 bg-card p-2 rounded-lg shadow border border-border">
        <span className={`text-xl font-bold font-mono ${timeLeft < 10 ? 'text-destructive' : 'text-primary'}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Left Section: Passage */}
      <div className="w-1/2 h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start border-r border-border bg-muted/30 select-none">
        <h2 className="text-2xl font-bold mb-6 text-foreground/80">Passage to Type</h2>
        <div className="text-lg md:text-xl lg:text-2xl leading-relaxed font-serif text-muted-foreground">
          {passage.split('').map((char, index) => {
            let colorClass = "";
            const inputChar = input[index];
            
            if (inputChar === undefined) {
              colorClass = "text-muted-foreground"; // Not typed yet
            } else if (inputChar === char) {
              colorClass = "text-primary font-medium"; // Correct
            } else {
              colorClass = "text-destructive bg-destructive/10"; // Incorrect
            }

            return (
              <span key={index} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Right Section: Typing Area */}
      <div className="w-1/2 h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center bg-background">
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          className="w-full h-2/3 p-6 text-lg md:text-xl bg-card border border-border rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-mono leading-relaxed"
          spellCheck="false"
          disabled={timeLeft === 0}
        />
        
        <div className="mt-8 flex gap-8">
            <button 
                onClick={() => finishSession()} 
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium cursor-pointer"
            >
                Submit
            </button>
             <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium cursor-pointer"
            >
                Reset
            </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;