# Capgemini Essay Writing Tutor

**© 2025 Ayush Kumar Sao. All rights reserved.**

A comprehensive essay analysis and writing improvement platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication System
- **Attractive Login/Register Interface** with modern design
- **User Profile Management** with avatar and subscription tracking
- **Session Management** with local storage persistence


### 📊 Personal Dashboard
- **Overview Section** with welcome message and quick stats
- **Progress Tracking** with interactive charts and weekly analytics
- **Essay History** with detailed scoring breakdown
- **Strengths & Improvement Areas** analysis
- **Subscription Management** (Free/Premium tiers)

### ✍️ Essay Analysis Engine
- **Real-time Analysis** with 1-second debouncing
- **Multi-criteria Scoring**:
  - Word Count Evaluation (optimal 200-500 words)
  - Spelling Accuracy Assessment
  - Grammar Evaluation with error detection
  - Backspace & Delete Score tracking
  - Total scoring out of 50 points

### 📈 Visual Analytics
- **Interactive Charts** using Recharts library
- **Progress Visualization** with area and line charts
- **Score Distribution** with bar charts and pie charts
- **Performance Metrics** tracking improvement over time

### 🎨 Modern UI/UX
- **Professional Capgemini Branding** with blue color scheme
- **Responsive Design** optimized for all devices
- **Smooth Animations** and hover effects
- **Intuitive Navigation** with tab-based interface
- **Loading States** and error handling

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Demo Usage


1. **Explore Dashboard** features:
   - View your writing statistics
   - Check progress charts
   - Review essay history
2  **Write Essays**:
   - Click "Start Writing" to access the essay editor
   - Type your essay and see real-time analysis
   - Get detailed feedback and scoring

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **NLP**: Natural language processing for text analysis
- **State Management**: React Context API
- **Storage**: Firebase

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── App.tsx            # Main application component
│   ├── Dashboard.tsx      # Personal dashboard
│   ├── LoginForm.tsx      # Authentication forms
│   ├── EssayTutor.tsx     # Main essay interface
│   ├── EssayEditor.tsx    # Essay writing component
│   └── EssayResults.tsx   # Results and scoring display
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication state management
├── lib/                   # Utility functions
│   └── essayAnalysis.ts   # Essay analysis engine
└── types/                 # TypeScript type definitions
    ├── essay.ts           # Essay-related types
    └── user.ts            # User and authentication types
```

## Analysis Features

### Word Count Scoring
- **0-50 words**: 0-3 points (needs expansion)
- **50-100 words**: 3-5 points (developing)
- **100-200 words**: 5-8 points (good length)
- **200-500 words**: 8-10 points (optimal)
- **500+ words**: Penalty for excessive length

### Grammar & Spelling
- **Common misspelling detection** with suggestions
- **Grammar pattern matching** for frequent errors
- **Article usage validation** (a/an/the)
- **Pronoun confusion detection** (your/you're, its/it's)

### Performance Metrics
- **Typing behavior analysis** (backspace/delete patterns)
- **Writing efficiency scoring**
- **Improvement tracking** over time
- **Personalized recommendations**

## Customization

The application is designed to be easily customizable:

- **Branding**: Update colors and logos in Tailwind config
- **Analysis Rules**: Modify scoring algorithms in `essayAnalysis.ts`
- **UI Components**: Extend components with additional features
- **Authentication**: Replace mock auth with real backend integration

## Future Enhancements

- **Real-time Collaboration** for peer review
- **Advanced NLP** with AI-powered suggestions
- **Export Functionality** for essays and reports
- **Integration** with learning management systems
- **Mobile App** with React Native

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - TypeScript language reference
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Recharts](https://recharts.org/en-US/) - composable charting library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## License & Copyright

**© 2025 Ayush Kumar Sao. All rights reserved.**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Author
- **Ayush Kumar Sao** - *Project Creator & Developer*
  - Enhanced the application with comprehensive LanguageTool API integration
  - Implemented advanced spelling analysis and error detection
  - Created real-time essay evaluation system

### Acknowledgments
- Built with Next.js, TypeScript, and Tailwind CSS
- Enhanced spelling analysis powered by [LanguageTool API](https://languagetool.org/)
- Comprehensive essay evaluation with real-time feedback

For more information about the enhanced spelling features, see [SPELLING_ENHANCEMENT.md](SPELLING_ENHANCEMENT.md)

**Capgemini Essay Writing Tutor** - Empowering students with intelligent essay analysis and feedback.
