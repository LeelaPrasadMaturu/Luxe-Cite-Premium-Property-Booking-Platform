# Hotel Booking Management System

A modern, scalable hotel booking management system built with Next.js, React, Redux, MongoDB Atlas, and Redis caching.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Admin, Staff, Customer)
  - Profile management

- **Hotel Management**
  - Room inventory management
  - Room type categorization
  - Pricing and availability control
  - Room status tracking

- **Booking System**
  - Real-time room availability
  - Booking creation and management
  - Payment processing
  - Booking history

- **Admin Dashboard**
  - Analytics and reporting
  - User management
  - Booking management
  - System configuration

## 🛠️ Technology Stack

### Frontend
- **Next.js** - React framework for server-side rendering
- **React** - UI component library
- **Redux** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Jest** - Testing framework

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB Atlas** - Cloud database
- **Redis** - Caching layer
- **JWT** - Authentication
- **Swagger** - API documentation

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD

## 📦 Project Structure

```
.
├── backend/                 # Backend service
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── swagger/        # API documentation
│   │   └── utils/          # Utility functions
│   └── Dockerfile
│
├── frontend/               # Frontend service
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── redux/         # Redux store
│   │   └── styles/        # CSS styles
│   └── Dockerfile
│
└── docker-compose.yml      # Docker orchestration
```

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (v18 or higher)
- npm or yarn

### Environment Setup

1. Create a `.env` file in the root directory:
```env
# Backend Environment Variables
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secure-jwt-secret-key
FRONTEND_URL=http://localhost:3000
ADMIN_SECRET_KEY=your-admin-secret-key
REDIS_URL=your-redis-cloud-url

# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

2. Start the application:
```bash
# Build and start containers
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
Swagger Docs: http://localhost:5000/api-docs
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the backend service. It's built using Swagger and provides detailed information about:

- Available endpoints
- Request/response schemas
- Authentication requirements
- Example requests

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS protection
- Secure password hashing

## 📈 Performance Optimization

- Redis caching for frequently accessed data
- MongoDB Atlas for scalable database
- Next.js server-side rendering
- Image optimization
- Code splitting
- Lazy loading

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Redis Labs for caching service
- Next.js team for the amazing framework
- All contributors and maintainers 