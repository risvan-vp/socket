# Real-Time Chat Demo

A React and Socket.IO project for exchanging messages in a shared chat room.

## Features
- Join the global room with a username.
- Send and receive messages without reloading the page.
- See system messages when someone joins or leaves.
- Automatically scroll to new messages.

## Stack
React, Vite, Socket.IO, Express, and Node.js.

## Run locally
Start the backend:
```bash
cd backend
npm install
node server.js
```

In a second terminal, from the repository root:
```bash
cd frontend
npm install
npm run dev -- --port 5174 --strictPort
```

Open `http://localhost:5174` in two browser tabs and join with different usernames. The API listens on port 5000. The Socket.IO CORS configuration allows `http://localhost:5174`, so keep the frontend on that port.

## Structure
- `backend/server.js`: connection, room, message, and disconnect handlers.
- `frontend/src/Chat.jsx`: chat interface and message listeners.
- `frontend/src/socket.jsx`: Socket.IO client connection.

## Scope
Messages are kept in browser memory. This demo has no persistent chat history or account authentication.

From `frontend/`, use `npm run build` for a production bundle and `npm run lint` for lint checks.
