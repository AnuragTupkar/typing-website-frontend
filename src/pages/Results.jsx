import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    // Fallback if no state is present (e.g. direct access)
    // In a real app, maybe fetch last session or redirect
    if (!state) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-background">
                <h2 className="text-2xl font-bold mb-4 text-foreground">No results found</h2>
                <button 
                    onClick={() => navigate('/practice')}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    Go to Practice
                </button>
            </div>
        );
    }

    const { wpm, accuracy, errorCount, duration } = state;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-background p-8">
            <div className="max-w-2xl w-full bg-card border border-border rounded-xl shadow-lg p-8 md:p-12 animate-in fade-in zoom-in duration-300">
                <h1 className="text-4xl font-bold text-center mb-12 text-foreground">Practice Results</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="flex flex-col items-center p-6 bg-muted/50 rounded-lg">
                        <span className="text-5xl font-mono font-bold text-primary mb-2">{wpm}</span>
                        <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">WPM</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-muted/50 rounded-lg">
                        <span className="text-5xl font-mono font-bold text-primary mb-2">{accuracy}%</span>
                        <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Accuracy</span>
                    </div>
                    
                    <div className="flex flex-col items-center p-6 bg-muted/50 rounded-lg">
                        <span className="text-5xl font-mono font-bold text-destructive mb-2">{errorCount}</span>
                        <span className="text-sm uppercase tracking-wider text-muted-foreground font-semibold">Errors</span>
                    </div>
                </div>

                 <div className="text-center mb-12 text-muted-foreground">
                    <p>Time Taken: <span className="text-foreground font-mono font-medium">{Math.round(duration)}s</span></p>
                </div>

                <div className="flex justify-center gap-6">
                    <button 
                        onClick={() => navigate('/practice')}
                        className="px-8 py-3 bg-primary text-primary-foreground text-lg rounded-md hover:bg-primary/90 transition-all transform hover:scale-105 shadow-md font-medium cursor-pointer"
                    >
                        Practice Again
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-secondary text-secondary-foreground text-lg rounded-md hover:bg-secondary/80 transition-all font-medium cursor-pointer"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
