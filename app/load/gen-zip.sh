#!/usr/bin/env bash
set -euo pipefail
mkdir -p load/data
for i in $(seq 1 500); do
  dd if=/dev/urandom of=load/data/snippet_$i.txt bs=1024 count=$((RANDOM%500+50)) status=none
  zip -jq load/data/sub_$i.zip load/data/snippet_$i.txt
  rm -f load/data/snippet_$i.txt
done
echo "Generated 500 zips under load/data/"
