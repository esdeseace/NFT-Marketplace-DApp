@echo off
setlocal

if exist blockchain\node_modules (
    set wait_time=10
) else (
    set wait_time=30
)

title Terminal 1
start cmd /k "cd blockchain && yarn && yarn start"

ping -n %wait_time% 127.0.0.1 >nul
title Terminal 2
start cmd /k "cd blockchain && yarn migrate && cd ../backend && yarn && yarn start"

ping -n 10 127.0.0.1 >nul
title Terminal 3
start cmd /k "cd frontend && yarn && yarn dev"

endlocal
