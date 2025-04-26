import { useState } from 'react';
import UrlForm from '@/components/UrlForm';
import PhishingReport from '@/components/PhishingReport';
import { analyzeUrl, AnalysisResult } from '@/utils/urlAnalyzer';
import { Shield } from 'lucide-react';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const handleAnalyzeUrl = async (url: string) => {
    setIsLoading(true);
    
    try {
      // Add artificial delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyze the URL
      const analysisResult = await analyzeUrl(url);
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing URL:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary">
      <header className="py-6 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-10 w-10 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-center">PhishEye</h1>
          </div>
          <h2 className="text-xl text-center text-muted-foreground">
            Advanced Phishing URL Detection & Analysis
          </h2>
        </div>
      </header>
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <UrlForm onAnalyze={handleAnalyzeUrl} isLoading={isLoading} />
        </div>
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block rounded-full h-16 w-16 bg-primary/10 p-4 animate-pulse">
              <Shield className="h-8 w-8 text-primary animate-pulse-slow" />
            </div>
            <p className="mt-4 text-lg font-medium">Analyzing URL for phishing indicators...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        )}
        
        {!isLoading && result && (
          <PhishingReport result={result} />
        )}
        
        {!isLoading && !result && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Enter a URL above to analyze for potential phishing threats
            </p>
          </div>
        )}
      </main>
      
      <footer className="py-6 px-4 border-t">
        <div className="container max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>PhishEye - Advanced URL Analysis Tool</p>
          <p className="mt-1">
            This tool analyzes URLs for common phishing characteristics and provides a security assessment.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
