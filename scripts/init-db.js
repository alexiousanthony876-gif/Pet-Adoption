import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...')

    // Create pet_categories table
    const { error: categoryError } = await supabase.from('pet_categories').select('id').limit(1)
    if (categoryError?.code === 'PGRST116') {
      console.log('Creating pet_categories table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS pet_categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            icon_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE pet_categories ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Everyone can view pet categories" ON pet_categories FOR SELECT USING (true);
          CREATE POLICY "Only admins can insert pet categories" ON pet_categories FOR INSERT WITH CHECK (
            (SELECT auth.jwt() ->> 'is_admin')::boolean = true
          );
          CREATE POLICY "Only admins can update pet categories" ON pet_categories FOR UPDATE USING (
            (SELECT auth.jwt() ->> 'is_admin')::boolean = true
          );
          CREATE POLICY "Only admins can delete pet categories" ON pet_categories FOR DELETE USING (
            (SELECT auth.jwt() ->> 'is_admin')::boolean = true
          );
        `
      })
    }

    // Create pets table
    const { error: petsError } = await supabase.from('pets').select('id').limit(1)
    if (petsError?.code === 'PGRST116') {
      console.log('Creating pets table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS pets (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            category_id UUID NOT NULL REFERENCES pet_categories(id) ON DELETE RESTRICT,
            breed TEXT NOT NULL,
            age_months INTEGER NOT NULL,
            gender TEXT CHECK (gender IN ('Male', 'Female')) NOT NULL,
            description TEXT,
            health_status TEXT CHECK (health_status IN ('Healthy', 'Under Treatment', 'Recovering')) DEFAULT 'Healthy',
            vaccination_status TEXT CHECK (vaccination_status IN ('Completed', 'Pending', 'Partial')) DEFAULT 'Pending',
            adoption_status TEXT CHECK (adoption_status IN ('Available', 'Pending Adoption', 'Adopted', 'Reserved')) DEFAULT 'Available',
            image_url TEXT,
            model_3d_url TEXT,
            weight_kg DECIMAL(5, 2),
            color TEXT,
            special_needs TEXT,
            intake_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Everyone can view available pets" ON pets FOR SELECT USING (adoption_status = 'Available' OR (SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can insert pets" ON pets FOR INSERT WITH CHECK ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can update pets" ON pets FOR UPDATE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can delete pets" ON pets FOR DELETE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
        `
      })
    }

    // Create adoption_requests table
    const { error: requestsError } = await supabase.from('adoption_requests').select('id').limit(1)
    if (requestsError?.code === 'PGRST116') {
      console.log('Creating adoption_requests table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS adoption_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
            status TEXT CHECK (status IN ('Pending', 'In Review', 'Approved', 'Rejected', 'Completed')) DEFAULT 'Pending',
            reason_for_adoption TEXT,
            home_type TEXT,
            other_pets TEXT,
            num_family_members INTEGER,
            experience_with_pets TEXT,
            approved_by UUID REFERENCES auth.users(id),
            approved_at TIMESTAMP WITH TIME ZONE,
            rejected_reason TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own requests" ON adoption_requests FOR SELECT USING (auth.uid() = user_id OR (SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Users can insert their own requests" ON adoption_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
          CREATE POLICY "Only admins can update requests" ON adoption_requests FOR UPDATE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can delete requests" ON adoption_requests FOR DELETE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
        `
      })
    }

    // Create appointments table
    const { error: appointmentsError } = await supabase.from('appointments').select('id').limit(1)
    if (appointmentsError?.code === 'PGRST116') {
      console.log('Creating appointments table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS appointments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            adoption_request_id UUID NOT NULL REFERENCES adoption_requests(id) ON DELETE CASCADE,
            appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
            location TEXT,
            notes TEXT,
            status TEXT CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')) DEFAULT 'Scheduled',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their appointments" ON appointments FOR SELECT USING (
            adoption_request_id IN (SELECT id FROM adoption_requests WHERE user_id = auth.uid()) OR
            (SELECT auth.jwt() ->> 'is_admin')::boolean = true
          );
          CREATE POLICY "Only admins can insert appointments" ON appointments FOR INSERT WITH CHECK ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can update appointments" ON appointments FOR UPDATE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can delete appointments" ON appointments FOR DELETE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
        `
      })
    }

    // Create notifications table
    const { error: notificationsError } = await supabase.from('notifications').select('id').limit(1)
    if (notificationsError?.code === 'PGRST116') {
      console.log('Creating notifications table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT CHECK (type IN ('request_status', 'appointment', 'system', 'pet_available')) DEFAULT 'system',
            related_id UUID,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
          CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);
          CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
          CREATE POLICY "Users can delete their own notifications" ON notifications FOR DELETE USING (auth.uid() = user_id);
        `
      })
    }

    // Create admin_logs table
    const { error: logsError } = await supabase.from('admin_logs').select('id').limit(1)
    if (logsError?.code === 'PGRST116') {
      console.log('Creating admin_logs table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS admin_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
            action TEXT NOT NULL,
            resource_type TEXT,
            resource_id UUID,
            details JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Only admins can view logs" ON admin_logs FOR SELECT USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "System can insert logs" ON admin_logs FOR INSERT WITH CHECK (true);
        `
      })
    }

    // Create staff_members table
    const { error: staffError } = await supabase.from('staff_members').select('id').limit(1)
    if (staffError?.code === 'PGRST116') {
      console.log('Creating staff_members table...')
      await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS staff_members (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL,
            department TEXT,
            bio TEXT,
            avatar_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          
          ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "Everyone can view staff members" ON staff_members FOR SELECT USING (true);
          CREATE POLICY "Only admins can insert staff" ON staff_members FOR INSERT WITH CHECK ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can update staff" ON staff_members FOR UPDATE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
          CREATE POLICY "Only admins can delete staff" ON staff_members FOR DELETE USING ((SELECT auth.jwt() ->> 'is_admin')::boolean = true);
        `
      })
    }

    console.log('✅ Database initialization complete!')

  } catch (error) {
    console.error('❌ Error initializing database:', error.message)
    process.exit(1)
  }
}

initializeDatabase()
