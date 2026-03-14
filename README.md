# Pet Adoption Platform

A modern, full-stack web application for pet adoption with 3D animations, comprehensive admin dashboard, and real-time adoption tracking.

## Features

### For Users
- **Browse Pets**: Filter and search through available pets for adoption with advanced filtering options
- **3D Pet Viewer**: Interactive 3D models of pets using React Three Fiber and Three.js
- **Adoption Applications**: Submit detailed adoption applications with comprehensive forms
- **User Dashboard**: Track application status in real-time with notifications
- **User Profiles**: Manage personal information and preferences
- **Appointment Scheduling**: Schedule visits and meet-and-greets with pets
- **Notifications**: Receive updates on application status

### For Administrators
- **Pet Management**: Add, edit, and manage pet listings with image uploads
- **Application Review**: Review and approve/reject adoption applications with admin notes
- **Appointment Management**: Manage and schedule adoption appointments
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: View key metrics and insights

### Technical Features
- **3D Animations**: React Three Fiber for interactive 3D pet models with auto-rotation
- **Real-time Updates**: Supabase for real-time database synchronization
- **Secure Authentication**: Custom auth with bcrypt password hashing and HTTP-only cookies
- **Dark Theme**: Modern dark UI with Tailwind CSS and custom design system
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **SEO Optimized**: Open Graph, sitemap, and structured data for search engines

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Library**: shadcn/ui, Radix UI, Tailwind CSS
- **3D Graphics**: React Three Fiber, Three.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom auth with bcrypt password hashing
- **API**: REST API with Next.js route handlers
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm/yarn
- Supabase account (for database and authentication)
- Git (for version control)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pet-adoption-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
pet-adoption-platform/
├── app/
│   ├── admin/
│   │   ├── pets/              # Pet management system
│   │   ├── requests/          # Adoption requests review
│   │   ├── appointments/      # Appointment management
│   │   └── dashboard/         # Admin overview
│   ├── auth/
│   │   ├── login/             # User login page
│   │   └── signup/            # User registration page
│   ├── pets/                  # Pet listing and browsing
│   ├── adoption/[petId]/      # Adoption form page
│   ├── dashboard/             # User dashboard
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── pets/              # Pet management endpoints
│   │   ├── adoption-requests/ # Adoption request endpoints
│   │   └── appointments/      # Appointment endpoints
│   └── layout.tsx             # Root layout
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── pet-card.tsx           # Pet card component
│   ├── pet-3d-viewer.tsx      # 3D pet viewer
│   ├── hero-3d-scene.tsx      # 3D hero scene
│   ├── navigation.tsx         # Navigation bar
│   ├── footer.tsx             # Footer
│   ├── pets-filter.tsx        # Pet filter component
│   └── admin-sidebar.tsx      # Admin sidebar
├── lib/
│   ├── supabase/              # Supabase client configuration
│   ├── auth-context.tsx       # Authentication context
│   ├── admin-store.ts         # Admin data store
│   ├── pets-data.ts           # Pet data
│   └── utils.ts               # Utility functions
├── public/                    # Static assets
├── styles/                    # Global styles
└── package.json               # Project dependencies
```

## Database Schema

### Users Table
- `id`: UUID (primary key)
- `email`: String (unique)
- `user_type`: 'admin' | 'user'
- `first_name`: String
- `last_name`: String
- `password_hash`: String (bcrypt hashed)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Pets Table
- `id`: UUID (primary key)
- `name`: String
- `breed`: String
- `type`: String (dog, cat, rabbit, etc.)
- `age`: Integer (months)
- `gender`: String (male/female)
- `size`: String (small/medium/large)
- `image_url`: String
- `description`: Text
- `location`: String
- `vaccinated`: Boolean
- `available`: Boolean
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Adoption Requests Table
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `pet_id`: UUID (foreign key to pets)
- `status`: 'pending' | 'approved' | 'rejected' | 'info-requested'
- `firstName`: String
- `lastName`: String
- `email`: String
- `phone`: String
- `address`: String
- `city`: String
- `state`: String
- `zip`: String
- `housing`: String
- `hasYard`: Boolean
- `otherPets`: String
- `otherPetsDetails`: String
- `hoursAlone`: Integer
- `experience`: String
- `reason`: Text
- `admin_notes`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Appointments Table
- `id`: UUID (primary key)
- `pet_id`: UUID (foreign key to pets)
- `user_id`: UUID (foreign key to users)
- `appointment_date`: Date
- `appointment_time`: Time
- `status`: 'scheduled' | 'completed' | 'cancelled'
- `notes`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user account
- `POST /api/auth/login` - Login user with credentials
- `POST /api/auth/logout` - Logout user and clear session

### Pets
- `GET /api/pets` - Get all available pets with pagination
- `GET /api/pets/:id` - Get specific pet details
- `POST /api/pets` - Create new pet listing (admin only)
- `PUT /api/pets/:id` - Update pet information (admin only)
- `DELETE /api/pets/:id` - Delete pet listing (admin only)

### Adoption Requests
- `GET /api/adoption-requests` - Get user's adoption requests
- `POST /api/adoption-requests` - Submit new adoption request
- `GET /api/adoption-requests/:id` - Get specific request details
- `PUT /api/adoption-requests/:id` - Update request status (admin only)
- `GET /api/admin/adoption-requests` - Get all requests (admin only)

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Cancel appointment

## Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt (10 salt rounds)
3. User credentials stored securely in Supabase
4. JWT token issued on successful login
5. Token stored in HTTP-only cookie for enhanced security
6. Protected routes validate token on each request
7. Session automatically refreshed before expiration

## Deployment to Vercel

### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "New Project"
4. Select your repository
5. Click "Import"

### Step 3: Configure Environment Variables
In Vercel project settings, go to "Settings" → "Environment Variables" and add:
```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
```

### Step 4: Deploy
1. Click "Deploy"
2. Vercel will build and deploy your application
3. Your site will be live at `https://your-project.vercel.app`

### Auto-Deploy from GitHub
- Every push to main branch automatically deploys
- Preview deployments created for pull requests
- Rollback to previous deployments anytime

## Environment Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Features in Detail

### 3D Pet Viewer
- Interactive 3D models with mouse controls
- Auto-rotating animations with smooth transitions
- Zoom and pan capabilities
- Responsive design for all screen sizes
- Lighting and shadows for realistic rendering
- Multiple geometric shapes for expressive pet models

### Admin Dashboard
- Real-time updates on adoption requests
- Pet management with image uploads and descriptions
- Advanced filtering and search capabilities
- Admin notes and review system
- Application approval/rejection workflow
- Appointment scheduling and tracking
- User management interface

### User Dashboard
- Application status tracking with real-time updates
- Appointment scheduling and management
- Profile management and preferences
- Notification center for important updates
- Favorite pets list
- Application history

### Pet Listing Page
- Advanced filtering by type, breed, location, gender, and size
- Search functionality across pet names and descriptions
- Responsive grid layout
- Pet cards with images and key information
- Direct adoption application links

## Performance Optimizations

- Image optimization with Next.js Image component
- Code splitting and lazy loading of components
- Database query optimization and indexing
- Caching strategies for static content
- Compression of 3D models and assets
- Browser caching with proper headers
- CDN delivery through Vercel Edge Network

## Security Best Practices

- Password hashing with bcrypt (industry standard)
- CSRF protection through SameSite cookies
- SQL injection prevention with parameterized queries
- XSS protection through React's built-in escaping
- Row-level security (RLS) on all Supabase tables
- Secure HTTP-only cookies for session management
- HTTPS enforcement on all connections
- Input validation and sanitization
- Rate limiting on authentication endpoints

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Supabase Connection Issues
- Verify environment variables are correctly set
- Check Supabase project status in dashboard
- Ensure API keys have proper permissions
- Test connection with `supabase status`

### 3D Model Performance Issues
- Reduce model complexity if needed
- Enable hardware acceleration in browser settings
- Use LOD (Level of Detail) techniques
- Check GPU memory usage

### Authentication Problems
- Clear browser cookies and localStorage
- Check password meets minimum requirements
- Verify email is not already registered
- Check email confirmation if required

### Image Upload Issues
- Ensure file size is under limits
- Check file format is supported (JPG, PNG, WebP)
- Verify bucket permissions in Supabase
- Check available storage quota

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request with detailed description

## Future Enhancements

- Video uploads for pet profiles
- Advanced matching algorithm for recommendations
- In-app messaging between users and admins
- Pet adoption insurance integration
- Mobile app (React Native)
- Payment integration for adoption fees
- Blog for pet care tips
- Virtual tour for shelter facilities

## Support

For support, issues, or questions:
- Email: support@petadoption.com
- GitHub Issues: [Open an issue](https://github.com/your-repo/issues)
- Documentation: Check README and inline code comments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Three Fiber for incredible 3D capabilities
- Supabase for reliable backend infrastructure
- shadcn/ui for beautiful, accessible components
- Vercel for seamless deployment platform
- Next.js team for an amazing framework
- Open source community for fantastic tools and libraries
