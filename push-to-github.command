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
  echo
  read -r -p "Press return to close."
  exit 0
fi

echo "Push failed (exit $status)."
echo
echo "Most likely your Mac has an old GitHub login saved and reused it"
echo "without asking you. Let's clear it so you get a fresh prompt."
echo
read -r -p "Clear the saved GitHub login for this Mac? [y/N] " clr
case "$clr" in
  [yY]*)
    printf 'protocol=https\nhost=github.com\n\n' | git credential-osxkeychain erase
    printf 'protocol=https\nhost=github.com\nusername=bingintigris\n\n' | git credential-osxkeychain erase
    echo "Cleared. (This only removes the cached copy. Nothing on GitHub changed.)"
    echo
    echo "Now trying again. When it asks:"
    echo "  Username : your GitHub username (likely  bingintigris )"
    echo "  Password : paste a personal access token, NOT your account password"
    echo
    read -r -p "Press return to continue."
    echo
    git push origin main
    status=$?
    echo
    if [ $status -eq 0 ]; then
      echo "Done. Pushed to GitHub."
      echo "Netlify will pick it up and redeploy in a minute or two."
      echo
      read -r -p "Press return to close."
      exit 0
    fi
    echo "Still failing (exit $status)."
    ;;
  *) echo "Skipped." ;;
esac

echo
echo "------------------------------------------------"
echo "How to make a token that works"
echo "------------------------------------------------"
echo "1. Go to  https://github.com/settings/tokens"
echo "2. 'Generate new token'  ->  'Generate new token (classic)'"
echo "3. Note: intigris-site   Expiration: 90 days (or No expiration)"
echo "4. Tick the top checkbox called  repo"
echo "5. Generate token, then Copy it. It starts with  ghp_"
echo "   GitHub shows it only once."
echo "6. Run this script again. Username = your GitHub username."
echo "   Password = paste that ghp_... token."
echo
echo "Note: pasting into Terminal shows nothing at all. That is normal."
echo "Paste once with Command-V and press return."
echo
echo "Nothing was lost. Your commit is safe locally; just run this again."

echo
read -r -p "Press return to close."
