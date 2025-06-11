
-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  company_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  page_url TEXT,
  referrer TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_company_id ON analytics_events(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);

-- Create a view for analytics summary by company
CREATE OR REPLACE VIEW analytics_summary AS
SELECT 
  company_id,
  DATE(created_at) as date,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events 
GROUP BY company_id, DATE(created_at), event_type
ORDER BY date DESC, company_id;

-- RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow anonymous tracking inserts" ON analytics_events
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow reading own company data (you can customize this based on your auth needs)
CREATE POLICY "Allow reading analytics data" ON analytics_events
  FOR SELECT TO authenticated
  USING (true);
