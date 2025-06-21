
-- Update the opportunity_id from 'lovable_default' to 'lovable' in the opportunities table
UPDATE public.opportunities 
SET opportunity_id = 'lovable' 
WHERE opportunity_id = 'lovable_default';

-- Update any references in the messages table
UPDATE public.messages 
SET opportunity_id = 'lovable' 
WHERE opportunity_id = 'lovable_default';

-- Update any references in the analytics_events table
UPDATE public.analytics_events 
SET opportunity_id = 'lovable' 
WHERE opportunity_id = 'lovable_default';
