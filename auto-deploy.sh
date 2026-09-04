#!/bin/bash

git add .

if git diff --cached --quiet; then
    exit 0
fi

git commit -m "Auto update RepairLens"
git push origin main
