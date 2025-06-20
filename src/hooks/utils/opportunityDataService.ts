import { supabase } from '@/integrations/supabase/client';

export const fetchOpportunityByProfile = async (
  profileId: string,
  opportunityId: string,
  controller: AbortController,
  requestId: string
) => {
  console.log('🔧 OPPORTUNITY SERVICE: Fetching opportunity by profile:', {
    profileId,
    opportunityId,
    requestId
  });

  // Check if user is authenticated to determine which function to use
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session?.user;
  
  console.log('🔧 OPPORTUNITY SERVICE: User authenticated:', isAuthenticated, 'RequestID:', requestId);

  let opportunityData;
  let opportunityError;

  if (isAuthenticated) {
    // For authenticated users, use direct query with profile join
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        id, opportunity_id, name, theme_id, company_name, target_role, status, user_id, 
        is_passcode_protected, access_passcode,
        profiles!inner(profile_id)
      `)
      .eq('profiles.profile_id', profileId)
      .eq('opportunity_id', opportunityId)
      .abortSignal(controller.signal)
      .limit(1);
    
    opportunityData = data;
    opportunityError = error;

    // Validate access for unpublished opportunities
    if (opportunityData && opportunityData.length > 0) {
      const opportunity = opportunityData[0];
      
      if (opportunity.status === 'unpublished' && opportunity.user_id !== session.user.id) {
        console.log('🔧 OPPORTUNITY SERVICE: Unpublished opportunity access denied - not owner:', {
          opportunityUserId: opportunity.user_id,
          sessionUserId: session.user.id,
          requestId
        });
        opportunityData = [];
      }
    }
  } else {
    // For public access, use the security definer function
    const { data, error } = await supabase
      .rpc('get_public_opportunity_by_profile', { 
        profile_id_param: profileId, 
        opportunity_id_param: opportunityId 
      })
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

export const fetchOpportunityByUserId = async (
  userId: string,
  opportunityId: string,
  controller: AbortController,
  requestId: string
) => {
  console.log('🔧 OPPORTUNITY SERVICE: Fetching opportunity by user ID:', {
    userId,
    opportunityId,
    requestId
  });

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session?.user;
  
  console.log('🔧 OPPORTUNITY SERVICE: User authenticated:', isAuthenticated, 'RequestID:', requestId);

  let opportunityData;
  let opportunityError;

  if (isAuthenticated) {
    // For authenticated users, query directly by user_id
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        id, opportunity_id, name, theme_id, company_name, target_role, status, user_id, 
        is_passcode_protected, access_passcode
      `)
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .abortSignal(controller.signal)
      .limit(1);
    
    opportunityData = data;
    opportunityError = error;

    // Validate access for unpublished opportunities
    if (opportunityData && opportunityData.length > 0) {
      const opportunity = opportunityData[0];
      
      if (opportunity.status === 'unpublished' && opportunity.user_id !== session.user.id) {
        console.log('🔧 OPPORTUNITY SERVICE: Unpublished opportunity access denied - not owner:', {
          opportunityUserId: opportunity.user_id,
          sessionUserId: session.user.id,
          requestId
        });
        opportunityData = [];
      }
    }
  } else {
    // For public access, query only published opportunities
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        id, opportunity_id, name, theme_id, company_name, target_role, status, user_id, 
        is_passcode_protected, access_passcode
      `)
      .eq('user_id', userId)
      .eq('opportunity_id', opportunityId)
      .eq('status', 'published')
      .abortSignal(controller.signal)
      .limit(1);
    
    opportunityData = data;
    opportunityError = error;
  }

  if (opportunityError) {
    console.error('🔧 OPPORTUNITY SERVICE: Supabase error:', opportunityError, 'RequestID:', requestId);
    throw opportunityError;
  }

  console.log('🔧 OPPORTUNITY SERVICE: Raw opportunity data by user ID:', opportunityData, 'RequestID:', requestId);
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
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_public_profile_name', { user_id_param: userId })
      .abortSignal(controller.signal)
      .maybeSingle();

    console.log('🔧 OPPORTUNITY SERVICE: Profile query result:', {
      profileData,
      profileError,
      hasFullName: !!profileData?.full_name,
      fullName: profileData?.full_name,
      requestId
    });

    if (profileError) {
      console.error('🔧 OPPORTUNITY SERVICE: Profile fetch error:', profileError, 'RequestID:', requestId);
      return null;
    }

    return profileData;
  } catch (err) {
    console.error('🔧 OPPORTUNITY SERVICE: Exception during profile fetch:', err, 'RequestID:', requestId);
    return null;
  }
};

// Legacy function for backward compatibility
export const fetchOpportunityData = async (
  subdomain: string,
  controller: AbortController,
  requestId: string
) => {
  // For now, treat subdomain as profile_id and default opportunity
  return fetchOpportunityByProfile(subdomain, 'default', controller, requestId);
};
