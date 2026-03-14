-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  profile_image_url TEXT,
  user_type TEXT CHECK (user_type IN ('customer', 'admin', 'staff')) DEFAULT 'customer',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pet Categories table
CREATE TABLE pet_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pets table
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adoption Requests table
CREATE TABLE adoption_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('Pending', 'In Review', 'Approved', 'Rejected', 'Completed')) DEFAULT 'Pending',
  reason_for_adoption TEXT,
  experience_with_pets TEXT,
  living_situation TEXT,
  family_size INTEGER,
  has_other_pets BOOLEAN DEFAULT FALSE,
  other_pets_details TEXT,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT CHECK (appointment_type IN ('Meet & Greet', 'Home Visit', 'Finalization')) DEFAULT 'Meet & Greet',
  status TEXT CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Rescheduled')) DEFAULT 'Scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_pet_id UUID REFERENCES pets(id) ON DELETE SET NULL,
  related_request_id UUID REFERENCES adoption_requests(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Logs table
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Members table
CREATE TABLE staff_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  department TEXT,
  hire_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pets_category_id ON pets(category_id);
CREATE INDEX idx_pets_adoption_status ON pets(adoption_status);
CREATE INDEX idx_adoption_requests_user_id ON adoption_requests(user_id);
CREATE INDEX idx_adoption_requests_pet_id ON adoption_requests(pet_id);
CREATE INDEX idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_pet_id ON appointments(pet_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_staff_members_user_id ON staff_members(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users FOR SELECT
  USING (auth.uid()::text = id::text OR current_user_claims->>'role' = 'admin');

CREATE POLICY "Users can update their own profile" ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for pets table
CREATE POLICY "Anyone can view available pets" ON pets FOR SELECT
  USING (adoption_status IN ('Available', 'Reserved'));

CREATE POLICY "Admins can view all pets" ON pets FOR SELECT
  USING (current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can insert pets" ON pets FOR INSERT
  WITH CHECK (current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can update pets" ON pets FOR UPDATE
  USING (current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can delete pets" ON pets FOR DELETE
  USING (current_user_claims->>'role' = 'admin');

-- RLS Policies for adoption_requests table
CREATE POLICY "Users can view their own requests" ON adoption_requests FOR SELECT
  USING (auth.uid()::text = user_id::text OR current_user_claims->>'role' = 'admin');

CREATE POLICY "Users can create adoption requests" ON adoption_requests FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own requests" ON adoption_requests FOR UPDATE
  USING (auth.uid()::text = user_id::text AND status = 'Pending');

CREATE POLICY "Admins can view all requests" ON adoption_requests FOR SELECT
  USING (current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can update requests" ON adoption_requests FOR UPDATE
  USING (current_user_claims->>'role' = 'admin');

-- RLS Policies for appointments table
CREATE POLICY "Users can view their appointments" ON appointments FOR SELECT
  USING (auth.uid()::text = user_id::text OR current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can view all appointments" ON appointments FOR SELECT
  USING (current_user_claims->>'role' = 'admin');

CREATE POLICY "Admins can manage appointments" ON appointments FOR INSERT
  WITH CHECK (current_user_claims->>'role' = 'admin');

-- RLS Policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- RLS Policies for admin_logs table
CREATE POLICY "Only admins can view logs" ON admin_logs FOR SELECT
  USING (current_user_claims->>'role' = 'admin');

CREATE POLICY "Only admins can insert logs" ON admin_logs FOR INSERT
  WITH CHECK (current_user_claims->>'role' = 'admin');

-- RLS Policies for pet_categories table
CREATE POLICY "Anyone can view categories" ON pet_categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify categories" ON pet_categories FOR ALL
  USING (current_user_claims->>'role' = 'admin');

-- RLS Policies for staff_members table
CREATE POLICY "Staff can view other staff" ON staff_members FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage staff" ON staff_members FOR ALL
  USING (current_user_claims->>'role' = 'admin');
