@echo off
echo Cleaning up old dependencies...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
rmdir /s /q .next 2>nul

echo.
echo Installing fresh dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev
