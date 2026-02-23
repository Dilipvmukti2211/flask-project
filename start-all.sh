#!/bin/bash
cd /home/vmukti/.pro

# Start status-checker.js in background and log to file
node status-checker.js >> status-checker.log 2>&1 &

# Start server.js in foreground and log to file
exec node server.js >> server.log 2>&1

