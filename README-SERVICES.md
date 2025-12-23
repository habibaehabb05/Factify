# Factify Services Management

## Service Ports

- **Node.js Backend**: Port 5000
- **Python RAG Service**: Port 3002
- **React Frontend**: Port 5173

## Management Scripts

### Start All Services
```powershell
.\start-all.ps1
```
Opens three terminal windows with each service running.

### Stop All Services
```powershell
.\stop-all.ps1
```
Kills all processes on ports 5000, 3002, and 5173.

### Check Port Status
```powershell
.\check-ports.ps1
```
Interactive script to check which ports are in use and optionally kill processes.

## Manual Commands

### Node.js Backend
```bash
cd server
node app.js
```

### Python RAG Service
```bash
cd RAG
python main.py
```

### React Frontend
```bash
cd client
npm run dev
```

## Debug Logging

All services now include comprehensive debug logging:

- **Client**: Look for `[CLIENT DEBUG]` and `[CLIENT ERROR]` in browser console
- **Server**: Look for `[AI SERVICE DEBUG]` and `[AI SERVICE ERROR]` in Node.js terminal
- **RAG**: Look for `[RAG DEBUG]`, `[RAG WARNING]`, and `[RAG ERROR]` in Python terminal

## Troubleshooting

If ports are already in use:
1. Run `.\check-ports.ps1` to find and kill conflicting processes
2. Or run `.\stop-all.ps1` to clean all Factify ports
3. Then run `.\start-all.ps1` to restart

If services fail to start:
- Check that all dependencies are installed (`npm install` in client/server, `pip install -r requirements.txt` in RAG)
- Verify environment variables are set (`.env` files in server and RAG directories)
- Check debug logs in each terminal for specific errors
