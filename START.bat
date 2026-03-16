@echo off
title BlogHub - Full Stack Application
echo.
echo ============================================
echo  BlogHub - Full Stack Blog Application
echo ============================================
echo.

cd /d "%~dp0backend"
echo Starting Backend Server...
start "Backend Server" cmd /k "node server.js"

timeout /t 3 /nobreak

cd /d "%~dp0"
echo Starting Frontend Server...
start "Frontend Server" cmd /k "python -m http.server 3000 --bind 127.0.0.1"

echo.
echo ============================================
echo Both servers are starting...
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔌 Backend: http://localhost:5000
echo 📚 Database: MongoDB on port 27017
echo.
echo Demo Account:
echo   Email: sarah@example.com
echo   Password: password123
echo.
echo ============================================
echo.
timeout /t 5
