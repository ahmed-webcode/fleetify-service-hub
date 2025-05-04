
import { supabase } from "@/integrations/supabase/client";

export const createVehiclesStorageBucket = async () => {
  try {
    // Check if bucket exists first
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      throw listError;
    }
    
    // Check if vehicles bucket already exists
    const vehiclesBucketExists = existingBuckets?.some(bucket => bucket.name === 'vehicles');
    
    if (!vehiclesBucketExists) {
      // Create bucket if it doesn't exist
      const { data, error } = await supabase.storage.createBucket('vehicles', {
        public: true, // Make images publicly accessible
        fileSizeLimit: 2097152, // 2MB limit
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Vehicles storage bucket created:', data);
    } else {
      console.log('Vehicles storage bucket already exists');
    }
  } catch (error) {
    console.error('Error creating storage bucket:', error);
  }
};
