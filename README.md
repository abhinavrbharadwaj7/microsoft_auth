# Microsoft Authentication Project

This repository contains a Microsoft Authentication implementation using React (frontend) and Node.js (backend) with MongoDB.

## Getting Started

Follow the steps below to set up and run the project on your local machine.

### Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (if using locally)

### Clone the Repository

```sh
git clone https://github.com/abhinavrbharadwaj7/microsoft_auth.git
cd microsoft_auth
```

### Install Dependencies

Since `node_modules` is not included in the repository, install dependencies manually:

#### Install Frontend Dependencies

```sh
cd frontend
npm install
```

#### Install Backend Dependencies

```sh
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following:

```sh
PORT=5000
MONGODB_URI=mongodb://localhost:27017/my_poc_database
AZURE_AD_TENANT_ID=f8cdef31-a31e-4b4a-93e4-5f571e91255a
AZURE_AD_CLIENT_ID=5c8def70-31ba-4255-a5a6-3ac6dc699b8d
AZURE_AD_CLIENT_SECRET=400f508f-65da-4c17-b27d-3402c01d16cb
AZURE_AD_REDIRECT_URI=http://localhost:5000/auth/microsoft/callback
SESSION_SECRET=MKWQ8GskLFcnA9b6hADt6dMZwmu2j9Gu
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development
BASE_URL=http://localhost:5000
```

Replace placeholders with your actual credentials.

### Running the Project

#### Start the Backend

```sh
cd backend
npm start
```

By default, the backend runs on `http://localhost:5000`.

#### Start the Frontend

Open a new terminal and run:

```sh
cd frontend
npm start
```

By default, the frontend runs on `http://localhost:3000`.

### Usage

Once both frontend and backend are running:
1. Open `http://localhost:3000` in your browser.
2. Sign in using Microsoft authentication.
3. View your profile information.

### Contributing

Feel free to fork the repository and submit pull requests for improvements!

### License

This project is licensed under the MIT License.
