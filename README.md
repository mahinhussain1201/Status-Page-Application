# Status Page Application

A modern and responsive status page application similar to StatusPage or Cachet. This application allows organizations to manage their service statuses, track incidents, and communicate updates to their users in real-time.

## 🚀 Features

- **User Authentication & Authorization**
  - Secure login and registration
  - Role-based access control
  - JWT authentication

- **Team Management**
  - Create and manage teams
  - Add/remove team members
  - Assign roles (admin/member)

- **Service Management**
  - Track service status
  - Real-time status updates
  - Historical status data

- **Incident Management**
  - Create and track incidents
  - Real-time incident updates
  - Incident resolution workflow
  - Impact assessment

- **Real-time Updates**
  - Socket.IO integration
  - Live status changes
  - Instant notifications

## 🛠️ Tech Stack

- **Frontend**
  - React.js
  - TailwindCSS
  - Socket.IO Client
  - Context API for state management

- **Backend**
  - Node.js & Express
  - MongoDB & Mongoose
  - Socket.IO
  - JWT Authentication

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd status-page
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Update .env with your MongoDB URI and JWT secret
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the Application**
   ```bash
   # Start Backend (from backend directory)
   npm run dev
   
   # Start Frontend (from frontend directory)
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 Default Accounts

### Dummy credentils
- Email: test@test.com
- Password: test123

## 🔑 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/status-page
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Incidents
- `GET /api/incidents` - Get all incidents
- `POST /api/incidents` - Create incident
- `PUT /api/incidents/:id` - Update incident
- `POST /api/incidents/:id/resolve` - Resolve incident

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

## 👨‍💻 Author

**Mahin Hussain**
- IIT Kharagpur
- Contact: mahinhussain1201@gmail.com
