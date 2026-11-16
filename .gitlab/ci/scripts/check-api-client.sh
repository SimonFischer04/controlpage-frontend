#!/usr/bin/env sh
# Fails if the (just regenerated) API client in src/gen differs from the committed one.
# Writes the difference to api-client.patch, which can be applied with `git apply api-client.patch`.
set -eu

# include new, not yet tracked files in the diff
git add --intent-to-add -- src/gen

if git diff --quiet -- src/gen; then
  echo "src/gen is up to date with the backend API."
  exit 0
fi

git --no-pager diff -- src/gen > api-client.patch

echo "src/gen is OUTDATED: the committed API client does not match the backend API."
echo "Run 'npm run gen' against a running backend (or apply the api-client.patch artifact) and commit the result."
echo
git --no-pager diff --stat -- src/gen
echo
cat api-client.patch
exit 1
