```markdown
# Activity Points Tracking System - Backend

This is the backend API server for the Activity Points Tracking System, a platform to manage student activities, certificates, and points tracking for tutors and students.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [API Overview](#api-overview)  
- [Project Structure](#project-structure)  
- [Important Notes](#important-notes)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Project Overview

This backend provides a RESTful API with authentication and role-based access control to:

- Manage student registrations, including OTP-based login.
- Allow tutors to register and login securely.
- Define activity categories and subcategories with points and requirements.
- Upload, review, approve/reject certificates as proof of student activities.
- Track student total points, breakdown by category, and progress.
- Support batch and branch filtering for student data.

---

## Features

- Secure JWT-based authentication  
- OTP verification for student/tutor registrations  
- Role-based route protection (student vs tutor)  
- Batch and branch tracking for students  
- Category and subcategory management  
- Certificate upload and review workflow  
- Integration with ImageKit for file storage  
- Email notifications via Nodemailer  
- Logging and timestamping for audit purposes  

---

## Tech Stack

- Node.js / Express.js  
- MongoDB with Mongoose ODM  
- JSON Web Tokens (JWT) for auth  
- Multer for file uploads (in-memory storage)  
- ImageKit for cloud file storage  
- Nodemailer for sending OTP emails  
- dotenv for environment variable management  

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)  
- MongoDB cluster or local instance  
- An email account for sending OTP emails (e.g., Gmail)  
- ImageKit account for file storage  

### Installation

1. Clone this repo and navigate inside the backend folder:
```

git clone https://github.com/Levi-7-7-7/perfect.git
cd perfect/backend

```

2. Install dependencies:
```

npm install

```

3. Create a `.env` file in the root of `backend/` (see [Environment Variables](#environment-variables) below for required vars).

4. Start the development server:
```

npm run dev

```

5. The API runs on `http://localhost:5000` (or your configured port).

---

## Environment Variables

Create a `.env` file with the following variables:

```

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
ADMIN_KEY=your_admin_secret_key

```

---

## API Overview

### Authentication

- `POST /api/auth/send-otp` — Send OTP to student or tutor email  
- `POST /api/auth/verify-otp` — Verify OTP and set password  
- `POST /api/auth/login` — Login with register number and password  
- `GET /api/auth/me` — Get logged-in user profile (protected route)  

### Tutors

- `POST /api/tutors/register` — Register a tutor with admin key  
- `POST /api/tutors/login` — Tutor login  
- `GET /api/tutors/students` — Get all students with points [Filterable by batch, branch]  
- `GET /api/tutors/students/:id` — Get detailed student info (to be implemented)  
- `GET /api/tutors/certificates/pending` — Get certificates pending approval  
- `POST /api/tutors/certificates/:certificateId/review` — Review certificate  

### Categories

- `POST /api/categories` — Add a new category (tutor only)  
- `GET /api/categories` — List all categories  
- `POST /api/categories/:categoryId/subcategory` — Add a subcategory (tutor only)  

### Certificates

- `POST /api/certificates/upload` — Upload certificate (student only)  
- `GET /api/certificates/my-certificates` — Get logged-in student’s certificates  

---

## Project Structure

```

backend/
├── controllers/       \# Request handlers for different resources
├── middleware/        \# Authentication and authorization middleware
├── models/            \# Mongoose schemas/models
├── routes/            \# Route definitions for APIs
├── utils/             \# Utility modules (ImageKit config, multer setup)
├── uploads/           \# Multer temp uploads (ignored in git)
├── .env               \# Environment variables (ignored in git)
├── index.js           \# Server entry point
├── package.json       \# Dependencies and scripts
└── README.md          \# Project documentation

```

---

## Important Notes

- **Security:** Never commit `.env` or sensitive keys to version control.  
- **File uploads:** Currently use in-memory multer storage and upload to ImageKit.  
- **Admin routes:** Protected by `ADMIN_KEY` header (`x-admin-key`).  
- **Development:** Use `npm run dev` for auto reload with nodemon.  
- **Testing:** Use Postman or similar tools to test endpoints before frontend integration.

---

## Contributing

Contributions and suggestions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the [ISC License](LICENSE).

---

*© 2025 LPT*
```



