
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SecurityScore from './SecurityScore';
import ReportSection from './ReportSection';
import { AnalysisResult } from '@/utils/urlAnalyzer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PhishingReportProps {
  result: AnalysisResult;
}

const PhishingReport = ({ result }: PhishingReportProps) => {
  if (!result) return null;
  
  // Group features by risk level for better organization
  const highRiskFeatures = result.features.filter(f => f.risk === 'high' && f.status);
  const mediumRiskFeatures = result.features.filter(f => f.risk === 'medium' && f.status);
  const lowRiskFeatures = result.features.filter(f => f.risk === 'low' && f.status);
  const safeFeatures = result.features.filter(f => f.risk === 'none' || !f.status);
  
  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-center">Phishing Analysis Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold break-all">{result.url}</h2>
        </div>
        
        <SecurityScore score={result.score} riskLevel={result.riskLevel} />
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {result.riskLevel !== 'safe' && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Detected Issues</h3>
                <div className="space-y-3">
                  {highRiskFeatures.map((feature) => (
                    <ReportSection
                      key={feature.name}
                      title={feature.name}
                      risk={feature.risk}
                      status={feature.status}
                      description={feature.description}
                      details={feature.details}
                    />
                  ))}
                  {mediumRiskFeatures.map((feature) => (
                    <ReportSection
                      key={feature.name}
                      title={feature.name}
                      risk={feature.risk}
                      status={feature.status}
                      description={feature.description}
                      details={feature.details}
                    />
                  ))}
                  {lowRiskFeatures.map((feature) => (
                    <ReportSection
                      key={feature.name}
                      title={feature.name}
                      risk={feature.risk}
                      status={feature.status}
                      description={feature.description}
                      details={feature.details}
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold mb-3">All Checks</h3>
              <div className="space-y-3">
                {result.features.map((feature) => (
                  <ReportSection
                    key={feature.name}
                    title={feature.name}
                    risk={feature.risk}
                    status={feature.status}
                    description={feature.description}
                    details={feature.details}
                  />
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PhishingReport;
