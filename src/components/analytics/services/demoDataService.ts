import { supabase } from '@/integrations/supabase/client';

export const createAnalyticsDemoData = async () => {
  try {
    console.log('🚀 Creating analytics demo data...');
    
    // First, get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication required to create demo data:', userError);
      return { success: false, error: 'Authentication required' };
    }

    console.log('✅ Authenticated user ID:', user.id);

    // Always target the "default" opportunity for demo data
    const { data: defaultOpportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('opportunity_id, theme_id, subdomain')
      .eq('user_id', user.id)
      .eq('opportunity_id', 'default')
      .eq('status', 'active')
      .single();

    if (oppError) {
      console.error('Error fetching default opportunity:', oppError);
      return { success: false, error: 'Failed to fetch default opportunity' };
    }

    if (!defaultOpportunity) {
      console.log('No default opportunity found for user');
      return { success: false, error: 'No default opportunity found. Please ensure you have a default opportunity.' };
    }

    console.log('✅ Found default opportunity for user:', defaultOpportunity);

    const opportunityId = defaultOpportunity.opportunity_id;
    const themeId = defaultOpportunity.theme_id;
    const subdomain = defaultOpportunity.subdomain;

    console.log('📊 Creating demo data for default opportunity:', { opportunityId, themeId, subdomain });
    
    // CRITICAL FIX: Calculate date range dynamically to include current date
    const today = new Date();
    const startDate = new Date(today);
    
    // IMPORTANT: Generate data from 90 days ago to TODAY (not some arbitrary cutoff)
    startDate.setDate(today.getDate() - 89); // 89 days ago + today = 90 days total
    
    // Reset time to start of day for consistent date handling
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);
    
    console.log('📅 CRITICAL: Dynamic date range for demo data:');
    console.log('  Start date (90 days ago):', startDate.toISOString().split('T')[0]);
    console.log('  End date (TODAY):', endDate.toISOString().split('T')[0]);
    console.log('  Current date for verification:', new Date().toISOString().split('T')[0]);
    console.log('  Total days to generate:', 90);
    
    // Verify we're generating data through June 2025
    if (endDate.getFullYear() === 2025 && endDate.getMonth() >= 4) { // May is month 4
      console.log('✅ CONFIRMED: Will generate data through', endDate.toISOString().split('T')[0], '(includes May/June 2025)');
    } else {
      console.warn('⚠️ WARNING: End date does not reach May/June 2025:', endDate.toISOString().split('T')[0]);
    }
    
    const demoEvents = [];
    
    // Generate realistic analytics events for exactly 90 days (including today)
    for (let i = 0; i < 90; i++) {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + i);
      
      // Ensure we're creating events for the correct date
      const dateString = eventDate.toISOString().split('T')[0];
      console.log(`📆 Generating events for day ${i + 1}/90: ${dateString}`);
      
      // VALIDATION: Ensure we're actually generating May/June data
      if (dateString.startsWith('2025-05') || dateString.startsWith('2025-06')) {
        console.log(`🎯 CRITICAL: Generating ${dateString} data (May/June 2025)`);
      }
      
      // Create a realistic number of unique sessions for this day (1-4 sessions)
      const uniqueSessionsForDay = Math.floor(Math.random() * 4) + 1;
      const sessionIds = [];
      
      // Generate unique session IDs for this day
      for (let s = 0; s < uniqueSessionsForDay; s++) {
        sessionIds.push(`session_${eventDate.getTime()}_${s}_${Math.random().toString(36).substr(2, 9)}`);
      }
      
      // Page views - ensure more page views than sessions (2-6 page views per session)
      const pageViewsPerSession = Math.floor(Math.random() * 5) + 2; // 2-6 page views per session
      const totalPageViews = uniqueSessionsForDay * pageViewsPerSession;
      
      for (let j = 0; j < totalPageViews; j++) {
        const sessionIndex = j % uniqueSessionsForDay; // Distribute evenly across sessions
        const sessionId = sessionIds[sessionIndex];
        
        // Create a more realistic timestamp within the day
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        eventDateTime.setSeconds(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'page_view',
          event_data: {
            device_type: Math.random() > 0.7 ? 'mobile' : 'desktop',
            language: Math.random() > 0.8 ? 'sv' : 'en',
            viewport_width: Math.random() > 0.7 ? 375 : 1920,
            viewport_height: Math.random() > 0.7 ? 667 : 1080
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: Math.random() > 0.5 ? 'https://google.com' : '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // Chat events - distribute across sessions with realistic timestamps
      const chatStarts = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < chatStarts; j++) {
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'chat_started',
          event_data: {
            source: Math.random() > 0.5 ? 'hero' : 'floating_button'
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // Chat prompts - distribute across sessions with realistic timestamps
      const chatPrompts = Math.floor(Math.random() * 6) + 2;
      for (let j = 0; j < chatPrompts; j++) {
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'chat_prompt',
          event_data: {
            prompt_length: Math.floor(Math.random() * 100) + 20,
            prompt_preview: 'What are your skills in...'
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // Button clicks - distribute across sessions with realistic timestamps
      const buttonClicks = Math.floor(Math.random() * 8) + 3;
      for (let j = 0; j < buttonClicks; j++) {
        const buttonNames = ['Contact Me', 'Download CV', 'GitHub', 'LinkedIn', 'Start Chat'];
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'button_click',
          event_data: {
            button_name: buttonNames[Math.floor(Math.random() * buttonNames.length)],
            context: 'hero_section'
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // Section views - distribute across sessions with realistic timestamps
      const sectionViews = Math.floor(Math.random() * 4) + 2;
      for (let j = 0; j < sectionViews; j++) {
        const sections = ['hero', 'about', 'skills', 'experience', 'contact'];
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'section_view',
          event_data: {
            section_id: sections[Math.floor(Math.random() * sections.length)]
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // External link clicks - occasionally distribute across sessions with realistic timestamps
      if (Math.random() > 0.5) {
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'external_link_click',
          event_data: {
            platform: Math.random() > 0.5 ? 'github' : 'linkedin',
            context: 'header'
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
      
      // Email sent events - occasionally distribute across sessions with realistic timestamps
      if (Math.random() > 0.7) {
        const sessionId = sessionIds[Math.floor(Math.random() * sessionIds.length)];
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(Math.floor(Math.random() * 24));
        eventDateTime.setMinutes(Math.floor(Math.random() * 60));
        
        demoEvents.push({
          event_type: 'email_sent',
          event_data: {
            inquiry_type: Math.random() > 0.5 ? 'job_opportunity' : 'collaboration'
          },
          page_url: `https://${subdomain}.example.com/`,
          referrer: '',
          session_id: sessionId,
          user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          opportunity_id: opportunityId,
          theme_id: themeId,
          user_id: user.id,
          created_at: eventDateTime.toISOString()
        });
      }
    }
    
    // Sort events by date to ensure proper chronological order
    demoEvents.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    // CRITICAL VALIDATION: Log the date range of generated events
    const firstEvent = demoEvents[0];
    const lastEvent = demoEvents[demoEvents.length - 1];
    console.log('📈 CRITICAL VALIDATION - Generated events date range:');
    console.log('  First event date:', firstEvent?.created_at?.split('T')[0]);
    console.log('  Last event date:', lastEvent?.created_at?.split('T')[0]);
    console.log('  Total events generated:', demoEvents.length);
    
    // Verify we have events spanning the full 90 days INCLUDING May/June 2025
    const eventDates = new Set(demoEvents.map(e => e.created_at.split('T')[0]));
    console.log('  Unique dates with events:', eventDates.size);
    console.log('  Expected unique dates: 90');
    
    // CRITICAL CHECK: Verify May/June 2025 data generation
    const mayEvents = demoEvents.filter(e => e.created_at.startsWith('2025-05'));
    const juneEvents = demoEvents.filter(e => e.created_at.startsWith('2025-06'));
    console.log('🎯 CRITICAL VERIFICATION:');
    console.log('  May 2025 events generated:', mayEvents.length);
    console.log('  June 2025 events generated:', juneEvents.length);
    
    if (mayEvents.length === 0 && juneEvents.length === 0) {
      console.error('❌ CRITICAL ERROR: No May/June 2025 events generated!');
      console.error('This suggests the date calculation is wrong or the current date is before May 2025');
    } else {
      console.log('✅ SUCCESS: May/June 2025 events successfully generated');
    }
    
    if (eventDates.size < 90) {
      console.warn('⚠️ WARNING: Generated events do not span all 90 days!');
    }
    
    console.log(`📥 Inserting ${demoEvents.length} demo analytics events for default opportunity...`);
    
    // Insert all events in batches to avoid hitting limits
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < demoEvents.length; i += batchSize) {
      const batch = demoEvents.slice(i, i + batchSize);
      console.log(`⏳ Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(demoEvents.length/batchSize)} (${batch.length} events)...`);
      
      const { error } = await supabase
        .from('analytics_events')
        .insert(batch);
        
      if (error) {
        console.error('❌ Error inserting analytics batch:', error);
        throw error;
      }
      
      totalInserted += batch.length;
    }
    
    console.log(`✅ Analytics demo data created successfully: ${totalInserted} events across 90 days`);
    return { success: true, count: totalInserted };
  } catch (error) {
    console.error('❌ Failed to create analytics demo data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const clearExistingAnalytics = async (userId?: string) => {
  try {
    console.log('Clearing analytics data...');
    
    // SECURITY: Require authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Authentication required to clear analytics data:', userError);
      return { success: false, error: 'Authentication required' };
    }

    const actualUserId = userId || user.id;
    console.log('Authenticated user ID for clearing:', actualUserId);
    
    // Security check: ensure user can only clear their own data
    if (actualUserId !== user.id) {
      console.error('User attempting to clear data for different user');
      return { success: false, error: 'Can only clear your own analytics data' };
    }
    
    // Always clear analytics data only for the "default" opportunity to match creation logic
    console.log('Checking existing analytics records for default opportunity...');
    const { count: existingCount, error: countError } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', actualUserId)
      .eq('opportunity_id', 'default');
    
    if (countError) {
      console.error('Error counting analytics data:', countError);
      return { success: false, error: countError.message };
    }
    
    console.log(`Found ${existingCount || 0} existing analytics records for default opportunity`);
    
    if (!existingCount || existingCount === 0) {
      console.log('No analytics data found to clear for default opportunity');
      return { success: true, cleared: 0 };
    }
    
    // Clear analytics data for the authenticated user's default opportunity only
    console.log('Attempting to clear analytics data for default opportunity...');
    
    const { error: deleteError, count } = await supabase
      .from('analytics_events')
      .delete({ count: 'exact' })
      .eq('user_id', actualUserId)
      .eq('opportunity_id', 'default');
    
    if (deleteError) {
      console.error('Error clearing analytics data:', deleteError);
      return { success: false, error: deleteError.message };
    }
    
    console.log(`✅ Cleared ${count || 0} analytics records for default opportunity`);
    return { success: true, cleared: count || 0 };
    
  } catch (error) {
    console.error('Failed to clear analytics data:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
