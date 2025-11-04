# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean-language ADHD self-assessment web application that collects user responses to 12 diagnostic questions and provides risk-level results. The application features comprehensive traffic source tracking (UTM parameters and referrer detection) and automatically saves responses to Google Sheets for data analysis.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Styling**: Custom CSS with CSS variables, Noto Sans KR font
- **Backend**: Google Apps Script (for data collection)
- **Hosting**: Static site (designed for Netlify or similar)

## Core Architecture

### Multi-Page Flow (Single Page Application Pattern)

The application uses a page transition system with hidden/visible sections:

1. **Landing Page** (`landing-page`) - Initial welcome screen
2. **Gender Selection** (`gender-page`) - Optional demographic collection
3. **Test Page** (`test-page`) - 12-question assessment with progress bar
4. **Results Page** (`result-page`) - Score display with risk-level messaging and CTAs

Pages are controlled via `showPage(pageId)` in app.js:146-158, which toggles `.active` class.

### Traffic Source Tracking System

The application implements sophisticated first-touch attribution tracking:

- **UTM Parameters** (highest priority): `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- **Referrer Detection**: Falls back to `document.referrer` if no UTM params
- **Known Source Categorization**: Maps referrer domains to friendly names (app.js:53-88)
- **Session Persistence**: Uses `sessionStorage` to preserve first-touch source across page reloads (app.js:323-338)

**Key Function**: `getTrafficSource()` (app.js:91-143) returns structured traffic data.

### Data Collection Flow

1. User completes 12 questions (stored in `userAnswers` array)
2. Result page displays based on `yesCount` (0-3: low, 4-6: mild, 7-9: moderate, 10-12: high)
3. `submitToGoogleSheets()` (app.js:214-256) automatically sends:
   - Test results (gender, answers, score)
   - Traffic source data (all UTM params + referrer info)
   - Metadata (timestamp, user agent, screen dimensions, language)
   - Source capture timestamp (time of first visit)

## Google Sheets Integration

### Setup Process

The Google Apps Script webhook URL is defined at app.js:46:

```javascript
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/.../exec';
```

**To update**: Replace this URL with your deployed Google Apps Script web app URL.

### Apps Script Code Location

The corresponding Google Apps Script code is documented in `GOOGLE_SHEETS_SETUP.md`. The script:
- Receives POST data from the web app
- Parses and structures the data
- Appends rows to a sheet named "ADHD 테스트 응답"
- Returns success/error JSON responses

### Data Structure Sent

See app.js:215-239 for complete payload structure. Includes test results, UTM tracking data, and device/browser metadata.

## UTM Tracking Implementation

### URL Format

All marketing URLs should follow this pattern:
```
https://[domain]?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]&utm_content=[content]
```

### URL Shortening Strategy

The project uses Bitly for shortened URLs. See `SHORT_URL_CREATION_CHECKLIST.md` for:
- Channel-specific short URLs (YouTube, Instagram, KakaoTalk, Threads, etc.)
- Naming conventions (e.g., `adhd-test-yt`, `adhd-test-kakao`)
- Complete checklist of URLs to create

### Traffic Source Categorization

Known referrer domains are mapped to friendly names in `categorizeReferrer()` (app.js:53-88):
- Instagram: `instagram.com`, `l.instagram.com`
- KakaoTalk: `kakaotalk.com`
- Sparta: `spartacodingclub.kr`, `scc.spartacodingclub.kr`
- Social platforms: Facebook, Twitter/X, YouTube, Naver, etc.

## Development Workflow

### Running Locally

This is a static site with no build process. To run locally:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server (if installed)
npx http-server -p 8000
```

Then open: `http://localhost:8000/index.html`

### Testing UTM Tracking

To test traffic source tracking locally:

```bash
# Test with UTM parameters
http://localhost:8000/index.html?utm_source=youtube&utm_medium=video&utm_campaign=test

# Check browser console (F12) for:
# - "신규 방문자 - 유입 경로 캡처:" log
# - trafficSourceData object contents
```

### File Structure

```
/
├── index.html           # Main HTML structure
├── app.js              # All application logic and tracking
├── styles.css          # Complete styling with CSS variables
├── fonts/
│   └── Noto_Sans_KR/   # Korean font files (Light, Regular, Medium, Bold)
├── docs/               # Planning documents
├── GOOGLE_SHEETS_SETUP.md        # Apps Script setup guide
├── UTM_URL_GUIDE.md              # UTM parameter reference
└── SHORT_URL_CREATION_CHECKLIST.md  # Bitly URL creation guide
```

## Results Logic

Results are determined by `yesCount` (app.js:269-278):

| Score Range | Risk Level | Result Object |
|-------------|------------|---------------|
| 0-3         | Low        | `results.low` |
| 4-6         | Mild       | `results.mild` |
| 7-9         | Moderate   | `results.moderate` |
| 10-12       | High       | `results.high` |

Each result object (app.js:18-43) contains:
- `range`: Score boundaries
- `title`: Display title
- `message`: HTML-formatted message
- `ctaType`: CTA button category

### CTA Button Logic

- **Score >= 7**: "가까운 병원 찾아보기" (Find nearby clinic) - Primary CTA
- **Score < 7**: "집중력 높이는 꿀팁 보기" (Concentration tips) - Secondary CTA

See app.js:287-305 for CTA generation logic.

## Styling System

### CSS Variables (styles.css:37-49)

```css
--primary-color: #6366f1    /* Indigo - main brand color */
--primary-hover: #4f46e5    /* Darker indigo for hover states */
--secondary-color: #10b981  /* Green - success/positive */
--danger-color: #ef4444     /* Red - warnings/high risk */
--warning-color: #f59e0b    /* Orange - moderate warnings */
```

### Font System

Uses Noto Sans KR with 4 weights loaded via @font-face (styles.css:1-28):
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 700 (Bold)

## Common Tasks

### Update Google Sheets URL

Edit app.js:46 and replace the `GOOGLE_SHEETS_URL` constant with your new deployment URL.

### Modify Questions

Edit the `questions` array at app.js:2-15. Keep 12 questions for consistency with results logic.

### Adjust Risk Level Thresholds

Modify the `results` object ranges at app.js:18-43. Ensure ranges are continuous and cover 0-12.

### Change Result Messages

Update the `message` property in the `results` object (app.js:18-43). HTML is supported.

### Add New Traffic Source

Add to `knownSources` object in `categorizeReferrer()` function (app.js:54-73):

```javascript
'newdomain.com': 'friendlyname',
```

## Important Notes

- The app uses `mode: 'no-cors'` for Google Sheets submission (app.js:244) due to Apps Script CORS restrictions
- Traffic source data is captured once per session using sessionStorage (key: `adhd_traffic_source`)
- All user answers are stored as boolean array (`true` = "그렇다", `false` = "아니다")
- Gender selection is optional - users can skip with `'skip'` value
- Console logs are extensive for debugging traffic source tracking - consider removing in production

## Marketing Documentation

- `UTM_URL_GUIDE.md`: Complete guide to UTM parameter naming conventions, best practices, and channel-specific examples
- `SHORT_URL_CREATION_CHECKLIST.md`: Step-by-step checklist for creating Bitly short URLs for each marketing channel
- `GOOGLE_SHEETS_TRACKING_UPDATE.md`: Advanced tracking implementation details

These documents should be referenced when setting up marketing campaigns or analyzing traffic data in Google Sheets.
