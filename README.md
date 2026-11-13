# Wedding Invitation (Next.js)

1. Install Node.js 18.17+ from https://nodejs.org
2. In this folder run:
   npm install
   npm run dev
3. Open http://localhost:3000

Edit the wedding date/time (WEDDING) and phone numbers (PHONES) at the top of app/page.js.
Build for production: npm run build && npm start

## Uploads (/upload page)
**On Vercel (recommended):** uploads go straight from the browser to Vercel Blob.
1. Vercel dashboard → your project → **Storage** → **Create** → **Blob** → choose **Public** → connect it to this project (adds `BLOB_READ_WRITE_TOKEN` automatically).
2. **Redeploy** the project (Deployments → ⋯ → Redeploy).
3. Open `/upload` and add photos/videos (up to 50 MB each). They appear at the front of the album.

**On your own server / locally:** without a Blob token, files are saved to `data/uploads/` (or `UPLOAD_DIR`) and served by `/api/media/<file>`. This needs a writable, persistent disk.

Big photos are shrunk in the browser first. HEIC isn't supported — share as JPG.
Built-in album photos live in `public/memories/` (list is `MEMORIES` at the top of `app/page.js`).
