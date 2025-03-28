
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

// Type for location check result
type LocationCheckResult = {
  allowed: boolean;
  country: string;
  message: string;
  timezone?: string;
  error?: string;
};

export const useTimezone = () => {
  const [userTimezone, setUserTimezone] = useState<string>('');
  
  // Get the user's timezone from GeoRestriction data
  useEffect(() => {
    const getTimezone = async () => {
      // First check if we have cached location data
      const storedData = localStorage.getItem("geo-check-result");
      
      if (storedData) {
        try {
          const locationData = JSON.parse(storedData) as LocationCheckResult;
          
          if (locationData.timezone) {
            setUserTimezone(locationData.timezone);
            return;
          }
        } catch (error) {
          console.error("Error parsing stored location data:", error);
        }
      }
      
      // If we don't have timezone data, fetch it from the edge function
      try {
        const { data, error } = await supabase.functions.invoke("check-location");
        
        if (error) {
          throw new Error(error.message);
        }
        
        const locationData = data as LocationCheckResult;
        
        if (locationData.timezone) {
          setUserTimezone(locationData.timezone);
          
          // Update the stored data with timezone information
          localStorage.setItem("geo-check-result", JSON.stringify(locationData));
        } else {
          // Fallback to browser timezone
          setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
        }
      } catch (err) {
        console.error("Error fetching location data:", err);
        // Fallback to browser timezone
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      }
    };
    
    getTimezone();
  }, []);
  
  // Get current date in user's timezone
  const getCurrentDate = () => {
    // Create a date object for the current time
    const now = new Date();
    
    // If we have the user's timezone, use it to format the date
    if (userTimezone) {
      // Use the browser's built-in functionality to format the date in the user's timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: userTimezone
      });
      
      const parts = formatter.formatToParts(now);
      
      // Extract year, month, and day
      const year = parts.find(part => part.type === 'year')?.value || '';
      const month = parts.find(part => part.type === 'month')?.value || '';
      const day = parts.find(part => part.type === 'day')?.value || '';
      
      // Format as yyyy-MM-dd
      return `${year}-${month}-${day}`;
    }
    
    // Fallback to format without timezone
    return format(now, 'yyyy-MM-dd');
  };

  return {
    userTimezone,
    getCurrentDate
  };
};
