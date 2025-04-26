
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { analyzeUrl } from '@/utils/urlAnalyzer';
import { cn } from '@/lib/utils';

interface UrlFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlForm = ({ onAnalyze, isLoading }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [quickCheck, setQuickCheck] = useState<{score: number, valid: boolean} | null>(null);
  
  // Real-time validation with debounce
  useEffect(() => {
    if (!url.trim()) {
      setQuickCheck(null);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      setIsValidating(true);
      try {
        // Quick preliminary analysis
        const prelimAnalysis = analyzeUrl(url);
        setQuickCheck({
          score: prelimAnalysis.score,
          valid: true
        });
      } catch (error) {
        setQuickCheck({
          score: 0,
          valid: false
        });
      } finally {
        setIsValidating(false);
      }
    }, 600);
    
    return () => clearTimeout(timeoutId);
  }, [url]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };
  
  const getUrlStatusColor = () => {
    if (!quickCheck) return '';
    if (!quickCheck.valid) return 'border-red-500';
    if (quickCheck.score >= 80) return 'border-green-500';
    if (quickCheck.score >= 40) return 'border-yellow-500';
    return 'border-red-500';
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto animate-fade-in">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="url-input" className="text-lg font-medium">
              Enter URL to analyze
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  id="url-input"
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={cn(
                    "pr-10 transition-all duration-300", 
                    url.trim() && getUrlStatusColor()
                  )}
                  required
                />
                {isValidating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  </div>
                )}
                {!isValidating && quickCheck && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {quickCheck.valid ? (
                      quickCheck.score >= 80 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      )
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                className="bg-primary transition-all hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                    Analyzing...
                  </>
                ) : (
                  'Analyze URL'
                )}
              </Button>
            </div>
            
            {quickCheck && url.trim() && !isValidating && (
              <div className="mt-2 text-xs animate-fade-in">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    quickCheck.score >= 80 ? "bg-green-100 text-green-800" : 
                    quickCheck.score >= 40 ? "bg-yellow-100 text-yellow-800" : 
                    "bg-red-100 text-red-800"
                  )}
                >
                  {quickCheck.score >= 80 ? "Likely Safe" : 
                   quickCheck.score >= 40 ? "Potentially Suspicious" : 
                   "Likely Dangerous"}
                </Badge>
                <span className="ml-2 text-muted-foreground">
                  {quickCheck.score >= 80 ? "This URL appears to be safe" : 
                   quickCheck.score >= 40 ? "This URL has some suspicious elements" : 
                   "This URL has multiple phishing indicators"}
                </span>
              </div>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            Example URLs to test: 
            <button 
              type="button"
              onClick={() => setUrl('secure-login-paypal.com-verify.info')}
              className="ml-1 text-primary hover:underline"
            >
              secure-login-paypal.com-verify.info
            </button>
            <span className="mx-1">|</span>
            <button 
              type="button"
              onClick={() => setUrl('https://google.com')}
              className="text-primary hover:underline"
            >
              https://google.com
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UrlForm;
