
import { useEffect, useRef } from 'react';

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
        return 'safe';
      case 'suspicious':
        return 'warning';
      case 'dangerous':
        return 'danger';
      default:
        return 'neutral';
    }
  };
  
  // Calculate pointer rotation based on score (0-180 degrees)
  useEffect(() => {
    if (pointerRef.current && arcRef.current) {
      const rotation = Math.min(180, Math.max(0, (score / 100) * 180));
      pointerRef.current.style.transform = `rotate(${rotation}deg)`;
      
      // Set arc color
      const color = getColor();
      arcRef.current.style.borderColor = `transparent transparent var(--tw-colors-${color})`;
    }
  }, [score, riskLevel]);
  
  return (
    <div className="mt-4 mb-8">
      <div className="security-gauge">
        <div 
          ref={arcRef} 
          className="security-gauge-arc" 
          style={{ borderColor: `transparent transparent var(--tw-colors-${getColor()})` }}
        />
        <div ref={pointerRef} className="security-gauge-pointer" />
        <div className="security-gauge-value">
          {score}
        </div>
      </div>
      <div className="text-center mt-4">
        <h3 className={`text-xl font-bold text-${getColor()}-DEFAULT`}>
          {riskLevel === 'safe' ? 'Safe' : riskLevel === 'suspicious' ? 'Suspicious' : 'Dangerous'}
        </h3>
        <p className="text-muted-foreground">Security Score</p>
      </div>
    </div>
  );
};

export default SecurityScore;
