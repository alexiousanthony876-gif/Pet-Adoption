import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const pets = [
  {
    name: 'Max',
    breed: 'Golden Retriever',
    type: 'Dog',
    age: 24,
    gender: 'Male',
    size: 'Large',
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30628cbc4c1?w=500&h=500&fit=crop',
    description: 'Friendly and energetic golden retriever looking for an active family. Max loves playing fetch and swimming.',
    location: 'New York',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Luna',
    breed: 'Siamese Cat',
    type: 'Cat',
    age: 12,
    gender: 'Female',
    size: 'Small',
    image_url: 'https://images.unsplash.com/photo-1513360371669-4a8e9a63e444?w=500&h=500&fit=crop',
    description: 'Elegant Siamese cat with beautiful blue eyes. Luna is affectionate and loves attention from her humans.',
    location: 'New York',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Charlie',
    breed: 'Labrador Retriever',
    type: 'Dog',
    age: 36,
    gender: 'Male',
    size: 'Large',
    image_url: 'https://images.unsplash.com/photo-1608848461950-0fed8e7a9cc2?w=500&h=500&fit=crop',
    description: 'Gentle and loving lab. Charlie is great with kids and makes an excellent family pet.',
    location: 'California',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Bella',
    breed: 'German Shepherd',
    type: 'Dog',
    age: 18,
    gender: 'Female',
    size: 'Large',
    image_url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=500&h=500&fit=crop',
    description: 'Intelligent and loyal German Shepherd. Bella is well-trained and obedient.',
    location: 'Texas',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Whiskers',
    breed: 'British Shorthair',
    type: 'Cat',
    age: 24,
    gender: 'Male',
    size: 'Medium',
    image_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
    description: 'Calm and cuddly British Shorthair. Whiskers enjoys quiet time and gentle petting.',
    location: 'California',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Rocky',
    breed: 'Pitbull',
    type: 'Dog',
    age: 30,
    gender: 'Male',
    size: 'Large',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&h=500&fit=crop',
    description: 'Muscular and friendly pitbull. Rocky is energetic and loves outdoor activities.',
    location: 'Florida',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Princess',
    breed: 'Persian Cat',
    type: 'Cat',
    age: 18,
    gender: 'Female',
    size: 'Small',
    image_url: 'https://images.unsplash.com/photo-1606214174585-fe31582dc1d4?w=500&h=500&fit=crop',
    description: 'Fluffy and adorable Persian cat. Princess loves being pampered and groomed.',
    location: 'New York',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Duke',
    breed: 'Husky',
    type: 'Dog',
    age: 20,
    gender: 'Male',
    size: 'Large',
    image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=500&fit=crop',
    description: 'Beautiful husky with striking eyes. Duke is playful and loves cold weather.',
    location: 'Colorado',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Mittens',
    breed: 'Mixed Breed Cat',
    type: 'Cat',
    age: 6,
    gender: 'Female',
    size: 'Small',
    image_url: 'https://images.unsplash.com/photo-1496360046613-948571e253bd?w=500&h=500&fit=crop',
    description: 'Young and playful mixed breed cat. Mittens has adorable white paws.',
    location: 'Washington',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  },
  {
    name: 'Bailey',
    breed: 'Beagle',
    type: 'Dog',
    age: 14,
    gender: 'Female',
    size: 'Small',
    image_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f0?w=500&h=500&fit=crop',
    description: 'Cute and curious beagle. Bailey loves exploring and is great for apartment living.',
    location: 'Illinois',
    vaccinated: true,
    adoption_status: 'Available',
    health_status: 'Healthy'
  }
]

async function seed() {
  try {
    console.log('[v0] Starting database seeding...')
    
    const { data, error } = await supabase
      .from('pets')
      .insert(pets)

    if (error) {
      console.error('[v0] Error inserting pets:', error.message)
      process.exit(1)
    }

    console.log('[v0] Successfully inserted', data?.length || pets.length, 'pets')
    console.log('[v0] Seeding complete!')
    process.exit(0)
  } catch (err) {
    console.error('[v0] Unexpected error:', err)
    process.exit(1)
  }
}

seed()
