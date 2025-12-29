# YouTube Music Troubleshooting

## Common Issues

### Error 150: Video cannot be played in embedded players
**Solution:** The video you're using doesn't allow embedding. Try one of these videos instead:

- `jfKfPfyJRdk` - Lofi hip hop radio (current default)
- `DWcJFNfaw9c` - Chillhop Music
- `rUxyKA_-grg` - Lofi hip hop mix

To change the video, edit `app.js` and update `YOUTUBE_VIDEO_ID`.

### ERR_BLOCKED_BY_CLIENT
**Solution:** Your ad blocker is blocking YouTube. 

**Options:**
1. **Disable ad blocker** for your website
2. **Whitelist** `yuvi-alt.github.io` in your ad blocker
3. **Use a different browser** without ad blockers
4. **Use a direct audio file** instead (see AUDIO_SETUP.md)

### Video not playing
**Check:**
1. Open browser console (F12) and look for errors
2. Make sure you've clicked/typed to enable autoplay (browser requirement)
3. Try clicking the "Music: On" button manually
4. Wait 2-3 seconds after page load before trying to play

## Alternative: Use Direct Audio File

If YouTube keeps having issues, you can use a direct audio file instead:

1. Compress your audio file to 5-10MB (see AUDIO_SETUP.md)
2. Upload to GitHub Releases
3. In `app.js`, set:
   ```javascript
   const YOUTUBE_VIDEO_ID = ""; // Empty
   const AUDIO_URL = "https://github.com/yuvi-alt/typing-practice/releases/download/v1.0/lofi.mp3";
   ```

## Testing

1. Visit your site
2. Open browser console (F12)
3. Look for these messages:
   - ✅ "YouTube API ready"
   - ✅ "YouTube player ready"
   - ✅ "Playing YouTube video"
4. If you see errors, check the error code above

