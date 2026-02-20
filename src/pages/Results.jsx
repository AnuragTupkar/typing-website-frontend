import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-background">
                <h2 className="text-2xl font-bold mb-4 text-foreground">No results found</h2>
                <button 
                    onClick={() => navigate('/practice')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    Go to Practice
                </button>
            </div>
        );
    }

    const { 
        wpm, accuracy, errorCount, duration, 
        textContent, typedContent,
        wrongWords, missingWords, marks, totalMarks,
        subjectLabel
    } = state;

    // Word-level comparison for highlighting
    const passageWords = (textContent || '').trim().split(/\s+/);
    const typedWords = (typedContent || '').trim().split(/\s+/).filter(w => w.length > 0);

    const getWordComparison = () => {
        const result = [];
        const maxLen = Math.max(passageWords.length, typedWords.length);

        for (let i = 0; i < maxLen; i++) {
            const original = passageWords[i] || null;
            const typed = typedWords[i] || null;

            let status = 'correct';
            if (original && !typed) {
                status = 'missing'; // word not typed
            } else if (!original && typed) {
                status = 'extra'; // extra word typed (blue)
            } else if (original !== typed) {
                status = 'wrong'; // wrong word (red)
            }

            result.push({ original, typed, status });
        }
        return result;
    };

    const comparison = getWordComparison();
    const marksPercent = totalMarks > 0 ? (marks / totalMarks) * 100 : 0;

    return (
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shrink-0">
                <button
                    onClick={() => navigate('/practice')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Practice Again</span>
                </button>
                <h1 className="text-lg font-bold">{subjectLabel || 'Practice'} — Results</h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                    Go Home
                </button>
            </div>

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 px-4 py-3 bg-muted/30 border-b border-border shrink-0">
                <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-border">
                    <span className="text-3xl font-mono font-bold text-primary">{wpm}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">WPM</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-border">
                    <span className="text-3xl font-mono font-bold text-primary">{accuracy}%</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Accuracy</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-border">
                    <span className="text-3xl font-mono font-bold text-destructive">{errorCount}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Char Errors</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-border">
                    <span className={`text-3xl font-mono font-bold ${marksPercent >= 70 ? 'text-green-600' : marksPercent >= 40 ? 'text-yellow-600' : 'text-destructive'}`}>
                        {marks}/{totalMarks}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Marks</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card rounded-lg border border-border">
                    <span className="text-3xl font-mono font-bold text-foreground">{Math.round(duration)}s</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Time</span>
                </div>
            </div>

            {/* ── Deduction Details ── */}
            <div className="flex items-center gap-6 px-4 py-2 bg-muted/10 border-b border-border shrink-0 text-sm">
                <span className="text-muted-foreground">
                    Wrong words: <strong className="text-destructive">{wrongWords}</strong> (−{(wrongWords * 0.5).toFixed(1)})
                </span>
                <span className="text-muted-foreground">
                    Missing words: <strong className="text-destructive">{missingWords}</strong> (−{(missingWords * 0.5).toFixed(1)})
                </span>
                <span className="flex items-center gap-2 ml-auto">
                    <span className="inline-block w-3 h-3 rounded bg-red-200 border border-red-400"></span>
                    <span className="text-muted-foreground">Wrong</span>
                    <span className="inline-block w-3 h-3 rounded bg-blue-200 border border-blue-400 ml-2"></span>
                    <span className="text-muted-foreground">Extra</span>
                    <span className="inline-block w-3 h-3 rounded bg-yellow-200 border border-yellow-400 ml-2"></span>
                    <span className="text-muted-foreground">Missing</span>
                </span>
            </div>

            {/* ── Comparison Panels ── */}
            <div className="flex flex-1 min-h-0">
                {/* Left: Original Passage with highlights */}
                <div className="w-1/2 h-full border-r border-border bg-muted/30 flex flex-col">
                    <div className="px-6 py-3 border-b border-border shrink-0">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Original Passage</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-4 text-base leading-loose font-serif">
                        {comparison.map((item, i) => {
                            if (!item.original) return null;
                            let className = 'text-foreground';
                            let bg = '';
                            if (item.status === 'wrong') {
                                className = 'text-red-800';
                                bg = 'bg-red-100 border-b-2 border-red-400';
                            } else if (item.status === 'missing') {
                                className = 'text-yellow-800';
                                bg = 'bg-yellow-100 border-b-2 border-yellow-400';
                            } else {
                                className = 'text-green-800';
                            }
                            return (
                                <span key={i} className={`${className} ${bg} rounded-sm px-0.5 mr-1 inline`}>
                                    {item.original}{' '}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Typed text with highlights */}
                <div className="w-1/2 h-full flex flex-col bg-background">
                    <div className="px-6 py-3 border-b border-border shrink-0">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Typing</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-6 py-4 text-base leading-loose font-mono">
                        {comparison.map((item, i) => {
                            if (!item.typed) {
                                // Missing word — show placeholder
                                return (
                                    <span key={i} className="text-yellow-700 bg-yellow-100 border-b-2 border-yellow-400 rounded-sm px-1 mr-1 inline opacity-60 italic">
                                        ____{' '}
                                    </span>
                                );
                            }
                            let className = 'text-foreground';
                            let bg = '';
                            if (item.status === 'wrong') {
                                className = 'text-red-800';
                                bg = 'bg-red-100 border-b-2 border-red-400';
                            } else if (item.status === 'extra') {
                                className = 'text-blue-800';
                                bg = 'bg-blue-100 border-b-2 border-blue-400';
                            } else {
                                className = 'text-green-800';
                            }
                            return (
                                <span key={i} className={`${className} ${bg} rounded-sm px-0.5 mr-1 inline`}>
                                    {item.typed}{' '}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
