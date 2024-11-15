### Magic Movers API

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
└── index.ts           # Application entry point
```

---

## Example API Routes

### Add a Magic Mover
**POST** `/movers`
```json
{
  "name": "Magic Mover 1",
  "capacity": 100
}
```

### Load Items
**POST** `/movers/:id/load`
```json
{
  "items": ["itemId1", "itemId2"]
}
```

### Start a Mission
**POST** `/movers/:id/start`
```json
{}
```

### End a Mission
**POST** `/movers/:id/end`
```json
{}
```

### Get Activity Logs
**GET** `/movers/:id/logs`

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