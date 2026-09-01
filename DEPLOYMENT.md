# TCC Attendance Portal v2

Frontend: React/Vite PWA in `client/`.
Backend: Express + SQLite API in `server/`.

## Frontend
Set `VITE_API_URL` to the public API URL, including `/api`, then run `npm install && npm run build` in `client`.

## Backend
Set `PORT`, `JWT_SECRET`, `CLIENT_ORIGIN` and `DB_FILE`. Use persistent disk for SQLite in production.

## Offline
The installed PWA caches its shell and stores attendance actions in IndexedDB when the network is unavailable. It retries synchronization when connectivity returns and uses Background Sync where supported. The server remains authoritative for GPS accuracy, geofence, duplicate prevention and attendance state.