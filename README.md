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
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_ID=your_azure_client_id
CLIENT_SECRET=your_azure_client_secret
TENANT_ID=your_azure_tenant_id
REDIRECT_URI=http://localhost:3000
SESSION_SECRET="32 number & characters"
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
