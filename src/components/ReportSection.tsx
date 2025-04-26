
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportSectionProps {
  title: string;
  risk: 'high' | 'medium' | 'low' | 'none';
  status: boolean;
  description: string;
  details?: string;
}

const ReportSection = ({ title, risk, status, description, details }: ReportSectionProps) => {
  // Color and label based on risk level
  const getRiskColor = () => {
    switch (risk) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'neutral';
      case 'none':
        return 'safe';
      default:
        return 'neutral';
    }
  };
  
  const getRiskLabel = () => {
    switch (risk) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      case 'none':
        return 'No Risk';
      default:
        return 'Unknown';
    }
  };
  
  const color = getRiskColor();
  
  return (
    <Card className={`border-l-4 ${status ? `border-l-${color}-DEFAULT` : 'border-l-safe-DEFAULT'}`}>
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status ? `bg-${color}-light text-${color}-DEFAULT` : 'bg-safe-light text-safe-DEFAULT'}`}>
            {getRiskLabel()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-sm text-muted-foreground mb-1">{description}</p>
        {details && (
          <p className={`text-sm font-medium ${status ? `text-${color}-DEFAULT` : 'text-safe-DEFAULT'}`}>
            {details}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSection;
