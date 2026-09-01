# TCC Attendance Portal

Tanga City Council HQ attendance portal with universal authentication, HR onboarding, GPS geofencing, late threshold, device binding and offline PWA attendance synchronization.

## Local
`cd server && npm install && npm run dev`
`cd client && npm install && npm run dev`

First launch creates the Primary HR Admin. Staff and Field Students are created by HR and receive temporary passwords that force a reset.

## Offline
Attendance can be captured with a valid GPS reading while offline. The action is stored locally in IndexedDB and synchronized when network connectivity returns. The server remains authoritative for final GPS/geofence validation and duplicate/state checks.