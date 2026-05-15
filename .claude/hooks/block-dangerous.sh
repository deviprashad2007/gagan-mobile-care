#!/bin/bash
INPUT=$(cat)
DANGEROUS="rm -rf|DROP TABLE|TRUNCATE|DELETE FROM bookings|DELETE FROM repairs|--force|git push --force"
if echo "$INPUT" | grep -E "$DANGEROUS" > /dev/null; then
  echo "BLOCKED: dangerous command detected"
  echo "If you really need this, run it manually outside Claude Code."
  exit 2
fi
echo "$INPUT"
