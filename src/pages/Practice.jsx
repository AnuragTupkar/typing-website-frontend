import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitPracticeResult } from '../api/practiceApi';
import { generatePassage } from '../utils/textGenerator';

const Practice = () => {
  const navigate = useNavigate();
  const [passage, setPassage] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(420);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [targetWpm, setTargetWpm] = useState(30);
  
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Generate passage based on targetWpm
    const wordCount = targetWpm * 7;
    const newPassage = generatePassage(wordCount);
    setPassage(newPassage);
    
    // Reset session
    setInput("");
    setTimeLeft(420); // 7 minutes
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    if(timerRef.current) clearInterval(timerRef.current);
    
    // Focus input
    if(inputRef.current) inputRef.current.focus();
  }, [targetWpm]);

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
    const timeElapsed = (420 - timeLeft) / 60; 
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
    const timeSpent = 420 - timeLeft;
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
        <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Left Section: Passage */}
      <div className="w-1/2 h-full p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start border-r border-border bg-muted/30 select-none">
        <div className="w-full flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground/80">Passage to Type</h2>
          <div className="flex items-center gap-2">
             <label className="text-sm font-medium text-muted-foreground">Target WPM:</label>
             <select 
               value={targetWpm}
               onChange={(e) => setTargetWpm(Number(e.target.value))}
               className="h-9 w-20 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
             >
               <option value={30}>30</option>
               <option value={40}>40</option>
               <option value={50}>50</option>
               <option value={60}>60</option>
             </select>
          </div>
        </div>
        <div className="w-full flex-1 overflow-y-auto pr-4 text-lg md:text-sm lg:text-lg leading-relaxed font-serif text-muted-foreground">
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