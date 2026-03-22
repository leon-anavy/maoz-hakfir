#!/bin/bash
set -e

echo "📦 Committing changes..."
git add -A
git commit -m "${1:-update}" || echo "Nothing new to commit."

echo "🚀 Pushing to GitHub..."
git -c http.postBuffer=524288000 push origin main

echo "🌐 Deploying to GitHub Pages..."
npm run deploy -- --no-history

echo "✅ Done! Live at https://leon-anavy.github.io/maoz-hakfir/"
