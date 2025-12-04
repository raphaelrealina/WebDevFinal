FitTrack

This repository contains the full-stack MERN (MongoDB, Express, React, Node.js) application for FitTrack, a personal health and fitness management tool.

🚀 Quick Start Guide

Follow these steps to get the application running locally.

Prerequisites

You must have the following software installed on your machine:

Node.js (LTS recommended)

npm (comes with Node.js)

Git

1. Clone the Repository

Clone the project from the shared repository and navigate into the root directory:

# Clone the repository (adjust URL as needed)
git clone <YOUR_REPOSITORY_URL> webdevfinal
cd webdevfinal


2. Install Dependencies

The root package.json contains a script to run npm install in the root, server, and client directories simultaneously.

Run the following command in the root webdevfinal directory:

npm run install-all


3. Database Configuration (Critical Step)

The application connects to a MongoDB Atlas cluster. The connection string (URI) is stored in a hidden environment file (.env) that is not included in the repository for security reasons.

Create the file: In the server/ directory, create a new file named .env.

Paste the URI: Obtain the official MONGODB_URI and JWT_SECRET from your team lead and paste them into the file. You must replace the placeholder password with the actual database password.

File Path: webdevfinal/server/.env

# server/.env

# CRITICAL: Replace YOUR_ACTUAL_PASSWORD with the correct credential
MONGODB_URI=mongodb+srv://raphaelrealina:YOUR_ACTUAL_PASSWORD@fittrackcluster.bj53tfn.mongodb.net/fittrackdb?appName=FitTrackCluster

PORT=5000
JWT_SECRET=supersecurefittrackkey


4. Run the Application

The root npm start command uses concurrently to launch both the server and the client simultaneously.

Run the following command in the root webdevfinal directory:

npm start


This command will:

Start the Express server using nodemon on http://localhost:5000.

Start the React client using react-scripts on http://localhost:3000.

5. Verification

Check your terminal and browser to confirm the setup is functional:

Terminal Output (Server Console): Look for the success message:

✅ MongoDB connected successfully.


Browser (http://localhost:3000): The webpage should display:

Backend Status: FitTrack Backend API is operational!


📂 Project Structure

The project uses a standard MERN separation of concerns:

webdevfinal/
├── client/          # ⬅️ Frontend (React Application)
│   ├── src/
│   └── package.json
├── server/          # ⬅️ Backend (Node/Express API)
│   ├── controllers/ # API logic (registration, CRUD)
│   ├── models/      # Mongoose Schemas (User, Meal, Workout)
│   ├── routes/      # Express endpoints
│   ├── .env         # Environment variables (DB URI, Secrets)
│   ├── server.js    # Express entry point
│   └── package.json
└── package.json     # Root, used for concurrently scripts
