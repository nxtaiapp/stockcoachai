
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract client IP from request headers
    const forwarded = req.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || '0.0.0.0';
    
    console.log(`Checking location for IP: ${clientIp}`);
    
    // Skip actual check for localhost/development
    if (clientIp === '127.0.0.1' || clientIp === 'localhost' || clientIp.startsWith('192.168.') || clientIp.startsWith('10.')) {
      console.log('Development IP detected, allowing access');
      return new Response(JSON.stringify({ 
        allowed: true, 
        country: 'US',
        message: 'Development environment',
        timezone: 'America/Los_Angeles' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use ipapi.co for geolocation (free tier, limited requests)
    const ipResponse = await fetch(`https://ipapi.co/${clientIp}/json/`);
    const ipData = await ipResponse.json();
    
    console.log(`IP data:`, ipData);
    
    const isUSA = ipData.country_code === 'US';
    
    return new Response(JSON.stringify({
      allowed: isUSA,
      country: ipData.country_code || 'Unknown',
      message: isUSA ? 'Access allowed' : 'Access restricted to US users only',
      timezone: ipData.timezone || 'America/New_York'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error(`Error checking location:`, error);
    
    // In case of error, allow access by default to prevent blocking legitimate users
    return new Response(JSON.stringify({
      allowed: true,
      country: 'Unknown',
      message: 'Error during location check, access allowed by default',
      timezone: 'America/New_York', // Default timezone
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});
