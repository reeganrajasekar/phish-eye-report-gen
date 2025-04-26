
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ReportSectionProps {
  title: string;
  risk: 'high' | 'medium' | 'low' | 'none';
  status: boolean;
  description: string;
  details?: string;
}

const ReportSection = ({ title, risk, status, description, details }: ReportSectionProps) => {
  // Color mapping for different risk levels
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
  
  // Tailwind classes mapping for colors instead of template strings
  const getBorderClass = () => {
    if (!status) return 'border-l-green-500 hover:bg-green-50';
    
    switch (risk) {
      case 'high':
        return 'border-l-red-500 hover:bg-red-50';
      case 'medium':
        return 'border-l-orange-500 hover:bg-orange-50';
      case 'low':
        return 'border-l-yellow-500 hover:bg-yellow-50';
      case 'none':
        return 'border-l-green-500 hover:bg-green-50';
      default:
        return 'border-l-gray-500 hover:bg-gray-50';
    }
  };
  
  const getBadgeClass = () => {
    if (!status) return 'bg-green-100 text-green-800';
    
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'none':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTextClass = () => {
    if (!status) return 'text-green-600';
    
    switch (risk) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-yellow-600';
      case 'none':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <Card 
      className={cn(
        `border-l-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in`,
        getBorderClass()
      )}
    >
      <CardHeader className="py-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              `px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-300`,
              getBadgeClass()
            )}
          >
            {getRiskLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-sm text-muted-foreground mb-1">{description}</p>
        {details && (
          <p 
            className={cn(
              `text-sm font-medium transition-colors duration-300`,
              getTextClass()
            )}
          >
            {details}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportSection;
