# School Beta Testing Quick Guide

This is the simplest way to run Centimeter on school Wi-Fi for a live test with 2+ devices.

## 1) Find your laptop IP on school Wi-Fi

In PowerShell:

```powershell
ipconfig
```

Look for IPv4 Address under your active Wi-Fi adapter.
Example: 192.168.8.44

Use this value below as YOUR_IP.

## 2) Start backend so other devices can reach it

Open PowerShell in the backend folder and run:

```powershell
# Example: Set-Location D:\Projects\centimeter-backend\centimeter
Set-Location <PATH_TO_BACKEND>\centimeter
$env:EXTRA_ALLOWED_HOSTS="YOUR_IP"
$env:FRONTEND_ORIGINS="http://localhost:3000,http://127.0.0.1:3000,http://YOUR_IP:3000"
..\env\Scripts\python.exe manage.py runserver 0.0.0.0:8000
```

## 3) Point frontend API to your laptop IP

Edit this file:
- centimeter/.env

Set:

```env
VITE_BACKEND_URL=http://YOUR_IP:8000
```

## 4) Start frontend exposed on port 3000

Open another PowerShell in the frontend folder:

```powershell
# Example: Set-Location D:\Projects\centimeter-frontend\centimeter
Set-Location <PATH_TO_FRONTEND>\centimeter
npm run dev:expose
```

If port 3000 is busy:

```powershell
$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($listeners) {
  $procIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($procId in $procIds) { taskkill /PID $procId /F }
}
```

Then run npm run dev:expose again.

## 5) Test from a second device

On phone/classmate laptop (same Wi-Fi), open:

- http://YOUR_IP:3000

Quick smoke test:
1. Host logs in and opens a session.
2. Second device joins with code.
3. Host starts presentation and moves slides.
4. Second device follows slide changes in real time.

## If it still fails

- Make sure both devices are on the exact same school Wi-Fi.
- Allow Python and Node through Windows Firewall on Private networks.
- Restart both servers after changing IP or .env.
- Some school networks block device-to-device traffic. If so, use a tunnel (Cloudflare Tunnel or ngrok) for demo day.
