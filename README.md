# 🎓 CampusHub

### Your Campus. Your Community. Your Marketplace.

CampusHub is a college-exclusive marketplace that connects students within their campus communities, making it easier to buy and sell second-hand products in a trusted, student-focused environment.

From books and study materials to everyday essentials, CampusHub aims to make student-to-student trading simple, accessible, and convenient.

---

## ✨ Key Features

- 🔐 **Secure Authentication** — College email verification using OTP, JWT-based authentication, and HttpOnly cookies.
- 🏫 **College-Specific Communities** — Designed to keep marketplace activity within the respective college community.
- 🛍️ **Product Marketplace** — Browse and discover second-hand products listed by students.
- 🛒 **Shopping Cart** — Add products, manage quantities, and remove items from your cart.
- 👤 **User-Based Access** — Protected routes and role-based authorization.
- 📦 **Product Management** — Support for product details, categories, pricing, condition, and images.
- 📱 **Responsive Interface** — Designed to provide a smooth experience across different screen sizes.

*Feature availability may vary as development progresses.*

## 🧰 Tech Stack

### Frontend
- React 19
- JavaScript (JSX)
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Lucide React
- shadcn/ui

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- HttpOnly Cookies

## 🏗️ Architecture

CampusHub follows a modular full-stack architecture.

- **Frontend:** Component-based React application with client-side routing.
- **Backend:** RESTful APIs built with Express.js and organized into feature-based modules.
- **Database:** MongoDB with Mongoose schemas and relationships.
- **Authentication:** Protected API endpoints using JWT-based sessions stored in HttpOnly cookies.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas connection

### 1. Clone the Repository

```bash
git clone https://github.com/Jatin915/CampusHub.git
cd CampusHub
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd server
npm install
```

Create a `.env` file using the environment variables required by your backend configuration.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional variables required by your project, such as email verification settings and frontend origin. Refer to your actual environment configuration before running the server.

Start the backend using the script defined in `server/package.json`, for example:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

> Note: Directory names, npm scripts, and environment variable names should match the actual repository configuration.

## 🔒 Security

- Authentication-protected endpoints.
- JWT verification through backend middleware.
- HttpOnly cookies for authentication tokens.
- Server-side validation of authenticated users and resource access.
- College-based restrictions for relevant marketplace operations.

## 🗺️ Roadmap

- [x] Initial authentication flow
- [x] Email OTP verification
- [x] JWT-based authentication and protected routes
- [x] Initial cart API and frontend integration
- [ ] OAuth authentication
- [ ] Complete product listing and management flow
- [ ] Order and transaction coordination
- [ ] Notifications and additional marketplace features
- [ ] Production deployment and further security improvements
- [ ] Dockerization of CampusHub

## 👥 Team

CampusHub is being developed collaboratively by a team of four developers.

- **Jatin** — Frontend & Backend Lead
- **Lalit** — Frontend & Backend Development
- **Gauri** — Frontend & Backend Development
- **Siddhi** — Frontend & Backend Development

## 🎯 Vision

Our goal is to build a reliable campus marketplace that helps students find affordable products, give pre-owned items a second life, and connect with other students in their college community.

---

**CampusHub — Buy Smart. Sell Easy. Stay on Campus.** 🎓
