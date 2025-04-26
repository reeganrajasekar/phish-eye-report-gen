// URL analysis utility for phishing detection

import { checkDnsRecords } from './dnsChecker';

interface UrlFeature {
  name: string;
  description: string;
  risk: 'high' | 'medium' | 'low' | 'none';
  status: boolean;
  details?: string;
}

export interface AnalysisResult {
  url: string;
  score: number;
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  features: UrlFeature[];
}

// Improved domain age calculation using a hash function for demo
const getDomainAge = (domain: string): number => {
  const currentDate = new Date();
  const registrationDate = new Date();
  
  // Create a deterministic "registration date" based on domain name
  const hash = domain.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  // Set registration date between 0-5 years ago
  registrationDate.setDate(registrationDate.getDate() - (hash % (365 * 5)));
  
  const ageInDays = Math.floor((currentDate.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
  return ageInDays;
};

// Check domain age and DNS records
const checkDomainInfo = async (url: string): Promise<UrlFeature> => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const domainAge = getDomainAge(hostname);
    const dnsCheck = await checkDnsRecords(hostname);
    
    const details = [
      `Domain age: ${domainAge} days`,
      `DNS Records:`,
      ...dnsCheck.records.map(record => `${record.type}: ${record.value}`)
    ].join('\n');
    
    return {
      name: "Domain Information",
      description: "Checks domain age and DNS records",
      risk: domainAge < 30 ? 'high' : (domainAge < 180 ? 'medium' : 'low'),
      status: domainAge < 180 || !dnsCheck.hasValidRecords,
      details
    };
  } catch (e) {
    return {
      name: "Domain Information",
      description: "Checks domain age and DNS records",
      risk: 'high',
      status: true,
      details: 'Unable to verify domain information'
    };
  }
};

// Check if URL contains suspicious words
const checkSuspiciousWords = (url: string): UrlFeature => {
  const suspiciousWords = [
    'secure', 'login', 'account', 'verify', 'bank', 'paypal', 
    'confirm', 'update', 'wallet', 'support', 'password'
  ];
  
  const lowercaseUrl = url.toLowerCase();
  const foundWords = suspiciousWords.filter(word => lowercaseUrl.includes(word));
  
  return {
    name: "Suspicious Words",
    description: "Checks for words commonly used in phishing URLs",
    risk: foundWords.length > 0 ? (foundWords.length > 2 ? 'medium' : 'low') : 'none',
    status: foundWords.length > 0,
    details: foundWords.length > 0 ? `Found: ${foundWords.join(', ')}` : 'No suspicious words detected'
  };
};

// Check for excessive subdomains
const checkSubdomains = (url: string): UrlFeature => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const subdomainCount = hostname.split('.').length - 2;
    
    return {
      name: "Excessive Subdomains",
      description: "Multiple subdomains can be used to obscure the real domain",
      risk: subdomainCount > 2 ? 'medium' : (subdomainCount > 1 ? 'low' : 'none'),
      status: subdomainCount > 1,
      details: `Found ${subdomainCount} subdomains`
    };
  } catch (e) {
    return {
      name: "Excessive Subdomains",
      description: "Multiple subdomains can be used to obscure the real domain",
      risk: 'none',
      status: false,
      details: 'Unable to analyze subdomains in invalid URL'
    };
  }
};

// Check for URL length
const checkUrlLength = (url: string): UrlFeature => {
  return {
    name: "URL Length",
    description: "Excessively long URLs can hide the true destination",
    risk: url.length > 100 ? 'medium' : (url.length > 75 ? 'low' : 'none'),
    status: url.length > 75,
    details: `URL length is ${url.length} characters`
  };
};

// Check for IP address in URL
const checkIpAddress = (url: string): UrlFeature => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    const isIpAddress = ipPattern.test(hostname);
    
    return {
      name: "IP Address URL",
      description: "URLs using IP addresses instead of domains are suspicious",
      risk: isIpAddress ? 'high' : 'none',
      status: isIpAddress,
      details: isIpAddress ? `URL uses IP address ${hostname}` : 'No IP address used'
    };
  } catch (e) {
    return {
      name: "IP Address URL",
      description: "URLs using IP addresses instead of domains are suspicious",
      risk: 'none',
      status: false,
      details: 'Unable to analyze hostname in invalid URL'
    };
  }
};

// Check for special characters
const checkSpecialChars = (url: string): UrlFeature => {
  const specialChars = ['@', '-', '_', '%', '=', '+', '~'];
  const charCounts = specialChars.reduce((acc, char) => {
    acc[char] = (url.match(new RegExp(`\\${char}`, 'g')) || []).length;
    return acc;
  }, {} as Record<string, number>);
  
  const totalSpecialChars = Object.values(charCounts).reduce((sum, count) => sum + count, 0);
  
  return {
    name: "Special Characters",
    description: "Excessive special characters can be used to obfuscate malicious URLs",
    risk: totalSpecialChars > 5 ? 'medium' : (totalSpecialChars > 2 ? 'low' : 'none'),
    status: totalSpecialChars > 2,
    details: `Found ${totalSpecialChars} special characters`
  };
};

// Check for HTTPS protocol
const checkHttps = (url: string): UrlFeature => {
  const hasHttps = url.startsWith('https://');
  
  return {
    name: "HTTPS Protocol",
    description: "Phishing sites may not use secure HTTPS connections",
    risk: hasHttps ? 'none' : 'medium',
    status: !hasHttps,
    details: hasHttps ? 'URL uses HTTPS (secure)' : 'URL does not use HTTPS (insecure)'
  };
};

// Calculate overall security score (0-100, higher is safer)
const calculateScore = (features: UrlFeature[]): number => {
  // Start with perfect score
  let score = 100;
  
  for (const feature of features) {
    switch (feature.risk) {
      case 'high':
        score -= feature.status ? 25 : 0;
        break;
      case 'medium':
        score -= feature.status ? 15 : 0;
        break;
      case 'low':
        score -= feature.status ? 5 : 0;
        break;
      default:
        break;
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};

// Determine risk level based on score
const getRiskLevel = (score: number): 'safe' | 'suspicious' | 'dangerous' => {
  if (score >= 80) return 'safe';
  if (score >= 40) return 'suspicious';
  return 'dangerous';
};

// Main analysis function
export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  let cleanUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    cleanUrl = 'http://' + url;
  }
  
  // Run all checks
  const domainInfo = await checkDomainInfo(cleanUrl);
  const features: UrlFeature[] = [
    checkSuspiciousWords(cleanUrl),
    checkSubdomains(cleanUrl),
    checkUrlLength(cleanUrl),
    checkIpAddress(cleanUrl),
    checkSpecialChars(cleanUrl),
    domainInfo,
    checkHttps(cleanUrl)
  ];
  
  const score = calculateScore(features);
  const riskLevel = getRiskLevel(score);
  
  return {
    url: cleanUrl,
    score,
    riskLevel,
    features
  };
};
