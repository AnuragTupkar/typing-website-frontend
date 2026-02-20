import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { submitPracticeResult } from '../api/practiceApi';
import { generatePassage } from '../utils/textGenerator';

const ALL_SUBJECTS = [
  { id: 'english_30', label: 'English 30 WPM', wpm: 30, lang: 'english' },
  { id: 'english_40', label: 'English 40 WPM', wpm: 40, lang: 'english' },
  { id: 'english_50', label: 'English 50 WPM', wpm: 50, lang: 'english' },
  { id: 'marathi_30', label: 'Marathi 30 WPM', wpm: 30, lang: 'marathi' },
  { id: 'marathi_40', label: 'Marathi 40 WPM', wpm: 40, lang: 'marathi' },
  { id: 'hindi_30', label: 'Hindi 30 WPM', wpm: 30, lang: 'hindi' },
  { id: 'hindi_40', label: 'Hindi 40 WPM', wpm: 40, lang: 'hindi' }
];

const Practice = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  // Filter subjects: admin sees all, students see only their enrolled courses
  const availableSubjects = isAdmin
    ? ALL_SUBJECTS
    : ALL_SUBJECTS.filter(s => (user?.selectedCourses || []).includes(s.id));

  const [selectedSubject, setSelectedSubject] = useState('');
  const [passage, setPassage] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(420);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Set default subject
  useEffect(() => {
    if (availableSubjects.length > 0 && !selectedSubject) {
      setSelectedSubject(availableSubjects[0].id);
    }
  }, [availableSubjects]);

  // Get current subject's WPM
  const currentSubject = ALL_SUBJECTS.find(s => s.id === selectedSubject);
  const targetWpm = currentSubject?.wpm || 30;

  useEffect(() => {
    if (!selectedSubject) return;
    // Generate passage: wordCount = wpm * 7
    const wordCount = targetWpm * 7;
    const lang = currentSubject?.lang || 'english';
    const newPassage = generatePassage(wordCount, lang);
    setPassage(newPassage);
    
    // Reset session
    setInput("");
    setTimeLeft(420); // 7 minutes
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    if(timerRef.current) clearInterval(timerRef.current);
    
    if(inputRef.current) inputRef.current.focus();
  }, [selectedSubject]);

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
    let errorCount = 0;
    const passageChars = passage.split('');
    const inputChars = currentInput.split('');
    
    inputChars.forEach((char, index) => {
      if (char !== passageChars[index]) {
        errorCount++;
      }
    });

    const correctChars = inputChars.length - errorCount;
    const acc = inputChars.length > 0 ? (correctChars / inputChars.length) * 100 : 100;
    const timeElapsed = (420 - timeLeft) / 60; 
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

    if (value.length >= passage.length) {
      finishSession(value);
    }
  };

  const finishSession = async (finalInput = input) => {
    setIsActive(false);
    clearInterval(timerRef.current);
    
    const timeSpent = 420 - timeLeft;
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

    // ── Marks calculation ──
    // Word-level comparison: 40 marks total, -0.5 per wrong word, -0.5 per missing word
    const passageWords = passage.trim().split(/\s+/);
    const inputWords = finalInput.trim().split(/\s+/).filter(w => w.length > 0);
    let wrongWords = 0;
    let missingWords = 0;

    // Compare word by word
    for (let i = 0; i < passageWords.length; i++) {
      if (i >= inputWords.length) {
        missingWords++;
      } else if (inputWords[i] !== passageWords[i]) {
        wrongWords++;
      }
    }

    const totalDeductions = (wrongWords + missingWords) * 0.5;
    const marks = Math.max(0, 40 - totalDeductions);

    const sessionData = {
      textId: selectedSubject,
      subjectId: selectedSubject,
      subjectLabel: currentSubject?.label || 'Practice',
      textContent: passage,
      typedContent: finalInput,
      duration: timeSpent === 0 ? 1 : timeSpent,
      wpm: finalWpm,
      accuracy: Math.round(acc),
      errorCount,
      wrongWords,
      missingWords,
      marks,
      totalMarks: 40,
      errorDetails: [] 
    };

    try {
      await submitPracticeResult(sessionData);
      navigate('/results', { state: sessionData });
    } catch (error) {
      console.error("Failed to submit results", error);
      navigate('/results', { state: sessionData });
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card shrink-0">
        {/* Left: Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Center: Subject selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Select Subject:</label>
          {availableSubjects.length === 0 ? (
            <span className="text-sm text-destructive">No courses enrolled</span>
          ) : (
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {availableSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Right: Timer */}
        <div className="bg-muted px-4 py-1.5 rounded-lg">
          <span className={`text-xl font-bold font-mono ${timeLeft < 60 ? 'text-destructive' : 'text-primary'}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Main Content: Two Panels ── */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Passage */}
        <div className="w-1/2 h-full border-r border-border bg-muted/30 select-none flex flex-col">
          <div className="px-6 py-3 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Passage</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 text-base leading-relaxed font-serif text-muted-foreground">
            {passage.split('').map((char, index) => {
              let colorClass = "";
              const inputChar = input[index];
              
              if (inputChar === undefined) {
                colorClass = "text-muted-foreground";
              } else if (inputChar === char) {
                colorClass = "text-primary font-medium";
              } else {
                colorClass = "text-destructive bg-destructive/10";
              }

              return (
                <span key={index} className={colorClass}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Right: Typing Area */}
        <div className="w-1/2 h-full flex flex-col bg-background">
          <div className="px-6 py-3 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Type Here</h2>
          </div>
          <div className="flex-1 p-4 min-h-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="w-full h-full p-4 text-base bg-card border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-mono leading-relaxed"
              spellCheck="false"
              disabled={timeLeft === 0}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-border bg-card shrink-0">
        <button 
          onClick={() => finishSession()} 
          className="px-8 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium cursor-pointer text-sm"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Practice;