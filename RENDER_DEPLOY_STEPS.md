# 🚀 RENDER.COM DEPLOYMENT - Step by Step

## ✅ Step 1: Create Render Account
1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with Google (fastest)
4. Verify email if asked

---

## ✅ Step 2: Create New Web Service
1. After login, click **"New +"** button (top right)
2. Select **"Web Service"**
3. Choose **"Build and deploy from a Git repository"**
4. Click **"Connect GitHub"** OR **"Use Public Git Repo"**

---

## ✅ Step 3: Configure Service Settings

Since we don't have GitHub repo yet, we'll use **Manual Deploy**:

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Scroll down and click **"Deploy from Git"** → **"Public Git repository"**
3. For now, skip this and use **"Deploy from local"**

**ALTERNATIVE (Easier):**
1. Click "New +" → "Web Service"
2. Scroll to bottom → Click **"I have a private repository"**
3. Choose **"Manual Deploy"**

---

## ✅ Step 4: Upload Backend Code

**Option A: Use Render Dashboard**
1. In Web Service settings:
   - **Name**: `moneytracker-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`

**Option B: Use GitHub (RECOMMENDED)**
I'll help you create a GitHub repo in the next step!

---

## ✅ Step 5: Add Environment Variables

Click **"Environment"** tab, then add these variables:

**Copy-paste these EXACTLY:**

```
PORT
3000

RAZORPAY_KEY_ID
rzp_test_RJAYoHN8xZoCt2

RAZORPAY_KEY_SECRET
VdYDVm0ACSIFN4A3LhvDGkis

RAZORPAY_WEBHOOK_SECRET
mywebhooksecret

FIREBASE_PROJECT_ID
mandir-donation-e5dd1

FIREBASE_CLIENT_EMAIL
firebase-adminsdk-fbsvc@mandir-donation-e5dd1.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUCWNNWTYZByEq
owdK+dG/S2qyiOy7UOnd8oguQsS7CV6zuUO23KIGSg7iTxIZsNeUxMc81roaDlaB
UfSTOOS/lYwlyM+KE73PNYMZJ76iy4ebQAy1pJ9U1pXzz+3+buDvtnECIX8bQFzA
uX7AUPLH+euscLMEZ8gsCganqClFKu05acqGSAZC3suwjD3L/qDxiV+nUmHKhpeq
k0sOqmoeHNqt2KDogs06u02PKGOuXRGFo9op1Yf9b5Y5E1EUuPMtLdNQVbVFTMhy
/VzUv+G1khYjd4mIY2fplovErS6GZLqeFV85oXM0Nha8JzA54ydNwrsSiLsCX9X5
iR0ZWeL1AgMBAAECggEANDOTRsU8pFq1QVm3yqKJahFoEIjkIbGIpnFNwDJfOS02
rd2YmTT4FYur7/W+Bj0r6BPzxepaObHwoy2JNxkK4NwVTYWgWapYdmcCUa6INNPc
f8x4Lt1cKgh5XD5oSB5FR4JoGz5AmhV6H6PJpHtnAUmJ54beOaF3HsByVFCiLPdK
4A0tQaXbdR2VbzBuM4u7dGAFhTsyvp78xWVpecM6hRtuh4AY3MwONEo5OUQwR3xf
skszcup3GRKeRV6TwFB3m3sPSSSeoZesPkuRdUOvebMqHm2KlzT1mbbo0sI7Buok
FXbSH8NSCU8OacXJVf5/S0Fnw0g/UcLO45NG+InzSQKBgQDDUUaJDJNLaJlzUmlm
tW9YPZRGzTe5M9evghxHikWYnR2KDWhPGD1EZpFtpio/xykrCs2KWZekBQjs0Mxo
3S6ISS52k3w1tl/20J9NVU928pY4n1PkFvWVgkXxoSEYg+DWgskE//ecmnarNGx+
e+2iMDtlUeml+ZHwsI75qe9slwKBgQDCB5jcmE/NUaygExlSAPtHMfr4Iy9q//0N
0THWIYI2/ehBdmG81YMdMkXcl7DTG5eEkeP2SL5HL2SFHiMi++teSPjicLnzwip/
/maozPJNlyeDMfLC4PCMkFcQvN6jNmlFnWHCNsRtKIvTB1yLugRwKNeRm31bEOOw
WkznMrOCUwKBgQCAuTf7asZIlI9Naar9feX8CdmHMAjhjkE/8kgg/ggQJLwrF9r/
BcKbKd3+ndyKW//N1jjQTWubNZZEPPf6xIq+Vzy/+UOLQr7MM4JJvUe55PcMKjVn
xZnlBw6ByOe++Gtd9KP3H5tZIpPDEbHPSm26zn7Wr72FHY4JStNvx4d70QKBgG10
8bQILISsPZD0FUWgjiCEvoq69qYLEUt5Jv8gWiABrsM3MD3hyRxwXt7pp/P/zcMY
thwav1TTFIbQEIxMx2OiEN1VMGGluGoKLwmszEgfLEgjpkpvsOPrDWLA2WwDZvHB
rgNs9/SIehCrR3b/kj9fmvRmXhpAdeHnnxiSDphHAoGAEaF9uoIeo5UWSJgNNShY
/vN2boe5Dpv88RZClD0xzb2NoYJZ6Y/jbtxdQr7P3yIgJiHYtVpRZYtUrfdHIuRK
wYvSrnSqPoNbKgNoPCm2CXi3Bbvqw47fcFHDiXNo2/dVty9Kf2eUHOvGn/RK6Rgt
ZkjSMcoKpHGZtmUXEAUbbMc=
-----END PRIVATE KEY-----
```

**IMPORTANT:** For FIREBASE_PRIVATE_KEY, make sure to include the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines!

---

## ✅ Step 6: Deploy!

1. Click **"Create Web Service"** or **"Deploy"**
2. Wait 3-5 minutes while it builds
3. You'll get a URL like: `https://moneytracker-backend.onrender.com`
4. **COPY THIS URL** - you'll need it for frontend!

---

## ⚠️ PROBLEM: Render needs GitHub!

Render requires a Git repository. Let me help you create one!

**Tell me: "Create GitHub repo"** and I'll set it up for you!
