import './SleepDetailModal.css';

interface SleepSummary {
  level: string;
  count: number;
  minutes: number;
}

interface SleepDetail {
  start_time: string;
  level: string;
  duration_sec: number;
}

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

export default function SleepDetailModal({ isOpen, onClose, sleepId, summary, detail, error }: SleepDetailModalProps) {
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