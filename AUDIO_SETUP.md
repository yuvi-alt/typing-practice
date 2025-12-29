# Audio Setup Guide

To make the music feature work online, you need to host your audio file externally. Here are several free options:

## Option 1: GitHub Releases (Recommended)

1. Go to your repository: https://github.com/yuvi-alt/typing-practice
2. Click **Releases** → **Create a new release**
3. Upload your `lofi.mp3` file as an asset
4. After publishing, right-click the file and copy the download link
5. Update `app.js` and set `AUDIO_URL` to that link

Example:
```javascript
const AUDIO_URL = "https://github.com/yuvi-alt/typing-practice/releases/download/v1.0/lofi.mp3";
```

## Option 2: Use jsDelivr CDN (if using GitHub)

1. Upload your audio file to a separate GitHub repository
2. Use jsDelivr format:
```javascript
const AUDIO_URL = "https://cdn.jsdelivr.net/gh/your-username/your-audio-repo@main/lofi.mp3";
```

## Option 3: Free File Hosting Services

Upload to any of these free services and use the direct link:

- **Cloudinary** (free tier): https://cloudinary.com
- **Imgur** (for audio): https://imgur.com
- **Google Drive**: Upload file, get shareable link, convert to direct download
- **Dropbox**: Upload, get shareable link, convert to direct download

## Option 4: Use a Smaller Audio File

1. Compress your audio file to under 100MB
2. Use an online compressor like: https://www.freeconvert.com/compress-mp3
3. Upload the compressed file to one of the services above

## Option 5: Use Online Music API

You can also use a music streaming service API, but this requires more setup.

---

## Quick Setup Steps:

1. Host your audio file using one of the methods above
2. Get the direct URL to your audio file
3. Open `app.js`
4. Find the line: `const AUDIO_URL = "";`
5. Replace the empty string with your audio URL
6. Commit and push:
   ```bash
   git add app.js
   git commit -m "Add external audio URL"
   git push
   ```

The music will now work on your live website!

