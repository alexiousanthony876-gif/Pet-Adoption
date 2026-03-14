const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

const createTablesSQL = `
-- Create pets table
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  type VARCHAR(50) NOT NULL,
  age_months INT,
  gender VARCHAR(20),
  size VARCHAR(50),
  image_url TEXT,
  description TEXT,
  location VARCHAR(255),
  vaccinated BOOLEAN DEFAULT false,
  adoption_status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sample pet data
INSERT INTO public.pets (name, breed, type, age_months, gender, size, image_url, description, location, vaccinated, adoption_status) VALUES
('Max', 'Golden Retriever', 'dog', 36, 'male', 'large', 'https://images.unsplash.com/photo-1633722715463-d30628519b5a?w=500&h=500&fit=crop', 'Friendly and energetic Golden Retriever who loves to play fetch and swim. Perfect family pet.', 'New York', true, 'Available'),
('Luna', 'Siamese Cat', 'cat', 24, 'female', 'small', 'https://images.unsplash.com/photo-1513360371669-4a8bb28cb04a?w=500&h=500&fit=crop', 'Beautiful Siamese cat with striking blue eyes. Loves attention and cuddles.', 'Los Angeles', true, 'Available'),
('Rocky', 'German Shepherd', 'dog', 48, 'male', 'large', 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=500&h=500&fit=crop', 'Intelligent and loyal German Shepherd. Great guard dog and companion.', 'Chicago', true, 'Available'),
('Bella', 'Labrador Retriever', 'dog', 30, 'female', 'large', 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&h=500&fit=crop', 'Sweet and playful Labrador. Loves children and water activities.', 'Houston', true, 'Available'),
('Whiskers', 'Maine Coon', 'cat', 36, 'male', 'medium', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop', 'Large and fluffy Maine Coon. Very affectionate and loves interactive play.', 'Phoenix', true, 'Available'),
('Charlie', 'Beagle', 'dog', 18, 'male', 'small', 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=500&h=500&fit=crop', 'Energetic Beagle with a keen nose. Great for families with active lifestyles.', 'Philadelphia', true, 'Available'),
('Mittens', 'Persian Cat', 'cat', 48, 'female', 'small', 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=500&h=500&fit=crop', 'Calm and gentle Persian cat. Enjoys lounging and gentle petting.', 'San Antonio', true, 'Available'),
('Duke', 'Bulldog', 'dog', 42, 'male', 'medium', 'https://images.unsplash.com/photo-1583511655857-d19db992cb74?w=500&h=500&fit=crop', 'Stocky Bulldog with a gentle temperament. Perfect apartment companion.', 'San Diego', true, 'Available'),
('Shadow', 'Black Labrador', 'dog', 24, 'male', 'large', 'https://images.unsplash.com/photo-1552053831-71594a27c62d?w=500&h=500&fit=crop', 'Sleek Black Labrador. Athletic and intelligent, excellent service dog.', 'Dallas', true, 'Available'),
('Snowball', 'White Persian', 'cat', 60, 'female', 'small', 'https://images.unsplash.com/photo-1612536315141-e67bc8cc5517?w=500&h=500&fit=crop', 'Beautiful white Persian with a calm demeanor. Best suited for quiet homes.', 'San Jose', true, 'Available');
`;

async function setupDatabase() {
  try {
    console.log('[v0] Connecting to database...');
    await client.connect();
    console.log('[v0] Connected to database');

    console.log('[v0] Creating tables and seeding data...');
    await client.query(createTablesSQL);
    console.log('[v0] Successfully created tables and seeded 10 pets!');

    await client.end();
    console.log('[v0] Database setup complete');
  } catch (error) {
    console.error('[v0] Database setup error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
