# Codeforces Backend API Guide for Frontend Developers

## 🚀 Base URL
```
https://codeforces-backend.bkumar-be23.workers.dev
```

## 🔐 Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

---

## 📋 Quick Start Guide

### 1. User Registration
**POST** `/users/signup`

```json
{
  "email": "user@thapar.edu",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "Account created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@thapar.edu",
    "name": "John Doe",
    "role": "user"
  }
}
```

### 2. User Login
**POST** `/users/signin`

```json
{
  "email": "user@thapar.edu",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@thapar.edu",
    "name": "John Doe",
    "role": "user"
  }
}
```

### 3. Get User Profile
**GET** `/users/me`

**Headers:** `Authorization: Bearer <jwt-token>`

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@thapar.edu",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🏆 Contest Management

### Create Contest (Admin Only)
**POST** `/contests`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Weekly Coding Contest",
  "description": "A challenging coding contest for all skill levels",
  "difficulty": "easy"
}
```

**Field Details:**
- `title` (string, required): Contest title (1-200 characters)
- `description` (string, required): Contest description (minimum 1 character)
- `difficulty` (string, required): Must be "easy", "medium", or "hard"

**Response (201):**
```json
{
  "message": "Contest created successfully",
  "contest": {
    "id": "contest-uuid",
    "title": "Weekly Coding Contest",
    "description": "A challenging coding contest for all skill levels",
    "difficulty": "easy",
    "isActive": true
  }
}
```

**Auto-Generated Fields:**
- Contest starts immediately
- Contest ends 24 hours from creation
- Contest is automatically set to active

### Get All Contests
**GET** `/contests`

**Headers:** `Authorization: Bearer <jwt-token>`

**Response (200):**
```json
{
  "contests": [
    {
      "id": "contest-uuid",
      "title": "Weekly Coding Contest",
      "description": "A challenging coding contest",
      "difficulty": "easy",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Contest Details
**GET** `/contests/:id`

**Headers:** `Authorization: Bearer <jwt-token>`

**Response (200):**
```json
{
  "contest": {
    "id": "contest-uuid",
    "title": "Weekly Coding Contest",
    "description": "A challenging coding contest",
    "startTime": "2024-01-15T10:00:00.000Z",
    "endTime": "2024-01-15T12:00:00.000Z",
    "isActive": true,
    "difficulty": "easy",
    "createdById": "admin-user-id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🎯 Submission Management

### Submit Code
**POST** `/submissions`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "challengeId": "challenge-uuid",
  "files": [
    {
      "path": "solution.py",
      "content": "def solve():\n    return sum([1, 2, 3, 4, 5])",
      "language": "python"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Submission received",
  "submissionId": "submission-id",
  "status": "pending"
}
```

### Get Submission Details
**GET** `/submissions/:id`

**Headers:** `Authorization: Bearer <jwt-token>`

**Response (200):**
```json
{
  "submission": {
    "id": "submission-id",
    "userId": "user-id",
    "challengeId": "challenge-id",
    "contestId": "contest-id",
    "status": "completed",
    "score": 85,
    "files": [...],
    "testResults": null,
    "aiReview": {
      "totalScore": 85,
      "breakdown": {
        "fileStructure": {"score": 18, "feedback": "Good file organization"},
        "codeQuality": {"score": 22, "feedback": "Clean and readable code"},
        "bestPractices": {"score": 20, "feedback": "Follows good practices"},
        "functionality": {"score": 25, "feedback": "Correct logic implementation"}
      },
      "strengths": ["Good problem-solving approach", "Clean code structure"],
      "improvements": ["Add more error handling", "Consider edge cases"],
      "overallFeedback": "Good solution with room for improvement"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📊 Leaderboard

### Get Contest Leaderboard
**GET** `/leaderboard/contest/:contestId`

**Headers:** `Authorization: Bearer <jwt-token>`

**Response (200):**
```json
{
  "leaderboard": [
    {
      "userId": "user-id",
      "score": 95,
      "rank": 1,
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "userName": "John Doe",
      "userEmail": "john@thapar.edu"
    }
  ]
}
```

---

## 🎮 Simple Contest (Alternative)

### Create Simple Contest (Admin Only)
**POST** `/simple-contests`

**Headers:**
```
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Quick Coding Challenge",
  "description": "A simple coding problem to solve",
  "difficulty": "easy"
}
```

**Response (201):**
```json
{
  "message": "Contest created successfully",
  "contest": {
    "id": "contest-uuid",
    "title": "Quick Coding Challenge",
    "description": "A simple coding problem to solve",
    "difficulty": "easy",
    "challengeId": "challenge-uuid",
    "isActive": true
  }
}
```

### Submit Code for Simple Contest
**POST** `/simple-contests/:id/submit`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "def add_numbers(a, b):\n    return a + b\n\nprint(add_numbers(5, 3))",
  "language": "python"
}
```

**Response (201):**
```json
{
  "message": "Code submitted successfully",
  "submissionId": "submission-id",
  "status": "pending"
}
```

---

## 🚨 Error Handling

### Common Error Format
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Example Error Responses

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

**400 Bad Request:**
```json
{
  "error": "Validation Error",
  "message": "Title is required"
}
```

---

## 🔧 Frontend Implementation Examples

### JavaScript/TypeScript Example

```typescript
// API Client Class
class ContestAPI {
  private baseURL = 'https://codeforces-backend.bkumar-be23.workers.dev';
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // User Authentication
  async signup(email: string, password: string, name: string) {
    return this.request('/users/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async signin(email: string, password: string) {
    const result = await this.request('/users/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.token) {
      this.setToken(result.token);
    }
    
    return result;
  }

  async getProfile() {
    return this.request('/users/me');
  }

  // Contest Management
  async createContest(title: string, description: string, difficulty: 'easy' | 'medium' | 'hard') {
    return this.request('/contests', {
      method: 'POST',
      body: JSON.stringify({ title, description, difficulty }),
    });
  }

  async getContests() {
    return this.request('/contests');
  }

  async getContest(id: string) {
    return this.request(`/contests/${id}`);
  }

  // Submissions
  async submitCode(challengeId: string, files: Array<{path: string, content: string, language: string}>) {
    return this.request('/submissions', {
      method: 'POST',
      body: JSON.stringify({ challengeId, files }),
    });
  }

  async getSubmission(id: string) {
    return this.request(`/submissions/${id}`);
  }

  // Leaderboard
  async getLeaderboard(contestId: string) {
    return this.request(`/leaderboard/contest/${contestId}`);
  }
}

// Usage Example
const api = new ContestAPI();

// Login
const loginResult = await api.signin('user@thapar.edu', 'password123');

// Create contest (admin only)
const contest = await api.createContest(
  'My Contest',
  'A great coding challenge',
  'easy'
);

// Get all contests
const contests = await api.getContests();
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

export const useContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await api.getContests();
      setContests(response.contests);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return { contests, loading, error, refetch: fetchContests };
};
```

---

## 📝 Important Notes

### Validation Rules
- **Email**: Must be from @thapar.edu domain for signup
- **Password**: Minimum 6 characters
- **Title**: 1-200 characters for contests
- **Difficulty**: Must be exactly "easy", "medium", or "hard"

### Rate Limits
- Regular challenges: 10 submissions per challenge per user
- Simple contests: 5 submissions per contest per user

### Token Management
- JWT tokens expire after 7 days
- Store token securely (localStorage, sessionStorage, or secure cookies)
- Include token in Authorization header for protected endpoints

### Error Handling Best Practices
1. Always check response status codes
2. Parse error messages for user-friendly feedback
3. Handle network errors gracefully
4. Implement retry logic for failed requests

### Security Considerations
1. Never expose JWT tokens in client-side logs
2. Use HTTPS for all API calls
3. Validate user input before sending to API
4. Implement proper logout functionality

---

## 🎨 UI/UX Recommendations

### Loading States
- Show loading spinners for async operations
- Disable buttons during submission
- Display progress indicators for long operations

### Error Display
- Show user-friendly error messages
- Use toast notifications for temporary errors
- Implement form validation with inline errors

### Success Feedback
- Show success messages for completed actions
- Redirect users after successful operations
- Update UI immediately for optimistic updates

### Mobile Responsiveness
- Ensure all forms work on mobile devices
- Use touch-friendly button sizes
- Implement proper keyboard handling

---

This API guide provides everything your frontend developer needs to integrate with your Codeforces backend! 🚀
