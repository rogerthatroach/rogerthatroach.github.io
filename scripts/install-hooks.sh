#!/bin/bash
# Install git hooks from .githooks/ into .git/hooks/ as symlinks.
# Run once per clone; re-run after adding a new hook to .githooks/.

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
SRC="$REPO_ROOT/.githooks"
DEST="$REPO_ROOT/.git/hooks"

if [ ! -d "$SRC" ]; then
  echo "✗ $SRC not found. Run from project root."
  exit 1
fi
if [ ! -d "$DEST" ]; then
  echo "✗ $DEST not found. Is this a git repo?"
  exit 1
fi

echo "Installing git hooks from .githooks/ → .git/hooks/ ..."
for hook in "$SRC"/*; do
  [ -f "$hook" ] || continue
  name=$(basename "$hook")
  target="$DEST/$name"
  chmod +x "$hook"
  ln -sf "../../.githooks/$name" "$target"
  echo "  ✓ $name → $target (symlink)"
done

echo ""
echo "✓ Hooks installed."
echo ""
echo "Test commit-msg:    echo 'bad format' | .githooks/commit-msg /dev/stdin"
echo "Test pre-commit:    .githooks/pre-commit"
echo ""
echo "Emergency bypass:   SKIP_CHECKS=1 git commit ..."
