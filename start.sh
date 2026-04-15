#!/bin/bash
npx concurrently \
  --names "backend,frontend" \
  --prefix-colors "blue,green" \
  --kill-others-on-fail \
  "node backend/server.js" \
  "npx vite --port 5000 --host 0.0.0.0"
