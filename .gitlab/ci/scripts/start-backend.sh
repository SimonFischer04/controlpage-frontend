#!/usr/bin/env sh
# Starts backend.jar in the background (logging to backend.log) and waits until it serves its OpenAPI spec.
set -eu

BACKEND_URL="${BACKEND_URL:-http://localhost:42000}"
TIMEOUT="${BACKEND_START_TIMEOUT:-180}"

nohup java -jar backend.jar > backend.log 2>&1 &
pid=$!

elapsed=0
until curl -sf "$BACKEND_URL/v3/api-docs" > /dev/null; do
  if ! kill -0 "$pid" 2> /dev/null; then
    echo "Backend exited unexpectedly:"
    tail -n 100 backend.log
    exit 1
  fi
  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo "Backend did not start within ${TIMEOUT}s:"
    tail -n 100 backend.log
    exit 1
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done

echo "Backend is up at $BACKEND_URL (after ${elapsed}s)"
