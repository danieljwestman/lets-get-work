
export async function checkRateLimit(supabaseClient: any, ipAddress: string): Promise<{ allowed: boolean }> {
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute ago

  const { data: rateLimitData, error: rateLimitError } = await supabaseClient
    .from('rate_limit')
    .select('count')
    .eq('ip_address', ipAddress)
    .gte('timestamp', new Date(windowStart).toISOString());

  if (rateLimitError) {
    console.error('❌ Rate limit check error:', rateLimitError);
    throw new Error('Rate limit check failed');
  }

  const requestCount = rateLimitData?.reduce((sum, entry) => sum + entry.count, 0) || 0;

  if (requestCount > 5) {
    return { allowed: false };
  }

  // Update rate limit count
  const { error: updateError } = await supabaseClient
    .from('rate_limit')
    .insert({
      ip_address: ipAddress,
      timestamp: new Date().toISOString(),
      count: 1,
    });

  if (updateError) {
    console.error('❌ Rate limit update error:', updateError);
  }

  return { allowed: true };
}
