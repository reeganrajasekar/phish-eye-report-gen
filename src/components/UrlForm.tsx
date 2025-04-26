
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface UrlFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlForm = ({ onAnalyze, isLoading }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="url-input" className="text-lg font-medium">
              Enter URL to analyze
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="url-input"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                className="bg-primary"
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
