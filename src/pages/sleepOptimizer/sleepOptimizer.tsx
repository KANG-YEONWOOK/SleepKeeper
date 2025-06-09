import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import './sleepOptimizer.css';

interface OptimizerData {
  updated_at: string;
  target_temperature: number;
  target_humidity: number;
  description: string;
}

export default function SleepOptimizer() {
  const [feedback, setFeedback] = useState<string>('');
  const [optimizerData, setOptimizerData] = useState<OptimizerData[]>([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
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
        if (data && typeof data === 'object' && 'content' in data) {
          return data.content;
        }
      } catch {
        return text;
      }

      if (!response.ok) {
        throw new Error(data.body || '피드백 조회 실패');
      }

      return data;
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  };

  const fetchOptimizerData = async (email: string, token: string): Promise<OptimizerData[]> => {
    const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/data/optimizer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }
    return response.json();
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user?.email || !token) return;
      
      try {
        setIsLoading(true);
        const [feedbackData, optimizerData] = await Promise.all([
          fetchLatestFeedback(user.email, token),
          fetchOptimizerData(user.email, token)
        ]);
        setFeedback(feedbackData);
        setOptimizerData(optimizerData);
        setCurrentDataIndex(0);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user?.email, token]);

  const handlePrevData = () => {
    setCurrentDataIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextData = () => {
    setCurrentDataIndex((prev) => (prev < optimizerData.length - 1 ? prev + 1 : prev));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

      <div className="max-w-2xl mx-auto pt-28 px-4">
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
            <>
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

              {optimizerData.length > 0 && (
                <div className="optimizer-section">
                  <div className="optimizer-header">
                    <button 
                      className="nav-button" 
                      onClick={handleNextData}
                      disabled={currentDataIndex === optimizerData.length - 1}
                    >
                      <img src="/backward.svg" alt="이전" />
                    </button>
                    <h3>최적화 데이터</h3>
                    <button 
                      className="nav-button" 
                      onClick={handlePrevData}
                      disabled={currentDataIndex === 0}
                    >
                      <img src="/forward.svg" alt="다음" />
                    </button>
                  </div>
                  <div className="optimizer-content">
                    <div className="optimizer-date">
                      {formatDate(optimizerData[currentDataIndex].updated_at)}
                    </div>
                    <div className="optimizer-details">
                      <div className="optimizer-item">
                        <span className="label">최적 온도:</span>
                        <span className="value">{optimizerData[currentDataIndex].target_temperature}°C</span>
                      </div>
                      <div className="optimizer-item">
                        <span className="label">최적 습도:</span>
                        <span className="value">{optimizerData[currentDataIndex].target_humidity}%</span>
                      </div>
                      <div className="optimizer-description">
                        {optimizerData[currentDataIndex].description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}