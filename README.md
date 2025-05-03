# LuxeStay - Luxury Hotel Booking Platform

A modern, glassy UI hotel booking platform built with Next.js and Express.js.

## Features

- 🏨 Luxury hotel booking system
- 👥 Multiple user roles (Guests, Hosts, Admins)
- 🔐 Secure authentication (JWT)
- 💳 Mock payment system
- 📱 Responsive design
- 🌓 Dark/Light mode
- 🎨 Modern glassy UI

## Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Redux Toolkit
- **Backend**: Express.js, GraphQL, MongoDB
- **Authentication**: JWT
- **Deployment**: Docker, Vercel (Frontend), Railway (Backend)

## Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/luxestay.git
cd luxestay
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
luxestay/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utility functions
│   └── store/              # Redux store
├── backend/                 # Express.js backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── graphql/           # GraphQL schema and resolvers
└── docker/                # Docker configuration
```

## Deployment

### Frontend (Vercel)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Backend (Railway)
1. Push your code to GitHub
2. Connect your repository to Railway
3. Add environment variables in Railway dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 