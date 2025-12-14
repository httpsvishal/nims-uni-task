# NIMS University - Student Management System

A modern, responsive Student Management System built with React and Vite for NIMS University with complete API integration.

## Features

- **JWT Authentication**: Secure login with Bearer token authorization
- **Dashboard**: Real-time overview of student statistics and metrics
- **Student Management**: Complete CRUD operations with API integration
- **Advanced Search**: Search by name, email, ID, or course with backend filtering
- **Pagination**: Server-side pagination for efficient data loading
- **Status Filtering**: Filter students by Active, Inactive, Graduated, or Suspended status
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Toast Notifications**: Real-time feedback for all user actions
- **Form Validation**: Comprehensive validation for all input fields
- **Loading States**: Proper loading indicators for better UX

## Tech Stack

- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **Axios** - HTTP client for API requests

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API server running (see API Integration section)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=false
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Integration

### Required Backend Endpoints

The application connects to the following API endpoints:

#### Authentication
- `POST /auth/login` - User login and JWT token generation
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: object }`

#### Students (JWT Protected)
All student endpoints require the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

- `GET /students` - Get all students with pagination and search
  - Query params: `page`, `limit`, `search`, `status`, `sort`, `order`
  - Response: `{ data: Student[], total: number, totalPages: number }`

- `GET /students/:id` - Get student by ID
  - Response: `{ student: Student }`

- `POST /students` - Create a new student
  - Body: `{ firstName, lastName, email, phone, course, year, status, ... }`
  - Response: `{ student: Student }`

- `PUT /students/:id` - Update student details
  - Body: `{ firstName, lastName, email, ... }`
  - Response: `{ student: Student }`

- `DELETE /students/:id` - Delete a student
  - Response: `{ message: string }`

### API Configuration

The API client is configured in `src/lib/api.js` with automatic JWT token management. To change the API base URL, update the environment variable `VITE_API_BASE_URL`.

## Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── Layout.jsx               # Main navigation layout
│   └── student-form.tsx         # Student form component
├── contexts/
│   ├── AuthContext.jsx          # Authentication context
│   └── ThemeContext.jsx         # Theme context for dark mode
├── hooks/
│   ├── useAuth.ts               # Authentication hook
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/
│   ├── api.js                   # API client with JWT management
│   ├── mockData.js              # Mock data for development
│   └── utils.js                 # Utility functions
├── pages/
│   ├── Dashboard.jsx            # Dashboard with statistics
│   ├── Login.jsx                # Login page
│   ├── Reports.jsx              # Reports page
│   ├── StudentForm.jsx          # Student form (create/edit)
│   └── StudentList.jsx          # Student list with search & pagination
├── App.jsx                      # Main app component with routing
├── main.jsx                     # Application entry point
└── index.css                    # Global styles
```

## Usage

### Login
1. Navigate to the login page
2. Enter your NIMS University credentials
3. The JWT token is automatically stored and used for subsequent requests

### Managing Students
1. **View All Students**: Navigate to the Students page to see the list with search and filters
2. **Add Student**: Click "Add Student" button and fill in the form
3. **Edit Student**: Click the edit icon on any student row
4. **View Details**: Click the eye icon to see complete student information
5. **Delete Student**: Click the trash icon and confirm deletion

### Search and Filter
- Use the search bar to find students by name, email, ID, or course
- Filter by status: Active, Inactive, Graduated, or Suspended
- Navigate through pages using the pagination controls

## Environment Variables

Create a `.env` file in the root directory and set these variables:

- `VITE_API_BASE_URL` - Backend API base URL (required for production)
- `VITE_USE_MOCK_DATA` - Set to 'true' to use mock data instead of real API (optional, default: false)

### Mock Data Mode

For development without a backend, set `VITE_USE_MOCK_DATA=true` in your `.env` file. This will use mock data for all API calls, allowing you to test the application functionality.

## Building for Production

```bash
npm run build
```

The optimized build will be created in the `dist` directory.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Development Server

Run `npm run dev` to start the Vite development server. The application will be available at `http://localhost:5173`.

## Deployment

This React/Vite application can be deployed to various platforms:

### Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Add environment variables in Vercel dashboard

### Static Hosting (GitHub Pages, etc.)
1. Build the project: `npm run build`
2. Upload the contents of the `dist` directory to your hosting provider
3. Configure your server to serve `index.html` for all routes (for client-side routing)

## Features in Detail

### Authentication
- JWT token-based authentication
- Automatic token storage and retrieval
- Protected routes with redirect to login
- Logout functionality with token cleanup

### Student Management
- Create, read, update, and delete operations
- Auto-generated student IDs
- Multiple courses and year levels
- Status management (Active, Inactive, Graduated, Suspended)

### Dashboard
- Real-time student statistics
- Total and active student counts
- Course information
- Quick action shortcuts

### User Experience
- Loading states for all async operations
- Error handling with user-friendly messages
- Toast notifications for success/error feedback
- Responsive design for all screen sizes
- Dark mode with system preference detection

## Troubleshooting

### Environment Variables Not Working
- Ensure your `.env` file is in the root directory
- Restart the development server after changing environment variables
- Use `VITE_` prefix for all environment variables (Vite requirement)

### API Connection Issues
- Check that `VITE_API_BASE_URL` points to your running backend
- Verify CORS settings on your backend
- Check browser console for detailed error messages

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check for TypeScript errors: `npm run lint`

## License

MIT

---

Built with ❤️ for NIMS University
