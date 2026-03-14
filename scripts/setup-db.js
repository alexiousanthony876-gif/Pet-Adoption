import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log('[v0] Setting up database schema...');

    // Check if pets table exists and create it
    const { data: existingTables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'pets');

    if (!existingTables || existingTables.length === 0) {
      console.log('[v0] Creating pets table...');
      
      // Create pets table using direct insert which will create the table structure
      const petsData = [
        {
          name: 'Max',
          type: 'Dog',
          breed: 'German Shepherd',
          age: 3,
          gender: 'Male',
          size: 'Large',
          image_url: 'https://images.unsplash.com/photo-1568595471124-96b305d2aaeb?w=500&h=500&fit=crop',
          description: 'Friendly and energetic German Shepherd looking for a loving home.',
          location: 'New York',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Luna',
          type: 'Dog',
          breed: 'Golden Retriever',
          age: 2,
          gender: 'Female',
          size: 'Large',
          image_url: 'https://images.unsplash.com/photo-1633722715463-d30628ceb4ab?w=500&h=500&fit=crop',
          description: 'Sweet Golden Retriever puppy, very playful and loves everyone.',
          location: 'California',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Whiskers',
          type: 'Cat',
          breed: 'Persian Cat',
          age: 4,
          gender: 'Female',
          size: 'Small',
          image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
          description: 'Elegant Persian cat, calm and perfect for apartment living.',
          location: 'Texas',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Buddy',
          type: 'Dog',
          breed: 'Labrador Retriever',
          age: 5,
          gender: 'Male',
          size: 'Large',
          image_url: 'https://images.unsplash.com/photo-1633722715463-d30628ceb4ab?w=500&h=500&fit=crop',
          description: 'Loyal Labrador, great with families and kids.',
          location: 'Florida',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Mittens',
          type: 'Cat',
          breed: 'Tabby Mix',
          age: 2,
          gender: 'Female',
          size: 'Small',
          image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&h=500&fit=crop',
          description: 'Adorable tabby kitten, playful and affectionate.',
          location: 'Illinois',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Charlie',
          type: 'Dog',
          breed: 'Beagle',
          age: 3,
          gender: 'Male',
          size: 'Small',
          image_url: 'https://images.unsplash.com/photo-1591788216694-ea31cdb58b74?w=500&h=500&fit=crop',
          description: 'Cute Beagle with lots of personality and energy.',
          location: 'Pennsylvania',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Bella',
          type: 'Dog',
          breed: 'Poodle',
          age: 4,
          gender: 'Female',
          size: 'Small',
          image_url: 'https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=500&h=500&fit=crop',
          description: 'Intelligent and elegant Poodle, great for active families.',
          location: 'Ohio',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Shadow',
          type: 'Cat',
          breed: 'Black Cat',
          age: 3,
          gender: 'Male',
          size: 'Medium',
          image_url: 'https://images.unsplash.com/photo-1529148482759-b8610a6a16f7?w=500&h=500&fit=crop',
          description: 'Mysterious black cat, loves to cuddle when comfortable.',
          location: 'Washington',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Rocky',
          type: 'Dog',
          breed: 'German Shepherd Mix',
          age: 6,
          gender: 'Male',
          size: 'Large',
          image_url: 'https://images.unsplash.com/photo-1568595471124-96b305d2aaeb?w=500&h=500&fit=crop',
          description: 'Mature German Shepherd mix, calm and well-trained.',
          location: 'Colorado',
          vaccinated: true,
          adoption_status: 'Available',
        },
        {
          name: 'Daisy',
          type: 'Dog',
          breed: 'Dachshund',
          age: 2,
          gender: 'Female',
          size: 'Small',
          image_url: 'https://images.unsplash.com/photo-1576201021090-f660db306e0b?w=500&h=500&fit=crop',
          description: 'Tiny Dachshund with a big personality, loves to play.',
          location: 'Massachusetts',
          vaccinated: true,
          adoption_status: 'Available',
        },
      ];

      const { data, error } = await supabase
        .from('pets')
        .insert(petsData);

      if (error) {
        console.error('[v0] Error inserting pets:', error);
        throw error;
      } else {
        console.log('[v0] Successfully inserted', petsData.length, 'pets');
      }
    } else {
      console.log('[v0] Pets table already exists');
      
      // Check if it has data
      const { count } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true });

      if (count === 0) {
        console.log('[v0] Pets table is empty, adding sample data...');
        
        const petsData = [
          {
            name: 'Max',
            type: 'Dog',
            breed: 'German Shepherd',
            age: 3,
            gender: 'Male',
            size: 'Large',
            image_url: 'https://images.unsplash.com/photo-1568595471124-96b305d2aaeb?w=500&h=500&fit=crop',
            description: 'Friendly and energetic German Shepherd looking for a loving home.',
            location: 'New York',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Luna',
            type: 'Dog',
            breed: 'Golden Retriever',
            age: 2,
            gender: 'Female',
            size: 'Large',
            image_url: 'https://images.unsplash.com/photo-1633722715463-d30628ceb4ab?w=500&h=500&fit=crop',
            description: 'Sweet Golden Retriever puppy, very playful and loves everyone.',
            location: 'California',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Whiskers',
            type: 'Cat',
            breed: 'Persian Cat',
            age: 4,
            gender: 'Female',
            size: 'Small',
            image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
            description: 'Elegant Persian cat, calm and perfect for apartment living.',
            location: 'Texas',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Buddy',
            type: 'Dog',
            breed: 'Labrador Retriever',
            age: 5,
            gender: 'Male',
            size: 'Large',
            image_url: 'https://images.unsplash.com/photo-1633722715463-d30628ceb4ab?w=500&h=500&fit=crop',
            description: 'Loyal Labrador, great with families and kids.',
            location: 'Florida',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Mittens',
            type: 'Cat',
            breed: 'Tabby Mix',
            age: 2,
            gender: 'Female',
            size: 'Small',
            image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500&h=500&fit=crop',
            description: 'Adorable tabby kitten, playful and affectionate.',
            location: 'Illinois',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Charlie',
            type: 'Dog',
            breed: 'Beagle',
            age: 3,
            gender: 'Male',
            size: 'Small',
            image_url: 'https://images.unsplash.com/photo-1591788216694-ea31cdb58b74?w=500&h=500&fit=crop',
            description: 'Cute Beagle with lots of personality and energy.',
            location: 'Pennsylvania',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Bella',
            type: 'Dog',
            breed: 'Poodle',
            age: 4,
            gender: 'Female',
            size: 'Small',
            image_url: 'https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=500&h=500&fit=crop',
            description: 'Intelligent and elegant Poodle, great for active families.',
            location: 'Ohio',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Shadow',
            type: 'Cat',
            breed: 'Black Cat',
            age: 3,
            gender: 'Male',
            size: 'Medium',
            image_url: 'https://images.unsplash.com/photo-1529148482759-b8610a6a16f7?w=500&h=500&fit=crop',
            description: 'Mysterious black cat, loves to cuddle when comfortable.',
            location: 'Washington',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Rocky',
            type: 'Dog',
            breed: 'German Shepherd Mix',
            age: 6,
            gender: 'Male',
            size: 'Large',
            image_url: 'https://images.unsplash.com/photo-1568595471124-96b305d2aaeb?w=500&h=500&fit=crop',
            description: 'Mature German Shepherd mix, calm and well-trained.',
            location: 'Colorado',
            vaccinated: true,
            adoption_status: 'Available',
          },
          {
            name: 'Daisy',
            type: 'Dog',
            breed: 'Dachshund',
            age: 2,
            gender: 'Female',
            size: 'Small',
            image_url: 'https://images.unsplash.com/photo-1576201021090-f660db306e0b?w=500&h=500&fit=crop',
            description: 'Tiny Dachshund with a big personality, loves to play.',
            location: 'Massachusetts',
            vaccinated: true,
            adoption_status: 'Available',
          },
        ];

        const { data, error } = await supabase
          .from('pets')
          .insert(petsData);

        if (error) {
          console.error('[v0] Error inserting pets:', error);
          throw error;
        } else {
          console.log('[v0] Successfully inserted', petsData.length, 'pets');
        }
      } else {
        console.log('[v0] Database already has', count, 'pets');
      }
    }

    console.log('[v0] Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
