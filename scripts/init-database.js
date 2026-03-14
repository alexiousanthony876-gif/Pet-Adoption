import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function initDatabase() {
  try {
    console.log('[v0] Starting database initialization...');

    // Create pets table
    const { error: petsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.pets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          breed VARCHAR(255),
          age INTEGER,
          gender VARCHAR(20),
          size VARCHAR(50),
          image_url VARCHAR(500),
          description TEXT,
          location VARCHAR(255),
          vaccinated BOOLEAN DEFAULT FALSE,
          adoption_status VARCHAR(50) DEFAULT 'Available',
          created_by UUID,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow public read access" ON public.pets
          FOR SELECT USING (true);

        CREATE POLICY "Allow authenticated users to create" ON public.pets
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');

        CREATE POLICY "Allow admins to update" ON public.pets
          FOR UPDATE USING (created_by = auth.uid());

        CREATE POLICY "Allow admins to delete" ON public.pets
          FOR DELETE USING (created_by = auth.uid());
      `
    });

    if (petsError && !petsError.message.includes('already exists')) {
      console.error('[v0] Error creating pets table:', petsError);
    } else {
      console.log('[v0] Pets table ready');
    }

    // Create adoption_requests table
    const { error: requestsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.adoption_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
          status VARCHAR(50) DEFAULT 'Pending',
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          email VARCHAR(255),
          phone VARCHAR(20),
          address VARCHAR(255),
          city VARCHAR(255),
          state VARCHAR(100),
          zip VARCHAR(10),
          housing VARCHAR(50),
          has_yard BOOLEAN DEFAULT FALSE,
          other_pets TEXT,
          hours_alone INTEGER,
          experience TEXT,
          reason TEXT,
          admin_notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view own requests" ON public.adoption_requests
          FOR SELECT USING (user_id = auth.uid() OR auth.jwt() ->> 'user_type' = 'admin');

        CREATE POLICY "Users can create requests" ON public.adoption_requests
          FOR INSERT WITH CHECK (user_id = auth.uid());

        CREATE POLICY "Admins can update" ON public.adoption_requests
          FOR UPDATE USING (auth.jwt() ->> 'user_type' = 'admin');
      `
    });

    if (requestsError && !requestsError.message.includes('already exists')) {
      console.error('[v0] Error creating adoption_requests table:', requestsError);
    } else {
      console.log('[v0] Adoption requests table ready');
    }

    // Create appointments table
    const { error: appointmentsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.appointments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          adoption_request_id UUID REFERENCES public.adoption_requests(id) ON DELETE CASCADE,
          scheduled_date TIMESTAMP,
          status VARCHAR(50) DEFAULT 'Scheduled',
          notes TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );

        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow authenticated to view" ON public.appointments
          FOR SELECT USING (auth.role() = 'authenticated');

        CREATE POLICY "Allow admins to manage" ON public.appointments
          FOR ALL USING (auth.jwt() ->> 'user_type' = 'admin');
      `
    });

    if (appointmentsError && !appointmentsError.message.includes('already exists')) {
      console.error('[v0] Error creating appointments table:', appointmentsError);
    } else {
      console.log('[v0] Appointments table ready');
    }

    console.log('[v0] Database initialization complete!');
  } catch (error) {
    console.error('[v0] Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
