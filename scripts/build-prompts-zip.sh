#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

rm -f prompts.zip
zip -r prompts.zip s*/prompt-*.md
unzip -l prompts.zip
