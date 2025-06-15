
export interface DebugInfo {
  environment: string;
  mainDomain: string;
  contactEmail: string;
  companyWebsite: string;
  defaultSenderName: string;
  currentRoute: string;
  userAgent: string;
  viewport: string;
}

export interface OpportunityDebugInfo {
  opportunityId: string;
  actualOpportunityId?: string;
  name: string;
  profileId: string;
  themeId: string;
  themeName: string;
  companyName?: string;
  targetRole?: string;
  status: string;
  userId?: string;
}
