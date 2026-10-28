# Vehicle Parking Management System

A full-stack web application for managing vehicle parking registrations and calculating parking charges. The system provides a web interface to register vehicles, view vehicle records, update details, delete records, and calculate parking fees based on vehicle type and parking duration.

## Features

- **Dashboard:** View parking management information.
- **Vehicle Management:** Add, view, update, and delete vehicle records.
- **Vehicle Registration:** Store vehicle ID, registration number, owner name, and vehicle type.
- **Parking Charge Calculator:** Calculate parking fees based on vehicle type and parking hours.
- **Responsive Interface:** Built with React and Bootstrap.
- **REST API:** Backend endpoints handle vehicle operations and parking charge calculations.
- **Database Integration:** Store vehicle records in MongoDB.

## Technologies Used

### Frontend
- React.js
- Bootstrap
- Axios
- Vite

### Backend
- Node.js
- Express.js
- Mongoose
- REST API

### Database
- MongoDB

## Parking Charges

| Vehicle Type | Rate per Hour |
|---|---:|
| Bike | ₹10 |
| Car | ₹20 |
| Truck | ₹40 |
| Bus | ₹50 |
| Other | ₹15 |

**Formula:** Total Parking Charge = Hourly Rate × Parking Hours

## Project Structure

```text
vehicle-parking-management-system/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB Community Server
- Git (optional)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/MADINENIMADHANKUMAR/vehicle-parking-management-system.git
cd vehicle-parking-management-system
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/vehicle_parking
```

Make sure the MongoDB service is running.

### 3. Start the Backend

From the `server` directory, run:

```bash
npm run dev
```

The backend server runs at `http://localhost:5000`.

### 4. Install Frontend Dependencies

Open a second terminal in the project root:

```bash
cd client
npm install
```

### 5. Start the Frontend

From the `client` directory, run:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

Keep both the frontend and backend running while using the application.

## API Functionality

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/vehicles` | Register a vehicle |
| GET | `/api/vehicles` | Retrieve vehicle records |
| PUT | `/api/vehicles/:id` | Update a vehicle record |
| DELETE | `/api/vehicles/:id` | Delete a vehicle record |
| POST | `/api/parking/calculate` | Calculate parking charges |

The update and delete endpoints use the identifier expected by the backend implementation.

## Database

The application uses MongoDB to store vehicle information. Mongoose provides the connection between the Node.js backend and the database.

**Database name:** `vehicle_parking`
- Integrating frontend, backend, and database components.
- Calculating parking charges using application logic.
