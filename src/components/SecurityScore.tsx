
import { useEffect, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ShieldAlert, Shield } from 'lucide-react';

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
        return 'bg-green-500';
      case 'suspicious':
        return 'bg-yellow-500';
      case 'dangerous':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getGradient = () => {
    switch (riskLevel) {
      case 'safe':
        return 'from-green-400 to-green-600';
      case 'suspicious':
        return 'from-yellow-400 to-yellow-600';
      case 'dangerous':
        return 'from-red-400 to-red-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };
  
  const getIcon = () => {
    switch (riskLevel) {
      case 'safe':
        return <CheckCircle className="h-6 w-6" />;
      case 'suspicious':
        return <AlertCircle className="h-6 w-6" />;
      case 'dangerous':
        return <ShieldAlert className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
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
        "p-6 rounded-lg bg-gradient-to-br transition-all duration-500 shadow-lg",
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
          <div className="security-gauge-value text-white animate-pulse-slow">
            {score}
          </div>
        </div>
        <div className="text-center mt-4">
          <div className="flex items-center justify-center gap-2">
            <Badge className={cn(
              "py-1 px-3 text-white animate-pulse-slow",
              riskLevel === 'safe' ? 'bg-green-600' : 
              riskLevel === 'suspicious' ? 'bg-yellow-600' : 'bg-red-600'
            )}>
              {getIcon()}
              <span className="ml-1 text-sm">
                {riskLevel === 'safe' ? 'Safe' : 
                 riskLevel === 'suspicious' ? 'Suspicious' : 'Dangerous'}
              </span>
            </Badge>
          </div>
          <p className="text-white/80 mt-1">Security Score</p>
          <Progress 
            value={score} 
            className={cn(
              "mt-4 h-3 bg-white/30 transition-all duration-500 rounded-full",
              getColor()
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default SecurityScore;
