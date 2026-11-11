#!/usr/bin/env sh
# Starts backend.jar in the background (logging to backend.log) and waits until it serves its OpenAPI spec.
set -eu

BACKEND_URL="${BACKEND_URL:-http://localhost:42000}"
TIMEOUT="${BACKEND_START_TIMEOUT:-180}"

probe() {
  curl -sf --max-time 5 "$BACKEND_URL/v3/api-docs" > /dev/null
}

fail() {
  echo "$1"
  tail -n 100 backend.log 2> /dev/null || true
  exit 1
}

# Otherwise the readiness check below could be answered by that instance instead of the one started here.
if probe; then
  echo "Something already answers at $BACKEND_URL, refusing to start a second backend."
  exit 1
fi

nohup java -jar backend.jar > backend.log 2>&1 &
pid=$!
start=$(date +%s)

until probe; do
  if ! kill -0 "$pid" 2> /dev/null; then
    fail "Backend exited unexpectedly:"
  fi
  if [ $(($(date +%s) - start)) -ge "$TIMEOUT" ]; then
    kill "$pid" 2> /dev/null || true
    fail "Backend did not start within ${TIMEOUT}s:"
  fi
  sleep 2
done

if ! kill -0 "$pid" 2> /dev/null; then
  fail "$BACKEND_URL answers, but the backend started here exited:"
fi

echo "Backend is up at $BACKEND_URL (after $(($(date +%s) - start))s)"
