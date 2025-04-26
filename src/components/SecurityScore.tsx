
import { useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface SecurityScoreProps {
  score: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
}

const SecurityScore = ({ score, riskLevel }: SecurityScoreProps) => {
  const pointerRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  
  // Determine color based on risk level
  const getColor = () => {
    switch (riskLevel) {
      case 'safe':
        return 'bg-safe-DEFAULT';
      case 'suspicious':
        return 'bg-warning-DEFAULT';
      case 'dangerous':
        return 'bg-danger-DEFAULT';
      default:
        return 'bg-neutral-DEFAULT';
    }
  };

  const getGradient = () => {
    switch (riskLevel) {
      case 'safe':
        return 'from-safe-light to-safe-DEFAULT';
      case 'suspicious':
        return 'from-warning-light to-warning-DEFAULT';
      case 'dangerous':
        return 'from-danger-light to-danger-DEFAULT';
      default:
        return 'from-neutral-light to-neutral-DEFAULT';
    }
  };
  
  // Calculate pointer rotation based on score (0-180 degrees)
  useEffect(() => {
    if (pointerRef.current && arcRef.current) {
      const rotation = Math.min(180, Math.max(0, (score / 100) * 180));
      pointerRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, [score, riskLevel]);
  
  return (
    <div className="mt-4 mb-8 animate-fade-in">
      <div className={cn(
        "p-6 rounded-lg bg-gradient-to-br transition-all duration-500",
        getGradient()
      )}>
        <div className="security-gauge">
          <div ref={arcRef} className="security-gauge-arc" />
          <div 
            ref={pointerRef} 
            className={cn(
              "security-gauge-pointer transition-transform duration-700 ease-in-out",
              getColor()
            )} 
          />
          <div className="security-gauge-value text-white">
            {score}
          </div>
        </div>
        <div className="text-center mt-4">
          <h3 className="text-xl font-bold text-white animate-pulse-slow">
            {riskLevel === 'safe' ? 'Safe' : riskLevel === 'suspicious' ? 'Suspicious' : 'Dangerous'}
          </h3>
          <p className="text-white/80">Security Score</p>
          <Progress 
            value={score} 
            className={cn(
              "mt-4 h-2 transition-all duration-500",
              getColor()
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
