# NIMS University SMS (Student Management System)

A full-stack student management system built with NestJS backend and React frontend. The application provides comprehensive student information management with user authentication and role-based access control.

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: class-validator & class-transformer
- **Security**: bcrypt for password hashing
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

### Frontend
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Theme**: next-themes for dark/light mode support
- **Icons**: Lucide React

## 🚀 Project Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or pnpm package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tasks
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install
```

### 4. Environment Variables

Create `.env` file in the backend directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nims_university_sms
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/nims_university_sms

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 5. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### 6. Seed Initial Data
```bash
cd backend

# Run the seed script to create a test admin user
npm run seed
# or
npx ts-node seed.ts
```

This creates a test user with the following credentials:
- **Email**: admin@test.com
- **Password**: password123

### 7. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```
The backend will be available at `http://localhost:3000`

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 8. Access the Application
1. Open your browser and navigate to `http://localhost:5173`
2. Log in with the test credentials:
   - Email: admin@test.com
   - Password: password123
3. You should be redirected to the dashboard

## 📁 Project Structure

```
tasks/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── students/          # Student management
│   │   ├── common/            # Shared utilities
│   │   │   ├── filters/       # Exception filters
│   │   │   └── guards/        # Authentication guards
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry point
│   ├── test/                  # E2E tests
│   └── package.json
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utility functions
│   │   ├── hooks/            # Custom hooks
│   │   └── styles/           # Global styles
│   ├── public/               # Static assets
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration (if enabled)

### Students
- `GET /students` - Get all students (protected)
- `GET /students/:id` - Get student by ID (protected)
- `POST /students` - Create new student (protected)
- `PUT /students/:id` - Update student (protected)
- `DELETE /students/:id` - Delete student (protected)

### Users
- `GET /users` - Get all users (protected, admin only)
- `GET /users/:id` - Get user by ID (protected)
- `POST /users` - Create new user (protected, admin only)
- `PUT /users/:id` - Update user (protected, admin only)
- `DELETE /users/:id` - Delete user (protected, admin only)

## 🎨 Features Implemented

### Core Features
- ✅ **User Authentication**: JWT-based login/logout system
- ✅ **Student Management**: Full CRUD operations for student records
- ✅ **User Management**: Admin can manage system users
- ✅ **Protected Routes**: Frontend and backend route protection
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Dark/Light Theme**: Theme switching capability

### Security Features
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Password Hashing**: bcrypt for secure password storage
- ✅ **Input Validation**: Comprehensive data validation
- ✅ **CORS Protection**: Configured for frontend-backend communication
- ✅ **Error Handling**: Global exception filters
- ✅ **Request Sanitization**: Whitelist validation for inputs

### UI/UX Features
- ✅ **Modern UI**: Clean and intuitive interface
- ✅ **Form Validation**: Real-time form validation
- ✅ **Loading States**: Proper loading indicators
- ✅ **Toast Notifications**: User feedback for actions
- ✅ **Responsive Tables**: Data tables with pagination
- ✅ **Theme Support**: Dark and light mode themes

### Developer Experience
- ✅ **TypeScript**: Full type safety
- ✅ **Code Quality**: ESLint and Prettier configuration
- ✅ **Testing**: Unit and E2E test setup
- ✅ **Documentation**: Comprehensive inline documentation
- ✅ **Development Tools**: Hot reload and debugging support

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Testing
```bash
cd frontend

# Run linting
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)
4. Ensure MongoDB connection is configured

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API endpoints if needed

## 🛡️ Security Considerations

- Change default JWT_SECRET in production
- Use strong passwords and enable proper user management
- Regularly update dependencies
- Configure proper CORS origins for production
- Implement rate limiting for production use
- Use HTTPS in production environments

## 📝 Additional Notes

- The application uses MongoDB as the database
- JWT tokens expire after 24 hours by default
- All API endpoints except login require authentication
- The frontend automatically handles token refresh (can be implemented)
- Student data includes comprehensive information fields
- User roles and permissions can be extended as needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
