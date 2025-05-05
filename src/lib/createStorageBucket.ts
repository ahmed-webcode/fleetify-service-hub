
import { supabase } from '@/integrations/supabase/client';

export const createVehicleImageBucket = async () => {
  try {
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error checking for buckets:', listError);
      return false;
    }
    
    // If the vehicles bucket doesn't exist, create it
    if (!buckets.find(bucket => bucket.name === 'vehicles')) {
      const { error: createError } = await supabase.storage.createBucket('vehicles', {
        public: true,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB
      });
      
      if (createError) {
        console.error('Error creating vehicles bucket:', createError);
        return false;
      }
      
      console.log('Vehicles bucket created successfully');
      return true;
    }
    
    console.log('Vehicles bucket already exists');
    return true;
  } catch (err) {
    console.error('Unexpected error creating bucket:', err);
    return false;
  }
};
