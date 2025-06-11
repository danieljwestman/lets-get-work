import { supabase } from '@/integrations/supabase/client';

export const fetchOpportunityData = async (
  subdomain: string,
  controller: AbortController,
  requestId: string
) => {
  console.log('🔧 OPPORTUNITY SERVICE: Fetching opportunity for subdomain:', subdomain, 'RequestID:', requestId);

  // Check if user is authenticated to determine which function to use
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session?.user;
  
  console.log('🔧 OPPORTUNITY SERVICE: User authenticated:', isAuthenticated, 'RequestID:', requestId);

  let opportunityData;
  let opportunityError;

  if (isAuthenticated) {
    // Use direct query for authenticated users - include ALL statuses for ownership validation
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, opportunity_id, name, subdomain, theme_id, company_name, target_role, status, user_id, is_passcode_protected, access_passcode')
      .eq('subdomain', subdomain)
      .abortSignal(controller.signal)
      .limit(1);
    
    opportunityData = data;
    opportunityError = error;

    // If opportunity found, validate access for unpublished opportunities
    if (opportunityData && opportunityData.length > 0) {
      const opportunity = opportunityData[0];
      
      // If opportunity is unpublished, ensure the user is the owner
      if (opportunity.status === 'unpublished' && opportunity.user_id !== session.user.id) {
        console.log('🔧 OPPORTUNITY SERVICE: Unpublished opportunity access denied - not owner:', {
          opportunityUserId: opportunity.user_id,
          sessionUserId: session.user.id,
          requestId
        });
        // Treat as not found for non-owners
        opportunityData = [];
      } else {
        console.log('🔧 OPPORTUNITY SERVICE: Opportunity access granted:', {
          status: opportunity.status,
          isOwner: opportunity.user_id === session.user.id,
          requestId
        });
      }
    }
  } else {
    // Use the security definer function for public access - only published opportunities
    const { data, error } = await supabase
      .rpc('get_public_opportunity_with_id', { subdomain_param: subdomain })
      .abortSignal(controller.signal);
    
    opportunityData = data;
    opportunityError = error;
  }

  if (opportunityError) {
    console.error('🔧 OPPORTUNITY SERVICE: Supabase error:', opportunityError, 'RequestID:', requestId);
    throw opportunityError;
  }

  console.log('🔧 OPPORTUNITY SERVICE: Raw opportunity data:', opportunityData, 'RequestID:', requestId);
  return opportunityData;
};

export const fetchThemeData = async (
  themeId: string,
  controller: AbortController,
  requestId: string
) => {
  console.log('🔧 OPPORTUNITY SERVICE: Fetching theme for theme_id:', themeId, 'RequestId:', requestId);
  
  const { data: themeData, error: themeError } = await supabase
    .rpc('get_public_theme', { theme_id_param: themeId })
    .abortSignal(controller.signal);

  if (themeError) {
    console.error('🔧 OPPORTUNITY SERVICE: Theme fetch error:', themeError, 'RequestID:', requestId);
    throw themeError;
  }

  if (!themeData || themeData.length === 0) {
    console.log('🔧 OPPORTUNITY SERVICE: No theme found for theme_id:', themeId, 'RequestID:', requestId);
    throw new Error(`Theme not found for theme_id: ${themeId}`);
  }

  const theme = themeData[0];
  console.log('🔧 OPPORTUNITY SERVICE: Found theme:', {
    name: theme.name,
    theme_id: theme.theme_id,
    browser_title: theme.browser_title,
    requestId
  });

  return theme;
};

export const fetchOwnerProfile = async (
  userId: string,
  controller: AbortController,
  requestId: string
) => {
  console.log('🔧 OPPORTUNITY SERVICE: Fetching owner profile for user_id:', userId, 'RequestID:', requestId);
  
  try {
    // Use the new secure function that safely exposes only full_name to all users
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_public_profile_name', { user_id_param: userId })
      .abortSignal(controller.signal)
      .maybeSingle();

    console.log('🔧 OPPORTUNITY SERVICE: Profile query result using secure function:', {
      profileData,
      profileError,
      hasFullName: !!profileData?.full_name,
      fullName: profileData?.full_name,
      errorCode: profileError?.code,
      errorMessage: profileError?.message,
      requestId
    });

    if (profileError) {
      console.error('🔧 OPPORTUNITY SERVICE: Profile fetch error with secure function:', {
        error: profileError,
        code: profileError.code,
        message: profileError.message,
        hint: profileError.hint,
        details: profileError.details,
        requestId
      });
      return null;
    }

    if (!profileData) {
      console.log('🔧 OPPORTUNITY SERVICE: No profile found for user_id:', userId, 'RequestID:', requestId);
      return null;
    }

    console.log('🔧 OPPORTUNITY SERVICE: Successfully fetched owner profile using secure function:', {
      full_name: profileData?.full_name,
      requestId
    });
    return profileData;
  } catch (err) {
    console.error('🔧 OPPORTUNITY SERVICE: Exception during secure profile fetch:', {
      error: err,
      errorMessage: err instanceof Error ? err.message : 'Unknown error',
      userId,
      requestId
    });
    return null;
  }
};
