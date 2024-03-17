#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR/../docs/data

# Some failsafes to avoid accidental work loss
if [[ "$(git branch --show-current)" != "gh-pages" ]]; then
  echo "Error: must be on ""gh-pages"" branch"
  exit 1
fi
if [[ -n $(git status -s) ]]; then
  echo "Error: Working directory not clean"
  exit 1
fi
if [[ -n $(git diff origin/gh-pages..HEAD) ]]; then
  echo "Error: Unpushed commits"
  exit 1
fi

# Fetch latest and hard reset since this branch is force-pushed
git branch gh-pages-backup-$(date +%Y-%m-%d-%H-%M-%S)
git fetch && git reset --hard origin/gh-pages
if [[ $? -ne 0 ]]; then
  exit 1
fi

# Download latest racelog from google sheets
../../updater/download.py > racelog.json
if [[ $? -ne 0 ]]; then
  git reset --hard origin/gh-pages
  exit 1
fi
sha512sum racelog.json > racelog.json.sha512

# Push if any changes to racelog
git add -f racelog.json racelog.json.sha512
git commit -m 'Update racelog.json'
git push origin gh-pages || git reset --hard origin/gh-pages
