#!/bin/bash
# Pushes the committed changes in this folder to GitHub.
# Double-click this file. It uses the GitHub login already on your Mac.

cd "$(dirname "$0")" || exit 1

echo "================================================"
echo "  Pushing Intigris website to GitHub"
echo "================================================"
echo

echo "Repository : $(git config --get remote.origin.url)"
echo "Branch     : $(git branch --show-current)"
echo

echo "About to push these commits:"
git --no-pager log --oneline origin/main..HEAD
echo

read -r -p "Push to GitHub? [y/N] " reply
case "$reply" in
  [yY]*) ;;
  *) echo "Cancelled. Nothing was pushed."; echo; read -r -p "Press return to close."; exit 0 ;;
esac

echo
git push origin main
status=$?
echo

if [ $status -eq 0 ]; then
  echo "Done. Pushed to GitHub."
  echo "Netlify will pick it up and redeploy in a minute or two."
else
  echo "Push failed (exit $status)."
  echo
  echo "If it asked for a username and password:"
  echo "  GitHub no longer accepts account passwords over https."
  echo "  Use your GitHub username, and a personal access token as the password."
  echo "  Create one at: https://github.com/settings/tokens"
  echo "  Classic token, tick the 'repo' scope."
  echo
  echo "Nothing was lost. Your commit is safe locally; just run this again."
fi

echo
read -r -p "Press return to close."
