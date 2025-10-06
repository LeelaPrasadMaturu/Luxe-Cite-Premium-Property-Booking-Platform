# Luxe-Cite: Premium Property Booking Platform

A modern, scalable property booking management system with **Redis-based soft locks**, **concurrent booking prevention**, and **secure payment processing**. Built with Next.js, React, Redux, MongoDB Atlas, and Redis caching.

## 🚀 Features

### **🔐 Advanced Booking System**
- **Redis Soft Locks**: 10-minute temporary locks prevent double bookings
- **Concurrent Booking Prevention**: Atomic operations ensure no race conditions
- **Real-time Availability**: Live property availability with conflict detection
- **Payment Integration**: Secure payment processing with test mode
- **Booking Confirmation**: Automated confirmation flow with email notifications

### **👥 User Management**
- **Multi-role Authentication**: Admin, Host, and Guest roles
- **Profile Management**: Editable user profiles with validation
- **Session Management**: Secure JWT-based authentication
- **Password Recovery**: Forgot password and reset functionality

### **🏨 Property Management**
- **Property Listings**: Rich property details with image galleries
- **Advanced Search**: Location, price, amenities, and date filtering
- **Availability Calendar**: Visual booking calendar with disabled dates
- **Property Reviews**: User reviews and rating system

### **💳 Payment System**
- **Secure Payment Page**: Dedicated payment interface
- **Test Payment Mode**: Development-friendly payment simulation
- **Payment Integration Ready**: Prepared for Stripe, PayPal integration
- **Booking Lock Management**: Automatic lock expiry and cleanup

### **📊 Admin Dashboard**
- **Analytics Dashboard**: Booking statistics and revenue tracking
- **User Management**: Complete user administration
- **Property Management**: Add, edit, and manage properties
- **Booking Oversight**: Monitor and manage all bookings

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **React 18** - UI component library with hooks
- **Redux Toolkit** - Modern state management
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication framework
- **Axios** - HTTP client for API calls
- **React DatePicker** - Date selection components

### **Backend**
- **Node.js 18** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Redis Cloud** - In-memory caching and session storage
- **JWT** - Secure authentication tokens
- **Swagger/OpenAPI** - API documentation
- **Mongoose** - MongoDB object modeling

### **DevOps & Deployment**
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend deployment platform
- **Railway/Render** - Backend deployment platform

## 📦 Project Structure

```
Luxe-cite/
├── backend/                    # Backend API service
│   ├── src/
│   │   ├── config/            # Redis and database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Authentication middleware
│   │   ├── models/            # MongoDB models (User, Property, Booking)
│   │   ├── routes/            # API routes (auth, properties, bookings)
│   │   ├── services/          # Business logic (bookingLockService)
│   │   ├── swagger/           # API documentation
│   │   └── utils/             # Utility functions
│   ├── __tests__/             # Backend test suites
│   ├── Dockerfile             # Production Docker configuration
│   ├── env.example            # Environment variables template
│   └── vercel.json            # Vercel deployment config
│
├── frontend/                  # Next.js frontend application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── api/           # Next.js API routes
│   │   │   ├── bookings/      # Booking management pages
│   │   │   ├── payment/       # Payment processing page
│   │   │   ├── properties/    # Property listing pages
│   │   │   └── profile/       # User profile pages
│   │   ├── components/        # Reusable React components
│   │   ├── lib/               # Utility libraries
│   │   ├── providers/         # Context providers
│   │   └── store/             # Redux store configuration
│   ├── public/                # Static assets
│   ├── Dockerfile             # Production Docker configuration
│   └── env.example            # Environment variables template
│
├── docker-compose.yml         # Development Docker setup
├── docker-compose.prod.yml    # Production Docker setup
├── nginx.conf                  # Nginx reverse proxy config
├── deploy.sh                   # Production deployment script
└── .gitignore                  # Git ignore rules
```

## 🚀 Getting Started

### **Prerequisites**
- Docker and Docker Compose
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Redis Cloud account

### **Environment Setup**

#### **1. Clone the Repository**
```bash
git clone <your-repository-url>
cd Luxe-cite
```

#### **2. Set Up Environment Variables**

**Backend Environment** (`backend/.env`):
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here_minimum_32_characters

# CORS Configuration
FRONTEND_URL=https://your-frontend-domain.com

# Admin Configuration
ADMIN_SECRET_KEY=your_secure_admin_key_here

# Redis Configuration
REDIS_URL=redis://username:password@host:port
```

**Frontend Environment** (`frontend/.env.local`):
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# NextAuth Configuration
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=your_secure_nextauth_secret_here_minimum_32_characters
```

#### **3. Development Setup**
```bash
# Start development environment
docker-compose up --build

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
Swagger Docs: http://localhost:5000/api-docs
```

#### **4. Production Deployment**
```bash
# Make deployment script executable
chmod +x deploy.sh

# Deploy to production
./deploy.sh
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when running the backend service. It's built using Swagger and provides detailed information about:

- **Authentication endpoints** - Login, register, password reset
- **Property management** - CRUD operations for properties
- **Booking system** - Lock creation, confirmation, and management
- **User management** - Profile updates and role management
- **Admin functions** - Dashboard analytics and user oversight

### **Key API Endpoints**

#### **Booking System**
- `POST /api/bookings/lock` - Create booking lock
- `POST /api/bookings/confirm` - Confirm booking
- `DELETE /api/bookings/lock/:lockKey` - Release lock
- `GET /api/bookings/availability/:propertyId` - Check availability

#### **Property Management**
- `GET /api/properties` - List properties with filters
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property (Admin)

#### **User Management**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/me` - Update user profile

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run specific test suites
npm test -- admin.test.js
npm test -- auth.test.js
npm test -- bookings.test.js

# Run frontend tests
cd frontend
npm test
```

## 🔒 Security Features

### **Authentication & Authorization**
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Host, Guest)
- **Password hashing** with bcrypt
- **Session management** with Redis

### **Data Protection**
- **Input validation** and sanitization
- **SQL injection prevention** with Mongoose
- **XSS protection** with Content Security Policy
- **CSRF protection** with secure cookies

### **Rate Limiting & Monitoring**
- **API rate limiting** with Redis
- **Login attempt limiting** (5 attempts per minute)
- **Request logging** and monitoring
- **Lock expiry monitoring** for booking conflicts

## 📈 Performance Optimization

### **Caching Strategy**
- **Redis caching** for frequently accessed data
- **Property availability caching** with TTL
- **User session caching** for faster authentication
- **API response caching** for static data

### **Database Optimization**
- **MongoDB Atlas** for scalable cloud database
- **Indexed queries** for faster searches
- **Connection pooling** for better performance
- **Aggregation pipelines** for complex queries

### **Frontend Performance**
- **Next.js SSR/SSG** for faster page loads
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **Lazy loading** for components and routes
- **Redux state persistence** for better UX

## 🚀 Deployment Options

### **Option 1: Cloud Platform (Recommended)**
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Railway or Render
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud

### **Option 2: Docker + VPS**
- Use the provided `docker-compose.prod.yml`
- Set up Nginx reverse proxy
- Configure SSL certificates
- Run `./deploy.sh` for automated deployment

### **Option 3: Kubernetes (Enterprise)**
- Container orchestration for high availability
- Auto-scaling based on demand
- Load balancing across multiple instances

## 🔧 Development Workflow

### **Git Workflow**
```bash
# Create feature branch
git checkout -b feature/booking-improvements

# Make changes and commit
git add .
git commit -m "feat: add Redis soft locks for booking conflicts"

# Push and create PR
git push origin feature/booking-improvements
```

### **Code Quality**
- **ESLint** for code linting
- **Prettier** for code formatting
- **Jest** for unit testing
- **GitHub Actions** for CI/CD

## 🤝 Contributing

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Follow the coding standards** (ESLint + Prettier)
4. **Write tests** for new functionality
5. **Commit your changes** (`git commit -m 'feat: Add some AmazingFeature'`)
6. **Push to the branch** (`git push origin feature/AmazingFeature`)
7. **Open a Pull Request**

### **Contribution Guidelines**
- Follow the existing code style
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MongoDB Atlas** for cloud database hosting
- **Redis Cloud** for caching and session storage
- **Next.js team** for the amazing React framework
- **Vercel** for frontend deployment platform
- **All contributors and maintainers** who helped build this project

## 📞 Support

For support and questions:
- **Create an issue** on GitHub
- **Check the documentation** in `/api-docs`
- **Review the test cases** for usage examples

---

**Built with ❤️ by the Luxe-Cite team** 