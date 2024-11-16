```markdown
# Magic Movers API

**Magic Movers API** is a RESTful service built with **Express**, **TypeScript**, and **Mongoose** for managing Magic Movers, their items, and their missions. The API supports logging of state transitions, mission management, and retrieving activity logs.

---

## Features
- **Add Magic Movers**: Create a new mover.
- **Add Items**: Create items to load into movers.
- **Load Items**: Load items into a mover with activity logs.
- **Start a Mission**: Change a mover's state to "on-mission" and log the transition.
- **End a Mission**: Unload all items, log the transition, and set the mover back to "resting".
- **Activity Logs**: Fetch all activity logs of a specific mover.
- **Leaderboard**: List movers by the number of completed missions in descending order.

---

## Technologies Used
- **Node.js**: Runtime environment for executing JavaScript on the server side.
- **Express.js**: Fast, minimalist web framework for building REST APIs.
- **TypeScript**: Type-safe language built on JavaScript.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **MongoDB**: NoSQL database for storing Magic Movers and related data.
- **Swagger**: For API documentation.
- **Docker**: Containerization for consistent and portable deployment.
- **Awilix**: Lightweight dependency injection container for managing app services and dependencies.


---

## Prerequisites
- Node.js (>= 14.x)
- MongoDB (>= 4.0)
- npm (>= 6.x)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/magic-movers-api.git
cd magic-movers-api
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/magic-movers
```

### 4. Start the Development Server
```bash
yarn dev
```
The server will start on the specified `PORT` (default: `3000`).

### 5. Build for Production
```bash
yarn build
```

### 6. Run Production Build
```bash
yarn start
```

---

## Dockerizing the App

### 1. Build Docker Image
You can build the Docker image for the app using the following command:

```bash
docker build -t magic-movers-api .
```

### 2. Run Docker Container
To run the app inside a Docker container, use the following command:

```bash
docker run -p 3000:3000 --env-file .env magic-movers-api
```
This will start the app in a Docker container, and it will be accessible at `http://localhost:3000`.

---

## API Documentation
### Swagger Documentation
Swagger documentation is available at:  
`http://localhost:{PORT}/api-docs`

---

## Scripts
| Command      | Description                                  |
|--------------|----------------------------------------------|
| `yarn dev`   | Starts the development server using nodemon. |
| `yarn build` | Compiles TypeScript to JavaScript.           |
| `yarn start` | Starts the compiled production server.       |
| `yarn test`  | Runs the tests.                              |

---

## Running Tests

### 1. Install Test Dependencies
Before running the tests, ensure you have the necessary dependencies installed:
```bash
yarn install
```

### 2. Run Tests
To run the tests, execute the following command:
```bash
yarn test
```

This will run all tests in the `tests` folder and display the results in the terminal. You can configure your tests using the testing framework.

---

## Project Structure
```
src
├── controllers        # Request handlers
├── middlewares        # Middleware functions
├── services           # Services
├── models             # Mongoose schemas/models
├── routes             # API routes
├── utils              # Helper functions
├── types              # Types
├── tests              # Tests
└── index.ts           # Application entry point
```

---

## Dependencies
| Package     | Version    | Description                       |
|-------------|------------|-----------------------------------|
| express     | ^4.x       | Web framework for Node.js         |
| mongoose    | ^6.x       | MongoDB object modeling           |
| typescript  | ^5.x       | TypeScript language support       |
| dotenv      | ^10.x      | Environment variable management   |
| swagger-ui-express | ^4.x | Swagger integration for API docs |

---

## Development Dependencies
| Package        | Version    | Description                   |
|-----------------|------------|-------------------------------|
| @types/express | ^4.x       | TypeScript types for Express  |
| nodemon        | ^2.x       | Auto-restart for dev server   |
| ts-node        | ^10.x      | Run TypeScript directly       |

---
## Author
Developed by **Daniel**.
```