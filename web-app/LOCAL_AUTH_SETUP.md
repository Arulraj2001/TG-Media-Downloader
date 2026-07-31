# Local Authentication Setup Guide (Google OAuth & Email/Password)

Follow this step-by-step guide to configure **1-Click Google OAuth** and **Email/Password** authentication locally for **TG Media Downloader Web Edition**.

---

## 🛠️ Step 1: Set Up Your Free Supabase Project

1. Go to [Supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it `tg-media-downloader`.
3. In your Supabase project dashboard, navigate to **Project Settings** -> **API**.
4. Copy the following keys:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon public Key** (e.g. `eyJhbGciOiJIUzI1NiIsIn...`)

5. Open your local project file `web-app/.env` (or create one) and set your keys:
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
   ```

---

## 🔑 Step 2: Configure Google OAuth 2.0 (Google Cloud Console)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen**:
   - Go to **APIs & Services** -> **OAuth consent screen**.
   - Select **External** -> Click **Create**.
   - Enter your App Name (`TG Media Downloader`) and Developer Contact Email.
   - Click **Save and Continue** through Scopes.

4. Create OAuth Credentials:
   - Go to **Credentials** -> Click **+ Create Credentials** -> Select **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `TG Downloader Local Web`.
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `http://localhost:5173`
   - **Authorized redirect URIs** (Copy this Callback URL from your Supabase Dashboard -> Auth -> Providers -> Google):
     - `https://<YOUR-SUPABASE-PROJECT-REF>.supabase.co/auth/v1/callback`

5. Click **Create** and copy the generated:
   - **Client ID**
   - **Client Secret**

---

## ⚡ Step 3: Enable Google Provider in Supabase

1. Open your Supabase Dashboard.
2. Go to **Authentication** -> **Providers** -> Click **Google**.
3. Toggle **Enable Google Provider**.
4. Paste your **Client ID** and **Client Secret** from Google Cloud Console.
5. Click **Save**.

---

## 🌐 Step 4: Configure Supabase Site URL & Redirects

1. In Supabase Dashboard, go to **Authentication** -> **URL Configuration**.
2. Set **Site URL**: `http://localhost:3000` (or `http://localhost:5173` if running Vite on port 5173).
3. Under **Redirect URLs**, click **Add URL** and add:
   - `http://localhost:3000/*`
   - `http://localhost:5173/*`
4. Click **Save**.

---

## ✉️ Step 5: Configure Email & Password Sign-In

1. In Supabase Dashboard, go to **Authentication** -> **Providers** -> Click **Email**.
2. Toggle **Enable Email provider** to ON.
3. *(Optional for Instant Local Testing)*:
   - Go to **Authentication** -> **Providers** -> **Email**.
   - Turn OFF **Confirm email** if you want new users to sign in immediately without waiting for an email confirmation link.

---

## 🗄️ Step 6: Initialize Database Tables (Run SQL Schema)

1. In Supabase Dashboard, go to **SQL Editor**.
2. Open the file `web-app/supabase/schema.sql` from your workspace.
3. Paste the SQL code into the Supabase SQL Editor and click **Run**.
4. This creates all tables (`profiles`, `subscription_plans`, `payment_verifications`, `contact_messages`, `blog_posts`) and safety triggers automatically!

---

## 🚀 Step 7: Run Locally & Test Sign-In

1. Open your terminal in the `web-app` directory.
2. Start the local server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
4. Click **Sign In**:
   - Test 1-Click **Continue with Google**.
   - Test **Email & Password** Sign Up / Sign In.
