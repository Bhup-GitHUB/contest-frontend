# 🚀 Codeforces SaaS Platform

A comprehensive competitive programming platform with AI-powered code review, built with Next.js, TypeScript, and modern UI components.

## ✨ Features

### 🎯 **Core Features**
- **User Authentication** - Secure signup/login with JWT tokens
- **Contest Management** - Create, manage, and participate in coding contests
- **AI-Powered Code Review** - Instant feedback on code quality, efficiency, and best practices
- **Real-time Code Editor** - Monaco editor with syntax highlighting and auto-completion
- **Leaderboards** - Track rankings and performance
- **User Profiles** - Detailed submission history and achievements
- **Admin Panel** - Complete contest and user management

### 🛠 **Technical Features**
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Type Safety** - Full TypeScript implementation
- **Error Handling** - Comprehensive error management and user feedback
- **Loading States** - Smooth loading indicators throughout the app
- **Toast Notifications** - Real-time user feedback

## 🏗 **Architecture**

### **Frontend Stack**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations
- **Monaco Editor** - VS Code editor in the browser
- **Lucide React** - Beautiful icons

### **Backend Integration**
- **RESTful API** - Clean API integration
- **JWT Authentication** - Secure token-based auth
- **Real-time Updates** - Live contest and submission updates

## 📁 **Project Structure**

```
src/
├── app/
│   ├── page.tsx                 # Main app router
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── auth/
│   │   ├── basic-signup.tsx    # Signup page
│   │   └── login.tsx           # Login page
│   ├── admin/
│   │   └── admin-panel.tsx     # Admin dashboard
│   ├── contest/
│   │   └── contest-detail.tsx  # Contest page with editor
│   ├── dashboard/
│   │   └── dashboard.tsx       # Main user dashboard
│   ├── landing/
│   │   └── landing-page.tsx    # Marketing landing page
│   ├── profile/
│   │   └── user-profile.tsx    # User profile & stats
│   └── ui/                     # Reusable UI components
├── hooks/
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.tsx           # Toast notification hook
└── lib/
    └── utils.ts                # Utility functions
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd contest-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎮 **Usage Guide**

### **For Users**
1. **Landing Page** - Start with the beautiful landing page
2. **Sign Up** - Create account with @thapar.edu email
3. **Dashboard** - View available contests and stats
4. **Join Contest** - Click on any contest to participate
5. **Code & Submit** - Write solutions in the integrated editor
6. **Get Feedback** - Receive instant AI-powered code review
7. **Track Progress** - Monitor your performance and achievements

### **For Admins**
1. **Admin Panel** - Access admin features (admin role required)
2. **Create Contests** - Set up new coding challenges
3. **Manage Users** - View and manage user accounts
4. **Monitor Activity** - Track contest participation and submissions

## 🔧 **API Endpoints**

### **Authentication**
- `POST /users/signup` - User registration
- `POST /users/signin` - User login

### **Contests**
- `GET /simple-contests` - List all contests
- `POST /simple-contests` - Create new contest (Admin)
- `GET /simple-contests/:id` - Get contest details
- `POST /simple-contests/:id/submit` - Submit solution
- `GET /simple-contests/:id/submissions` - Get user submissions
- `GET /simple-contests/:id/leaderboard` - Get contest leaderboard

### **Submissions**
- `GET /submissions/:id` - Get detailed submission results

## 🎨 **UI Components**

### **Design System**
- **Colors** - Blue primary, with semantic color palette
- **Typography** - Clean, readable font hierarchy
- **Spacing** - Consistent spacing scale
- **Shadows** - Subtle depth and elevation
- **Animations** - Smooth, purposeful transitions

### **Key Components**
- **Cards** - Content containers with subtle shadows
- **Buttons** - Multiple variants and sizes
- **Forms** - Accessible form inputs with validation
- **Modals** - Overlay dialogs for important actions
- **Toast** - Non-intrusive notifications
- **Badges** - Status indicators and labels

## 📱 **Responsive Design**

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Enhanced tablet experience
- **Desktop** - Full-featured desktop interface
- **Breakpoints** - sm, md, lg, xl responsive breakpoints

## 🔒 **Security Features**

- **JWT Tokens** - Secure authentication
- **Email Validation** - @thapar.edu domain restriction
- **Input Sanitization** - XSS protection
- **Rate Limiting** - API abuse prevention
- **CORS Configuration** - Cross-origin security

## 🚀 **Deployment**

### **Build for Production**
```bash
npm run build
npm start
```

### **Environment Variables**
```env
NEXT_PUBLIC_API_URL=https://codeforces-backend.bkumar-be23.workers.dev
```

## 🧪 **Testing**

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Contest creation and management
- [ ] Code submission and review
- [ ] Leaderboard functionality
- [ ] Admin panel features
- [ ] Responsive design
- [ ] Error handling

## 🎯 **Key Features in Detail**

### **AI-Powered Code Review**
- **Correctness** - Validates solution accuracy
- **Code Quality** - Reviews readability and structure
- **Efficiency** - Analyzes algorithm complexity
- **Best Practices** - Checks coding standards
- **Detailed Feedback** - Comprehensive improvement suggestions

### **Contest System**
- **Timed Contests** - Start and end time management
- **Multiple Submissions** - Up to 5 attempts per contest
- **Real-time Scoring** - Instant score calculation
- **Live Leaderboards** - Dynamic ranking updates

### **User Experience**
- **Intuitive Navigation** - Clear, logical flow
- **Loading States** - Smooth user feedback
- **Error Handling** - Helpful error messages
- **Achievement System** - Gamification elements

## 🔮 **Future Enhancements**

- **Real-time Collaboration** - Multi-user coding sessions
- **Advanced Analytics** - Detailed performance metrics
- **Custom Themes** - Personalizable UI themes
- **Mobile App** - Native mobile application
- **API Documentation** - Interactive API docs
- **Webhooks** - Real-time event notifications

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**