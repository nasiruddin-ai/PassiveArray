# Video Downloader

A small tool, like snapsave.app, that saves videos from Facebook, Instagram, TikTok,
YouTube, X (Twitter), Pinterest, Reddit, Vimeo and 1000+ other sites.
Paste a link, pick a quality, and the file is saved to your Downloads folder.
No programming knowledge is needed to run it.

## How to run it

1. Open this folder.
2. Double-click **Start.bat**.
3. The first time only, the black window downloads two helper programs into the `bin` folder:
   yt-dlp (about 18 MB) and ffmpeg (about 90 MB). This takes a minute or two. Wait for
   "Video Downloader is running" to appear.
4. Your browser opens to `http://localhost:3000`.
5. Paste a video link and press **Download**. Then click **Download** next to the quality you want.

To stop the tool, close the black window.

## If some qualities are greyed out

YouTube keeps 1080p and higher as separate video and audio streams that must be
joined, and MP3 conversion needs a converter. Both use ffmpeg, which normally installs
itself on first run. If that download failed (for example the internet dropped), the
page shows "Needs ffmpeg" next to those qualities. To fix it:

1. Double-click **Get-FFmpeg.bat** once. It downloads about 90 MB into the `bin` folder.
2. Close the Video Downloader window and run **Start.bat** again.

## Optional step: posts that need a login

Instagram and Facebook sometimes refuse to show a post unless you are logged in.
When that happens the tool says so. To fix it you give the tool your own login cookies:

1. Install the browser extension **Get cookies.txt LOCALLY** (Chrome or Firefox).
2. Log in to Instagram or Facebook in that browser.
3. On the site, click the extension and choose **Export**. Save the file as `cookies.txt`.
4. Put `cookies.txt` in this folder, next to `server.js`.
5. Close the Video Downloader window and run **Start.bat** again.

The file contains your login session, so never share it or upload it anywhere.

## If a site stops working

Sites change their pages often and the engine is updated within days.
Click **Update the engine** at the bottom of the page, then try again.

## What is in this folder

| File | What it does |
|---|---|
| `index.html` | The page you see in the browser. Change text, colours, or layout here. |
| `server.js` | The small program that talks to yt-dlp and sends the file to your browser. |
| `Start.bat` | Starts the tool. Double-click it. |
| `Get-FFmpeg.bat` | Backup installer for ffmpeg, only needed if the automatic install failed. |
| `bin/` | Created automatically. Holds `yt-dlp.exe`, `ffmpeg.exe`, and `ffprobe.exe`. |
| `cookies.txt` | Optional. Your login cookies for private or login-only posts. |
| `README.md` | This file. |

## How it works

`server.js` runs yt-dlp, an open-source program that knows how to read the video
pages of hundreds of sites. Looking up a link asks yt-dlp which files exist.
Downloading tells yt-dlp to save one of them into a temporary folder, shows a
progress bar while it does, then hands the finished file to the browser and deletes
the temporary copy after 30 minutes.

## Putting it on a website later

The page needs `server.js` running somewhere, because the browser cannot talk to
Facebook or Instagram directly. Any host that runs Node.js will work (Render,
Railway, Fly.io, a VPS). Upload the folder and run `node server.js`. The server
downloads the Linux version of yt-dlp by itself. Install ffmpeg on the host with
its package manager (for example `apt install ffmpeg`) to get 1080p+ and MP3.

Keep in mind that public downloader sites get blocked by Instagram and Facebook
often, because those sites limit how many requests come from one server. Running
it on your own computer avoids that problem.
