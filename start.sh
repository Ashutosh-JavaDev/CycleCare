#!/bin/bash
node backend/server.js &
npx vite --port 5000 --host 0.0.0.0
