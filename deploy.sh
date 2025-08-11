#!/bin/bash

echo "🚀 LinkedIn User Portal - Vercel Deployment Script"
echo "=================================================="
echo ""
echo "This script will help you deploy the user portal to Vercel."
echo ""

# Check if logged in to Vercel
echo "Step 1: Checking Vercel authentication..."
if ! npx vercel whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to Vercel."
    echo "Please run: npx vercel login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Build the project
echo "Step 2: Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "Step 3: Deploying to Vercel..."
echo "Please follow the prompts:"
echo ""

npx vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your LinkedIn User Portal is now live on Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your deployment URL"
    echo "2. Test the sign-up flow with LinkedIn import"
    echo "3. Complete the onboarding questions"
    echo "4. Explore the user portal (Profile, Strategy, Approvals, Analytics)"
else
    echo ""
    echo "❌ Deployment failed. Please check the error messages above."
fi