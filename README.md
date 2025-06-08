# Ultimate Student Planner

AI-powered study planner with syllabus analysis, CGPA tracking (Indian 10-point system), and intelligent recommendations for students.

## Features

🎯 **Core Features:**

- **AI Syllabus Analysis** - Upload PDF textbooks and get personalized study guidance
- **CGPA Tracking** - Indian 10-point grading system with detailed analytics
- **Stock Market Education** - Real-time stock tracking and investment advice for students
- **4-Year Academic Journey** - Complete performance tracking across all semesters
- **Dynamic Task Management** - Real-time task lists that change based on actual dates
- **Cross-Platform** - Available as Web app, Windows .exe, and Android APK

🔧 **Technical Features:**

- Real-time date tracking (no hardcoded dates)
- Offline-first data storage
- Responsive design for all screen sizes
- AI-powered study recommendations
- Internal vs External assessment tracking (25%-75% weightage)

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:8080
```

### Building for Production

#### 🌐 Web Deployment

```bash
# Build for web hosting
npm run build

# Files will be in ./dist/ folder
# Upload to any static hosting service (Netlify, Vercel, GitHub Pages)
```

#### 🖥️ Windows Desktop App

```bash
# Build Windows .exe installer
npm run build-windows

# Files will be in ./dist-electron/
# Includes both installer and portable versions
```

#### 📱 Android Mobile App

```bash
# Build Android APK
npm run build-android

# APK will be in ./mobile/platforms/android/app/build/outputs/apk/
```

#### 🎯 Build All Platforms

```bash
# One-command deployment for all platforms
node deploy.js all

# Or specific platforms:
node deploy.js web
node deploy.js windows
node deploy.js android
```

## Installation Requirements

### For All Builds:

- Node.js 18+
- npm or yarn

### For Windows Builds:

- Windows 10+ or Windows Server
- No additional requirements (electron-builder handles everything)

### For Android Builds:

- Java Development Kit (JDK) 8 or 11
- Android Studio or Android SDK Tools
- Gradle 7.0+

```bash
# Install Android requirements (Windows)
npm install -g cordova
# Download Android Studio from https://developer.android.com/studio

# Install Android requirements (macOS)
brew install gradle
npm install -g cordova
# Download Android Studio
```

## Project Structure

```
ultimate-student-planner/
├── src/
│   ├── pages/
│   │   └── OliveAIDashboard.tsx     # Main dashboard
│   ├── components/
│   │   └── planner/
│   │       ├── AIChatbot.tsx        # AI assistant
│   │       └── FourYearDashboard.tsx # Academic tracking
│   ├── lib/
│   │   ├── syllabus-parser.ts       # PDF analysis
│   │   ├── marks-calculator.ts      # CGPA calculations
│   │   └── date-tracker.ts          # Real-time dates
│   └── types/                       # TypeScript definitions
├── public/
│   ├── electron.js                  # Desktop app main process
│   └── icon.png                     # App icon
├── config.xml                       # Mobile app configuration
├── deploy.js                        # Deployment automation
└── package.json                     # Dependencies & scripts
```

## Usage Guide

### 1. Dashboard Overview

- **Date Cards** - Shows today and tomorrow with real dates
- **Dynamic Tasks** - Different tasks for each day of the week
- **CGPA Tracker** - Live calculation with 10-point Indian system
- **Progress Analytics** - Performance trends and predictions

### 2. AI Assistant

- **Study Tab** - Upload syllabus PDFs for personalized guidance
- **Stock Tab** - Real-time market data and student-friendly advice
- **Analytics Tab** - Academic performance insights

### 3. 4-Year Journey

- **Semester Tracking** - All 8 semesters with detailed subject breakdown
- **Grade Management** - Internal (25%) + External (75%) assessment
- **CGPA Projections** - Target setting and achievement planning

### 4. Marks & CGPA

- **Live Calculations** - Real-time CGPA updates
- **Grade Mapping** - A+ (10) to F (0) Indian grading scale
- **Performance Analytics** - Subject-wise strengths and weaknesses

## Deployment Options

### 🌐 Web Hosting (Recommended)

- **Netlify**: Connect GitHub repo for auto-deployment
- **Vercel**: `vercel deploy` after building
- **GitHub Pages**: Upload `dist/` folder contents
- **Any Static Host**: Upload `dist/` folder

### 🖥️ Desktop Distribution

- **Direct Download**: Share the .exe installer file
- **Microsoft Store**: Package using electron-builder
- **GitHub Releases**: Automated releases with GitHub Actions

### 📱 Mobile Distribution

- **Direct APK**: Share the APK file for manual installation
- **Google Play Store**: Upload APK through Play Console
- **Internal Distribution**: Use Firebase App Distribution

## Environment Variables

Create `.env` file for customization:

```env
VITE_APP_NAME="Ultimate Student Planner"
VITE_API_URL="your-api-endpoint"
VITE_ENVIRONMENT="production"
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: support@studentplanner.com
- 💬 GitHub Issues: Report bugs and feature requests
- 📖 Wiki: Detailed documentation and guides

---

**Made with ❤️ for students worldwide**

_Helping students achieve academic excellence through AI-powered planning and analytics._
