# Audio Setup Guide

Your audio file is too large (224MB). Here are the best solutions:

## 🎯 Option 1: Compress Your Audio File (RECOMMENDED)

Compress your `lofi.mp3` to under 10MB while keeping good quality:

### Free Online Compressors:
1. **FreeConvert** - https://www.freeconvert.com/compress-mp3
   - Upload your file
   - Set quality to "Medium" or "High" (not "Best")
   - Target size: 5-10MB
   - Download compressed file

2. **CloudConvert** - https://cloudconvert.com/mp3-compress
   - Similar process, good quality

3. **Audacity** (Desktop App) - https://www.audacityteam.org/
   - Open your file
   - File → Export → Export as MP3
   - Quality: 128 kbps or 192 kbps (good balance)
   - This will create a much smaller file

**After compression:**
- Your file should be 5-20MB instead of 224MB
- Upload to GitHub Releases (supports up to 2GB per file)
- Or use any free hosting service

---

## 🎵 Option 2: Use Free Music APIs/Services

Use royalty-free music that's already hosted:

### Free Music Sources:
1. **Free Music Archive** - https://freemusicarchive.org/
   - Download a smaller lofi track
   - Many tracks are 2-5MB

2. **Incompetech** - https://incompetech.com/music/royalty-free/
   - Royalty-free music
   - Smaller file sizes

3. **YouTube Audio Library** - https://studio.youtube.com/channel/UC/music
   - Free music for projects
   - Download smaller versions

4. **Freesound** - https://freesound.org/
   - Search for "lofi" or "ambient"
   - Many smaller files available

---

## 🌐 Option 3: Use a Pre-hosted Sample

For quick testing, you can use a free sample URL:

## Option 4: GitHub Releases (After Compression)

1. Go to your repository: https://github.com/yuvi-alt/typing-practice
2. Click **Releases** → **Create a new release**
3. Upload your `lofi.mp3` file as an asset
4. After publishing, right-click the file and copy the download link
5. Update `app.js` and set `AUDIO_URL` to that link

Example:
```javascript
const AUDIO_URL = "https://github.com/yuvi-alt/typing-practice/releases/download/v1.0/lofi.mp3";
```

## Option 5: Use jsDelivr CDN (if using GitHub)

1. Upload your audio file to a separate GitHub repository
2. Use jsDelivr format:
```javascript
const AUDIO_URL = "https://cdn.jsdelivr.net/gh/your-username/your-audio-repo@main/lofi.mp3";
```

## Option 6: Free File Hosting Services

Upload to any of these free services and use the direct link:

- **Cloudinary** (free tier): https://cloudinary.com
- **Imgur** (for audio): https://imgur.com
- **Google Drive**: Upload file, get shareable link, convert to direct download
- **Dropbox**: Upload, get shareable link, convert to direct download

## Option 7: Disable Music Feature

If you don't want to deal with audio hosting, the app works perfectly without music. The music button will simply be disabled, and users can still use all typing features.

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

