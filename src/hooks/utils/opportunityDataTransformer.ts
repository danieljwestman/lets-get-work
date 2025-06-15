import { OpportunityWithTheme } from '@/types/opportunity';
import { OpportunityStatusType } from '@/constants/opportunityStatuses';

// Helper function to safely parse JSON data
const parseThemeData = (data: any, defaultValue: any) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse theme data:', e);
      return defaultValue;
    }
  }
  return data || defaultValue;
};

// Helper function to map old status types to new ones
const mapStatusToNewType = (oldStatus: string): OpportunityStatusType => {
  switch (oldStatus) {
    case 'active':
      return 'published';
    case 'paused':
      return 'unpublished';
    case 'closed':
      return 'archived';
    case 'published':
    case 'unpublished':
    case 'archived':
      return oldStatus as OpportunityStatusType;
    default:
      console.warn('Unknown status type:', oldStatus, 'defaulting to unpublished');
      return 'unpublished'; // Default fallback
  }
};

export const transformOpportunityData = (
  opportunity: any,
  theme: any,
  requestId: string,
  ownerProfile?: { full_name: string; profile_id?: string } | null
): OpportunityWithTheme => {
  console.log('🔧 OPPORTUNITY TRANSFORM: Transforming opportunity data:', {
    opportunityId: opportunity.opportunity_id,
    actualId: opportunity.id,
    themeId: theme.theme_id,
    originalStatus: opportunity.status,
    isPasscodeProtected: opportunity.is_passcode_protected,
    hasPasscode: !!opportunity.access_passcode,
    ownerFullName: ownerProfile?.full_name,
    ownerProfileId: ownerProfile?.profile_id,
    requestId
  });

  const mappedStatus = mapStatusToNewType(opportunity.status);

  // Keep contact_person as the original database value - DO NOT override with owner's name
  const contactPerson = opportunity.contact_person || '';

  // Set owner_full_name from the owner's profile
  const ownerFullName = ownerProfile?.full_name || '';

  const transformedOpportunity: OpportunityWithTheme = {
    id: opportunity.id || opportunity.opportunity_id, // Use actual UUID id if available, fallback to opportunity_id
    opportunity_id: opportunity.opportunity_id,
    name: opportunity.name,
    profile_id: ownerProfile?.profile_id || '', // Set from owner profile
    theme_id: opportunity.theme_id,
    company_name: opportunity.company_name,
    contact_person: contactPerson,
    target_role: opportunity.target_role,
    notes: '',
    status: mappedStatus,
    user_id: opportunity.user_id || null,
    is_passcode_protected: opportunity.is_passcode_protected || false,
    owner_full_name: ownerFullName,
    // Only include the actual passcode if it's provided (for authenticated users or owners)
    access_passcode: opportunity.access_passcode || null,
    theme: {
      id: theme.theme_id,
      theme_id: theme.theme_id,
      name: theme.name,
      browser_title: theme.browser_title,
      branding: parseThemeData(theme.branding, {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        accentColor: '#0ea5e9',
        gradients: {
          hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        }
      }),
      content: parseThemeData(theme.content, {
        targetRole: 'Software Developer',
        industry: 'Technology',
        companySpecificSkills: [],
        showHeroCTAs: true
      }),
      danibot: parseThemeData(theme.danibot, {
        personality: 'professional',
        knowledgeBase: 'general',
        customGreeting: ''
      })
    }
  };

  console.log('✅ OPPORTUNITY TRANSFORM: Transformation completed:', {
    opportunity_id: transformedOpportunity.opportunity_id,
    actual_id: transformedOpportunity.id,
    theme_id: transformedOpportunity.theme.theme_id,
    profile_id: transformedOpportunity.profile_id,
    originalStatus: opportunity.status,
    mappedStatus: transformedOpportunity.status,
    is_passcode_protected: transformedOpportunity.is_passcode_protected,
    has_access_passcode: !!transformedOpportunity.access_passcode,
    contact_person: transformedOpportunity.contact_person,
    owner_full_name: transformedOpportunity.owner_full_name,
    requestId
  });

  return transformedOpportunity;
};
