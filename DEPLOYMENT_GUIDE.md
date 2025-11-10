# MoneyTracker Deployment Guide

## 🚀 Deploy Backend to Render

### Step 1: Create Render Account
1. Go to: https://render.com
2. Click "Get Started" → Sign up with GitHub/Google
3. Verify your email

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub account (or use manual deploy)
3. For manual deploy:
   - Click "Deploy from Git"
   - Choose "Public Git repository"
   - Enter: `https://github.com/YOUR_USERNAME/moneytracker` (after pushing code)
   
4. **OR Upload directly:**
   - Go to: https://dashboard.render.com/select-repo
   - Click "New Web Service"
   - Choose "Build and deploy from a Git repository"
   - Connect GitHub and select your repo
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Environment**: Node

5. **Add Environment Variables** (Click "Add Environment Variable"):
   ```
   PORT = 3000
   RAZORPAY_KEY_ID = rzp_test_RJAYoHN8xZoCt2
   RAZORPAY_KEY_SECRET = VdYDVm0ACSIFN4A3LhvDGkis
   RAZORPAY_WEBHOOK_SECRET = mywebhooksecret
   FIREBASE_PROJECT_ID = mandir-donation-e5dd1
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-ywtw1@mandir-donation-e5dd1.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY = (paste the private_key from firebaseServiceAccount.json)
   ```

6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment
8. **Copy the URL** (e.g., `https://moneytracker-backend.onrender.com`)

---

## 🌐 Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to: https://vercel.com
2. Click "Sign Up" → Use GitHub/Google
3. Verify your email

### Step 2: Deploy Frontend
1. Click "Add New" → "Project"
2. Import Git Repository (connect GitHub first)
3. Select your MoneyTracker repository
4. **Root Directory**: Leave as `.` (root)
5. **Framework Preset**: Vite
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`

8. **Add Environment Variables**:
   ```
   VITE_RAZORPAY_KEY_ID = rzp_test_RJAYoHN8xZoCt2
   VITE_API_BASE = https://YOUR-BACKEND-URL.onrender.com
   ```
   (Replace YOUR-BACKEND-URL with the URL from Step 1.8)

9. Click "Deploy"
10. Wait 2-3 minutes
11. **Copy the live URL** (e.g., `https://moneytracker.vercel.app`)

---

## 📱 Test on Your Phone

1. Open the Vercel URL on your phone: `https://moneytracker.vercel.app`
2. Go to Donations page
3. Enter name and amount (₹1 for testing)
4. Click payment button
5. Complete test payment

---

## ⚡ Quick Deploy (Without GitHub)

### Backend (Render):
Can't deploy directly without Git - need to push to GitHub first.

### Frontend (Vercel CLI):
1. Install Vercel CLI on your computer:
   ```
   npm install -g vercel
   ```

2. In project folder, run:
   ```
   cd "C:\New folder\MoneyTracker_fixed - Copy"
   vercel login
   vercel --prod
   ```

3. Follow prompts, enter environment variables when asked

---

## 🔧 Alternative: Deploy Both to Railway

Railway is simpler - deploys from local folder!

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Or use Railway CLI:
   ```
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

---

## 📝 Need Help?

If you don't have GitHub account or don't know how to push code, I can:
1. Create a GitHub repository for you
2. Push your code there
3. Connect it to Render/Vercel

**Just tell me: "Create GitHub repo and deploy everything"**
