#!/bin/bash
# dev.sh — Kill zombie processes, clean cache, start dev server
# Usage: ./dev.sh [port]  (default: 3000)

set -e

PORT=${1:-3000}
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Portfolio Dev Server ==="
echo "Project: $PROJECT_DIR"
echo "Port: $PORT"
echo ""

# 1. Kill anything on the target port
kill_port() {
  local p=$1
  local pids=$(lsof -ti ":$p" 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "Killing processes on port $p: $pids"
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 0.5
  fi
}

# Kill common dev ports
for p in 3000 3001 3002; do
  kill_port $p
done

echo "Ports cleared."

# 2. Kill orphan Next.js processes
orphans=$(pgrep -f "next dev\|next start\|next-router-worker" 2>/dev/null || true)
if [ -n "$orphans" ]; then
  echo "Killing orphan Next.js processes: $orphans"
  echo "$orphans" | xargs kill -9 2>/dev/null || true
  sleep 0.5
fi

# 3. Clean stale caches
if [ -d "$PROJECT_DIR/.next" ]; then
  echo "Cleaning .next cache..."
  rm -rf "$PROJECT_DIR/.next"
fi

# 4. Ensure correct Node version
if command -v nvm &>/dev/null; then
  nvm use 2>/dev/null || true
fi

# 5. Start dev server
echo ""
echo "Starting dev server on http://localhost:$PORT ..."
echo "Press Ctrl+C to stop."
echo ""

cd "$PROJECT_DIR"
exec npx next dev -p "$PORT"
