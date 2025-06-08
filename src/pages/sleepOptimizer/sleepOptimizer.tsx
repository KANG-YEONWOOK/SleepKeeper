import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './sleepOptimizer.css';

export default function SleepOptimizer() {
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const fetchLatestFeedback = async (email: string, token: string) => {
    try {
      const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/data/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email })
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
        // JSON 파싱 성공 시 content만 추출
        if (data && typeof data === 'object' && 'content' in data) {
          console.log('Parsed content:', data.content);
          return data.content;
        }
      } catch {
        console.log('Failed to parse JSON, using raw text:', text);
        return text;
      }

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: data
      });

      if (!response.ok) {
        throw new Error(data.body || '피드백 조회 실패');
      }

      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadFeedback = async () => {
      if (!user?.email || !token) return;
      
      try {
        setIsLoading(true);
        const data = await fetchLatestFeedback(user.email, token);
        setFeedback(data);
      } catch (error) {
        console.error('Failed to load feedback:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedback();
  }, [user?.email, token]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#223A61' }}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <img
              src="/backward.svg"
              alt="backward"
              className="w-6 h-6"
            />
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/sleepkeeperLogo.png"
              alt="Sleep Keeper Logo"
              className="w-12 h-12"
            />
          </div>

          <div className="w-10"></div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto pt-32 px-4">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          AI 피드백
        </h1>
        
        <div className="feedback-container">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>피드백을 불러오는 중...</p>
            </div>
          ) : (
            <div className="feedback-content">
              {typeof feedback === 'string' ? (
                feedback.split('\n').map((line, index) => (
                  <p key={index} className="feedback-line">
                    {line}
                  </p>
                ))
              ) : (
                <p className="feedback-line">
                  {JSON.stringify(feedback, null, 2)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}