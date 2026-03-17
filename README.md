# DevHire

DevHire is a Node.js-based job application platform that allows users to browse jobs, apply for positions, and manage job postings. The project uses Express.js for the backend server, MongoDB for data storage, and integrates with Cloudinary for file uploads. It features authentication, role-based access control, and file upload capabilities for resumes.

## Features

- User registration and authentication (JWT-based)
- Role-based access control (admin, employer, applicant)
- Job posting creation, update, and deletion
- Application submission with resume upload
- Cloudinary integration for file storage
- Multer middleware for handling file uploads
- RESTful API structure
- Modular codebase with controllers, models, routes, and middleware

## Project Structure

```
src/
  app.js                # Main Express app setup
  server.js             # Server entry point
  config/
    cloudinary.js       # Cloudinary configuration
    db.js               # MongoDB connection setup
    multer.js           # Multer configuration for file uploads
  controllers/
    applicationController.js # Application logic
    jobController.js         # Job management logic
    userController.js        # User management logic
  middleware/
    auth.js             # Authentication middleware
    roleMiddleware.js   # Role-based access control
    upload.js           # File upload middleware
  models/
    Application.js      # Application schema/model
    Job.js              # Job schema/model
    User.js             # User schema/model
  routes/
    applicationRoutes.js # Application-related routes
    jobRoutes.js         # Job-related routes
    userRoutes.js        # User-related routes
  utils/                # Utility functions
uploads/
  resumes/              # Uploaded resumes (if not using Cloudinary)
package.json            # Project metadata and dependencies
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- MongoDB instance (local or cloud)
- Cloudinary account (for file uploads)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd DevHire
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     PORT=5000
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
     CLOUDINARY_API_KEY=<your-cloudinary-api-key>
     CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
     ```

### Running the Application
```bash
npm start
```
The server will start on the port specified in your `.env` file (default: 5000).

## API Endpoints

### User Routes
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — User login
- `GET /api/users/profile` — Get user profile (auth required)

### Job Routes
- `GET /api/jobs` — List all jobs
- `POST /api/jobs` — Create a new job (employer/admin only)
- `PUT /api/jobs/:id` — Update a job (employer/admin only)
- `DELETE /api/jobs/:id` — Delete a job (employer/admin only)

### Application Routes
- `POST /api/applications` — Apply for a job (resume upload supported)
- `GET /api/applications` — List all applications (admin/employer only)
- `GET /api/applications/:id` — Get application details

## Technologies Used
- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary
- Multer
- JWT (JSON Web Tokens)
- dotenv

## Folder Descriptions
- **config/**: Configuration files for database, Cloudinary, and Multer
- **controllers/**: Business logic for users, jobs, and applications
- **middleware/**: Authentication, role checks, and upload handling
- **models/**: Mongoose schemas for core entities
- **routes/**: API route definitions
- **utils/**: Utility/helper functions
- **uploads/**: Local storage for uploaded files (if not using Cloudinary)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please open an issue in the repository.
