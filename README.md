# 🖥️ Mentora Server — REST API Backend

> The backend server powering the **Mentora LMS Platform** — handling all API routes, database operations, authentication, and business logic for courses, users, and enrollments.

🌐 **Server Live URL:** [mentora-server-sandy.vercel.app](https://mentora-server-sandy.vercel.app/)
📁 **Client Repository:** [github.com/nihalxofficial/Mentora-Client](https://github.com/nihalxofficial/Mentora-Client)
📁 **Server Repository:** [github.com/nihalxofficial/Mentora-Server](https://github.com/nihalxofficial/Mentora-Server)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | **Node.js** |
| Framework | **Express.js** |
| Database | **MongoDB** (Native Driver) |
| Cloud Database | **MongoDB Atlas** |
| Authentication | **BetterAuth** |
| Token Security | **JWT (JSON Web Tokens)** |
| Deployment | **Vercel** (Serverless) |

---

## ✨ Features

- RESTful API serving the Mentora client application
- Full **CRUD** operations for courses, users, and enrollments
- **JWT-based** route protection for private endpoints
- Secure authentication flows powered by **BetterAuth**
- Cloud-hosted database with **MongoDB Atlas** — accessed via the **official MongoDB Node.js native driver** (no ODM/Mongoose)
- Serverless deployment on **Vercel** for zero-config CI/CD

---

## 📁 Project Structure

```
mentora-server/
├── api/                    # Serverless API entry point (Vercel)
├── controllers/            # Route handler logic
│   ├── courseController.js
│   ├── userController.js
│   └── enrollmentController.js
├── middleware/             # Auth & error middleware
│   ├── authMiddleware.js   # JWT verification
│   └── errorHandler.js
├── routes/                 # Express route definitions
│   ├── courseRoutes.js
│   ├── userRoutes.js
│   └── authRoutes.js
├── lib/
│   └── db.js               # MongoDB native driver connection
├── .env.example
├── vercel.json             # Vercel serverless config
└── package.json
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |
| GET | `/api/auth/me` | Get current user info | Private |

### Courses
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/courses` | Get all courses | Public |
| GET | `/api/courses/:id` | Get single course by ID | Public |
| POST | `/api/courses` | Create a new course | Private (Instructor) |
| PUT | `/api/courses/:id` | Update a course | Private (Instructor) |
| DELETE | `/api/courses/:id` | Delete a course | Private (Instructor) |

### Enrollments
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/enrollments` | Enroll in a course | Private |
| GET | `/api/enrollments/me` | Get current user's enrollments | Private |

### Users
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users/:id` | Get user profile | Private |
| PUT | `/api/users/:id` | Update user profile | Private |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn
- A **MongoDB Atlas** account with a cluster set up

### Installation

```bash
# 1. Clone the server repository
git clone https://github.com/nihalxofficial/Mentora-Server.git
cd Mentora-Server

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mentora?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# BetterAuth
BETTER_AUTH_SECRET=your_better_auth_secret

# App
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Run the Development Server

```bash
npm run dev
```

Server will start at [http://localhost:5000](http://localhost:5000)

---

## 🗄️ Database — MongoDB Atlas

This project uses **MongoDB Atlas** as its cloud-hosted database.

To set up your own Atlas cluster:

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **Cluster** (free tier works fine)
3. Under **Database Access**, create a database user with read/write access
4. Under **Network Access**, allow your IP (or `0.0.0.0/0` for all IPs)
5. Click **Connect → Drivers** and copy the connection string
6. Paste the connection string into your `.env` as `MONGODB_URI`

---

## 🔐 Authentication Flow

```
Client                        Server
  │                              │
  │── POST /api/auth/login ──▶  │
  │                         Validates credentials
  │                         via BetterAuth
  │                         Signs JWT token
  │◀── { token: "..." } ───────│
  │                              │
  │── GET /api/courses ────────▶│
  │   Authorization: Bearer <token>
  │                         authMiddleware verifies JWT
  │                         (jose-cjs / JWT)
  │◀── [{ course data }] ──────│
```

---

## 📦 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🌍 Deployment (Vercel)

This server is deployed as a **serverless application** on Vercel.

```json
// vercel.json
{
  "version": 2,
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.js" }]
}
```

To deploy your own instance:

```bash
npm install -g vercel
vercel --prod
```

Make sure to add all `.env` variables in your **Vercel project settings → Environment Variables**.

---

## 🐳 Docker Deployment

This project supports full containerized deployment using **Docker** and **Docker Compose**.

---

## 📦 Pull Prebuilt Images from Docker Hub

### Client Image

```bash
docker pull nihalxofficial/mentora-client:v1
```

### Server Image

```bash
docker pull nihalxofficial/mentora-server:v1
```

---

## 🚀 Run with Docker Compose

Create a `docker-compose.yml` file in the project root:

```yaml
version: "3.9"

services:
  client:
    image: nihalxofficial/mentora-client:v1
    ports:
      - "3000:3000"
    env_file:
      - ./mentora-client/.env.local
    depends_on:
      - server

  server:
    image: nihalxofficial/mentora-server:v1
    ports:
      - "5000:5000"
    env_file:
      - ./mentora-server/.env
```

---

## ▶️ Start Containers

Run the following command from the directory containing the `docker-compose.yml` file:

```bash
docker compose up -d
```

This will:

* Pull the latest images from Docker Hub
* Create the containers
* Start both the client and server services

---

## 🛑 Stop Containers

```bash
docker compose down
```

---

## 🔄 Restart Containers

```bash
docker compose restart
```

---

## 📜 View Logs

```bash
docker compose logs -f
```

---

## 🧹 Remove Unused Docker Resources

```bash
docker system prune -a
```

---

## 🌐 Application URLs

| Service    | URL                   |
| ---------- | --------------------- |
| Client     | http://localhost:3000 |
| Server API | http://localhost:5000 |

---

## ⚠️ Notes

* Make sure Docker Desktop is installed and running
* Ensure `.env` and `.env.local` files exist before starting containers
* Update image tags (`v1`) when publishing new versions
---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🔗 Related

- 🌐 [Mentora Client (Frontend)](https://github.com/nihalxofficial/Mentora-Client)
- 🚀 [Live App](https://mentora-lms-platform.vercel.app/)
- 🖥️ [Live API](https://mentora-server-sandy.vercel.app/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by the Mentora Team · © 2026 Mentora Inc.</p>
