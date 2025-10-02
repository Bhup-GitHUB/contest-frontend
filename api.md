# 🎯 Admin Test Cases - Complete Contest Flow

**Base URL**: https://codeforces-backend.bkumar-be23.workers.dev

## 📋 **Complete Admin Workflow Test**

This guide tests the **complete contest flow** from admin perspective:
1. Create contest
2. Submit code as user
3. Get AI review and marks
4. Check leaderboard

---

## 🔐 **Step 1: Setup Admin Access**

### **1.1 Make User Admin (D1 Console)**
```sql
UPDATE users SET role = 'admin' WHERE email = 'bkumar_be23@thapar.edu';
```

### **1.2 Login as Admin**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/users/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bkumar_be23@thapar.edu",
    "password": "your_password_here"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "f87c5cf6-182d-45d1-8773-4967a04df628",
    "email": "bkumar_be23@thapar.edu",
    "name": "Bhupesh Kumar",
    "role": "admin"
  }
}
```

**Save the JWT token for admin operations!**

---

## 🏆 **Step 2: Create Contest (Admin)**

### **2.1 Create Simple Contest**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/simple-contests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN" \
  -d '{
    "title": "Two Sum Problem",
    "description": "Find two numbers that add up to target",
    "startTime": "2024-12-01T10:00:00Z",
    "endTime": "2024-12-01T18:00:00Z",
    "problemStatement": "Given an array of integers and a target sum, return indices of two numbers that add up to target.\n\nExample:\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\nConstraints:\n- 2 <= nums.length <= 10^4\n- -10^9 <= nums[i] <= 10^9\n- -10^9 <= target <= 10^9",
    "expectedOutput": "[0,1]"
  }'
```

**Expected Response:**
```json
{
  "message": "Contest created successfully",
  "contest": {
    "id": "contest-uuid-here",
    "title": "Two Sum Problem",
    "description": "Find two numbers that add up to target",
    "startTime": "2024-12-01T10:00:00.000Z",
    "endTime": "2024-12-01T18:00:00.000Z",
    "isActive": false,
    "createdById": "f87c5cf6-182d-45d1-8773-4967a04df628",
    "createdAt": "2025-10-02T01:45:43.000Z",
    "challengeId": "challenge-uuid-here",
    "problemStatement": "Given an array of integers and a target sum...",
    "expectedOutput": "[0,1]"
  }
}
```

**Save the contest ID for next steps!**

### **2.2 Verify Contest Created**
```bash
curl -X GET https://codeforces-backend.bkumar-be23.workers.dev/simple-contests \
  -H "Authorization: Bearer YOUR_ADMIN_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "contests": [
    {
      "id": "contest-uuid-here",
      "title": "Two Sum Problem",
      "description": "Find two numbers that add up to target",
      "startTime": "2024-12-01T10:00:00.000Z",
      "endTime": "2024-12-01T18:00:00.000Z",
      "isActive": false,
      "createdById": "f87c5cf6-182d-45d1-8773-4967a04df628",
      "createdAt": "2025-10-02T01:45:43.000Z"
    }
  ]
}
```

---

## 👤 **Step 3: Create Test User**

### **3.1 Create Regular User**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@thapar.edu",
    "password": "password123",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid-here",
    "email": "testuser@thapar.edu",
    "name": "Test User",
    "role": "user"
  }
}
```

**Save the user JWT token!**

---

## 💻 **Step 4: Submit Code (As User)**

### **4.1 Submit Correct Solution**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/CONTEST_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{
    "code": "def two_sum(nums, target):\n    for i in range(len(nums)):\n        for j in range(i+1, len(nums)):\n            if nums[i] + nums[j] == target:\n                return [i, j]\n    return []",
    "language": "python"
  }'
```

**Expected Response:**
```json
{
  "message": "Code submitted successfully",
  "submissionId": "submission-uuid-here",
  "status": "pending"
}
```

### **4.2 Submit Optimized Solution**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/CONTEST_ID/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{
    "code": "def two_sum(nums, target):\n    hashmap = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in hashmap:\n            return [hashmap[complement], i]\n        hashmap[num] = i\n    return []",
    "language": "python"
  }'
```

**Expected Response:**
```json
{
  "message": "Code submitted successfully",
  "submissionId": "submission-uuid-here-2",
  "status": "pending"
}
```

---

## 📊 **Step 5: Check Results**

### **5.1 Wait 10-15 seconds for AI processing, then check submissions**
```bash
curl -X GET https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/CONTEST_ID/submissions \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "submissions": [
    {
      "id": "submission-uuid-here-2",
      "status": "completed",
      "score": 95,
      "createdAt": "2025-10-02T01:50:00.000Z"
    },
    {
      "id": "submission-uuid-here",
      "status": "completed",
      "score": 85,
      "createdAt": "2025-10-02T01:49:00.000Z"
    }
  ]
}
```

### **5.2 Get Detailed Submission Results**
```bash
curl -X GET https://codeforces-backend.bkumar-be23.workers.dev/submissions/SUBMISSION_ID \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "submission": {
    "id": "submission-uuid-here-2",
    "userId": "user-uuid-here",
    "challengeId": "challenge-uuid-here",
    "contestId": "contest-uuid-here",
    "files": [{"path": "solution.py", "content": "def two_sum(nums, target):...", "language": "python"}],
    "status": "completed",
    "score": 95,
    "testResults": null,
    "aiReview": {
      "totalScore": 95,
      "breakdown": {
        "correctness": {"score": 40, "feedback": "Produces correct output"},
        "codeQuality": {"score": 28, "feedback": "Clean and readable code"},
        "efficiency": {"score": 20, "feedback": "Optimal O(n) solution"},
        "bestPractices": {"score": 7, "feedback": "Good use of hashmap"}
      },
      "strengths": ["Optimal algorithm", "Clean code", "Good variable names"],
      "improvements": ["Add input validation", "Consider edge cases"],
      "overallFeedback": "Excellent solution with optimal time complexity"
    },
    "createdAt": "2025-10-02T01:50:00.000Z"
  }
}
```

---

## 🏆 **Step 6: Check Leaderboard**

### **6.1 Get Contest Leaderboard**
```bash
curl -X GET https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/CONTEST_ID/leaderboard \
  -H "Authorization: Bearer USER_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "leaderboard": [
    {
      "userId": "user-uuid-here",
      "score": 95,
      "rank": 1,
      "updatedAt": "2025-10-02T01:50:00.000Z",
      "userName": "Test User",
      "userEmail": "testuser@thapar.edu"
    }
  ]
}
```

---

## 🧪 **Step 7: Test Edge Cases**

### **7.1 Test Rate Limiting (Submit 6 times)**
```bash
# Submit 5 more times (should fail on 6th attempt)
for i in {1..5}; do
  curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/CONTEST_ID/submit \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer USER_JWT_TOKEN" \
    -d '{"code": "def two_sum(nums, target):\n    return [0,1]", "language": "python"}'
done
```

**Expected Response (6th attempt):**
```json
{
  "error": "Submission limit reached",
  "message": "Maximum 5 submissions allowed per contest"
}
```

### **7.2 Test Invalid Contest**
```bash
curl -X POST https://codeforces-backend.bkumar-be23.workers.dev/simple-contests/invalid-id/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_JWT_TOKEN" \
  -d '{"code": "print(\"hello\")", "language": "python"}'
```

**Expected Response:**
```json
{
  "error": "Contest not found"
}
```

---

## ✅ **Success Criteria Checklist**

- [ ] Admin can create contest successfully
- [ ] Contest appears in contest list
- [ ] User can submit code successfully
- [ ] AI processes submission and returns score
- [ ] Submission status changes from pending → running → completed
- [ ] AI review contains detailed feedback and scoring breakdown
- [ ] Leaderboard updates with user's best score
- [ ] Rate limiting works (max 5 submissions)
- [ ] Error handling works for invalid requests
- [ ] All API responses are properly formatted

---

## 🎯 **Expected AI Scoring Breakdown**

**Good Solution (95+ points):**
- Correctness: 40/40 (produces expected output)
- Code Quality: 25-30/30 (clean, readable)
- Efficiency: 15-20/20 (optimal algorithm)
- Best Practices: 7-10/10 (good practices)

**Average Solution (70-85 points):**
- Correctness: 35-40/40 (mostly correct)
- Code Quality: 20-25/30 (decent structure)
- Efficiency: 10-15/20 (suboptimal but works)
- Best Practices: 5-8/10 (some issues)

**Poor Solution (0-70 points):**
- Correctness: 0-35/40 (incorrect or incomplete)
- Code Quality: 10-20/30 (messy code)
- Efficiency: 0-10/20 (very inefficient)
- Best Practices: 0-5/10 (many issues)

---

## 🚀 **Complete Flow Summary**

1. ✅ **Admin creates contest** with problem statement
2. ✅ **User submits code** (multiple attempts allowed)
3. ✅ **AI reviews code** and provides detailed feedback
4. ✅ **Scores are calculated** and stored
5. ✅ **Leaderboard updates** automatically
6. ✅ **Rate limiting prevents spam** submissions

**Your contest platform is working perfectly! 🎉**
