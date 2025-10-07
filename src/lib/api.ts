export type Difficulty = "easy" | "medium" | "hard";

export class ContestAPI {
  private baseURL = 'https://codeforces-backend.bkumar-be23.workers.dev';
  private token: string | null;

  constructor(token?: string | null) {
    this.token = token ?? null;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {}),
    };

    const response = await fetch(url, { ...options, headers });
    const isJson = (response.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await response.json() : undefined;
    if (!response.ok) {
      const message = data?.message || data?.error || 'API request failed';
      throw new Error(message);
    }
    return data;
  }

  // Auth
  signup(email: string, password: string, name: string) {
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
    if ((result as any)?.token) this.setToken((result as any).token);
    return result;
  }

  getProfile() {
    return this.request('/users/me');
  }

  // Full contests
  createContest(title: string, description: string, difficulty: Difficulty) {
    return this.request('/contests', {
      method: 'POST',
      body: JSON.stringify({ title, description, difficulty }),
    });
  }

  getContests() {
    return this.request('/contests');
  }

  getContest(id: string) {
    return this.request(`/contests/${id}`);
  }

  // Simple contests (used in current UI)
  getSimpleContests() {
    return this.request('/simple-contests');
  }

  getSimpleContest(id: string) {
    return this.request(`/simple-contests/${id}`);
  }

  getSimpleContestSubmissions(id: string) {
    return this.request(`/simple-contests/${id}/submissions`);
  }

  getSimpleContestLeaderboard(id: string) {
    return this.request(`/simple-contests/${id}/leaderboard`);
  }

  submitSimpleContestCode(id: string, code: string, language: string) {
    return this.request(`/simple-contests/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  }
}

export const api = new ContestAPI();


