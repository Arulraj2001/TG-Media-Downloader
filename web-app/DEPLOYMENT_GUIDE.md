# TG Media Downloader Web Edition - Production Deployment Manual

Complete step-by-step guide to deploy the Web Edition frontend to **Netlify**, backend to **Render**, database/auth to **Supabase**, and apply for **Google AdSense**.

---

## 1. Supabase Database & Auth Setup (5 Minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase dashboard.
3. Open `web-app/supabase/schema.sql` from your project folder, paste it into SQL Editor, and click **Run**.
4. Go to **Authentication -> Providers**:
   - Enable **Google** provider (add Client ID & Client Secret from Google Cloud Console).
   - Enable **Email / Password** provider.
5. Go to **Project Settings -> API** and copy:
   - `Project URL` -> `VITE_SUPABASE_URL`
   - `anon / public key` -> `VITE_SUPABASE_ANON_KEY`

---

## 2. Netlify Frontend Deployment (3 Minutes)

1. Log in to [netlify.com](https://netlify.com) and click **Add new site -> Import an existing project**.
2. Select your GitHub repository (`Arulraj2001/TG-Media-Downloader`).
3. Set the following build settings:
   - **Base directory**: `web-app`
   - **Build command**: `npm run build`
   - **Publish directory**: `web-app/dist`
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key
5. Click **Deploy Site**. Netlify will automatically build and publish your site with dynamic SPA routing (`netlify.toml`).

---

## 3. Render Node.js Backend Deployment (3 Minutes)

1. Log in to [render.com](https://render.com) and click **New -> Web Service**.
2. Connect your GitHub repository (`Arulraj2001/TG-Media-Downloader`).
3. Set the following configurations:
   - **Root Directory**: `web-app/server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
5. Click **Create Web Service**. Your backend API will be live!

---

## 4. Google AdSense Approval Checklist

Your web app includes all AdSense compliance features out-of-the-box:

- [x] **Legal Policy Pages**: `/privacy`, `/terms`, `/refund-policy`, `/disclaimer`.
- [x] **Contact Us Page**: `/contact` with form logging to Admin Inbox.
- [x] **Unique Content & Blog Engine**: Public blog at `/blog` with Schema.org `BlogPosting` structured data.
- [x] **Public Visitor Access**: Homepage, pricing, guides, and legal pages accessible without login.
- [x] **Admin Ad Controls**: Manage AdSense Client ID (`ca-pub-xxxxxxxx`) and toggle Ads ON/OFF per tier in `/admin`.

To submit for AdSense:
1. Log in to your [Google AdSense Dashboard](https://adsense.google.com).
2. Add your Netlify custom domain (e.g. `https://tgdownloader.com`).
3. Copy your AdSense Publisher Code (`ca-pub-xxxxxxxx`) and save it inside your website `/admin` settings!
