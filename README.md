# Backend Development Exit Test — 2028 Batch

This repository contains both required practical tasks.

## Folder structure

```text
backend_exam_RegisterNo_KuldeepSingh/
├── task-1-library-api/
│   ├── models/Book.js
│   ├── routes/bookRoutes.js
│   ├── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── task-2-student-portal/
│   ├── models/User.js
│   ├── routes/authRoutes.js
│   ├── middleware/authMiddleware.js
│   ├── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── outputs/
    └── README.md
```

> Replace `RegisterNo` in the repository/folder name with your actual registration number before submission.

## Requirements

- Node.js 18 or later
- MongoDB running locally, or a MongoDB Atlas connection string
- Postman or Thunder Client

## Task 1 — Library Book Management API

### Run

```bash
cd task-1-library-api
npm install
```

Copy `.env.example` to `.env` and set your MongoDB connection string.

```env
MONGO_URI=mongodb://127.0.0.1:27017/library_db
PORT=3000
```

Start:

```bash
npm start
```

Server: `http://localhost:3000`

### Endpoints

| Method | URL | Purpose |
|---|---|---|
| POST | `/books` | Create a book |
| GET | `/books` | List all books |
| GET | `/books/:id` | Get one book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

Example POST body:

```json
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "price": 299,
  "category": "Fiction",
  "isAvailable": true
}
```

Example PUT body:

```json
{
  "price": 349,
  "isAvailable": false
}
```

### Test sequence

1. POST `/books` with the example body — expect **201 Created**.
2. GET `/books` — expect **200 OK** and the created book.
3. Copy the returned `_id`.
4. GET `/books/BOOK_ID` — expect **200 OK**.
5. PUT `/books/BOOK_ID` with the update body — expect **200 OK**.
6. DELETE `/books/BOOK_ID` — expect **200 OK**.
7. GET `/books/INVALID_ID` — expect **400 Bad Request** for malformed ID.
8. GET `/books/64a000000000000000000000` — expect **404 Not Found** if that valid-format ID does not exist.

Take screenshots of the requests/responses in Postman and the saved documents in MongoDB Compass.

## Task 2 — Student Portal

### Run

Open a second terminal:

```bash
cd task-2-student-portal
npm install
```

Copy `.env.example` to `.env` and set values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/student_portal_db
JWT_SECRET=replace_with_a_long_random_secret
PORT=3001
```

Start:

```bash
npm start
```

Server: `http://localhost:3001`

### Endpoints

| Method | URL | Access |
|---|---|---|
| POST | `/register` | Public |
| POST | `/login` | Public |
| GET | `/profile` | Logged-in user |
| GET | `/students` | Admin only |

### Test sequence

Register an admin (for the practical test, the task explicitly asks registration to accept `role`):

`POST http://localhost:3001/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

Register a student:

```json
{
  "name": "Student One",
  "email": "student@example.com",
  "password": "student123",
  "role": "student"
}
```

Login as admin:

`POST http://localhost:3001/login`

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Copy `token` from the response. In Postman, choose **Authorization → Bearer Token** and paste it.

- GET `/profile` with admin token — **200 OK**
- GET `/students` with admin token — **200 OK**
- Login as student and use student token on `/students` — **403 Forbidden**
- GET `/profile` without token — **401 Unauthorized**

### Important security note

The assignment explicitly requires accepting `role` during registration, so this practical implementation does so to demonstrate both student and admin authorization. In a real production system, public users must never be allowed to self-assign the `admin` role. Admin accounts should be provisioned through a trusted, restricted process.

## Screenshots to capture

Save your own actual screenshots in `outputs/`:

### Task 1
- `T1-01-create-book.png`
- `T1-02-list-books.png`
- `T1-03-get-book.png`
- `T1-04-update-book.png`
- `T1-05-delete-book.png`
- `T1-06-mongodb-compass.png`

### Task 2
- `T2-01-register-admin.png`
- `T2-02-register-student.png`
- `T2-03-login.png`
- `T2-04-profile-with-token.png`
- `T2-05-profile-without-token.png`
- `T2-06-students-as-admin.png`
- `T2-07-students-as-student.png`

Do not submit placeholder or fabricated screenshots. The `outputs/README.md` file contains the checklist.

## GitHub submission checklist

1. Replace the placeholder registration number in the repository name.
2. Run both projects and test the endpoints.
3. Add actual screenshots to `outputs/`.
4. Do **not** upload `.env` files or real secrets. `.gitignore` excludes them.
5. Create a **Public** GitHub repository.
6. Upload the complete project structure and confirm files are visible.
7. Open the repository URL in a private/incognito browser window to verify public access.
8. Paste the repository URL into the official Google Form and submit before the deadline.
