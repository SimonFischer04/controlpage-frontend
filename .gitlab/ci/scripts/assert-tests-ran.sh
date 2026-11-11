#!/usr/bin/env sh
# Fails if the JUnit reports contain no executed test.
# Skipped tests are not written to the reports, so this catches a run in which every test was skipped
# (e.g. the full-stack specs when CYPRESS_backendUrl is not set), which Cypress itself reports as a success.
set -eu

RESULTS_DIR="${1:-cypress/results}"

count=$(cat "$RESULTS_DIR"/*.xml 2> /dev/null | grep -c '<testcase' || true)

if [ "$count" -eq 0 ]; then
  echo "No test was executed (no test case in $RESULTS_DIR): were all tests skipped?"
  exit 1
fi

echo "$count tests were executed."
