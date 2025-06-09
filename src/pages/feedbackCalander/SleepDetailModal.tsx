import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import './SleepDetailModal.css';

interface SleepDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sleepId: number;
  summary: {
    level: string;
    count: number;
    minutes: number;
  }[];
  detail: {
    start_time: string;
    level: string;
    duration_sec: number;
  }[];
  error?: string;
}

export default function SleepDetailModal({ isOpen, onClose, summary, detail, error }: SleepDetailModalProps) {
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const loadFeedback = async () => {
      if (!user?.email || !token || !isOpen) return;
      
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
  }, [user?.email, token, isOpen]);

  if (!isOpen) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'deep': return '#223A61';
      case 'light': return '#4A90E2';
      case 'rem': return '#50E3C2';
      case 'wake': return '#F5A623';
      default: return '#223A61';
    }
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'deep': return '깊은 수면';
      case 'light': return '얕은 수면';
      case 'rem': return '렘 수면';
      case 'wake': return '깨어있음';
      default: return level;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>수면 상세 정보</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {error ? (
            <div className="error-message">
              {error}
            </div>
          ) : (
            <>
            <div className="feedback-section">
                <h3 className='feedback-title'>AI 피드백</h3>
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
              <div className="summary-section">
                <h3>수면 요약</h3>
                <div className="summary-grid">
                  {summary.map((item, index) => (
                    <div key={index} className="summary-item" style={{ borderColor: getLevelColor(item.level) }}>
                      <div className="level-name" style={{ color: getLevelColor(item.level) }}>
                        {getLevelName(item.level)}
                      </div>
                      <div className="level-details">
                        <div>횟수: {item.count}회</div>
                        <div>시간: {Math.floor(item.minutes / 60)}시간 {item.minutes % 60}분</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>수면 패턴</h3>
                <div className="detail-list">
                  {detail.map((item, index) => (
                    <div key={index} className="detail-item" style={{ borderColor: getLevelColor(item.level) }}>
                      <div className="time">{new Date(item.start_time).toLocaleTimeString()}</div>
                      <div className="level" style={{ color: getLevelColor(item.level) }}>
                        {getLevelName(item.level)}
                      </div>
                      <div className="duration">{Math.floor(item.duration_sec / 60)}분 {item.duration_sec % 60}초</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 