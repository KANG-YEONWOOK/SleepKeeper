import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useAuthStore } from '../../store/authStore';
import './FeedbackCalander.css';
import 'react-calendar/dist/Calendar.css';
import backward from '/backward.svg';
import forward from '/forward.svg';
import SleepDetailModal from './SleepDetailModal';
import { useNavigate } from 'react-router-dom';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface SleepData {
  sleep_date: string;
  total_sleep_minutes: number;
  sleep_score: number;
}

interface SleepDetailData {
  sleep_id: number;
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

export default function FeedbackCalander() {
  const [value, setValue] = useState<Value>(new Date());
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [detailData, setDetailData] = useState<SleepDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const navigate = useNavigate();

  const fetchSleepData = async (year: number, month: number) => {
    if (!user?.email || !token) return;
    
    try {
      const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/data/calander', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: user.email, year, month })
      });
      
      const data = await response.json();
      setSleepData(data);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
    }
  };

  const fetchSleepDetail = async (date: Date) => {
    if (!user?.email || !token) return;
    
    try {
      const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/data/calander/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        })
      });
      
      if (response.status === 404) {
        const errorText = await response.text();
        setDetailData({
          sleep_id: 0,
          summary: [],
          detail: [],
          error: errorText
        });
        setIsModalOpen(true);
        return;
      }
      
      const data = await response.json();
      console.log(data);
      if (data.detail.length === 0 && data.summary.length === 0) {
        setDetailData({
          sleep_id: 0,
          summary: [],
          detail: [],
          error: "해당 날짜의 수면 데이터가 없습니다."
        });
      } else {
        setDetailData(data);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching sleep detail:', error);
    }
  };

  useEffect(() => {
    if (value instanceof Date) {
      fetchSleepData(value.getFullYear(), value.getMonth() + 1);
    }
  }, [value]);

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayData = sleepData.find(data => data.sleep_date === dateStr);
    
    if (dayData) {
      return (
        <div className="sleep-score">
          {dayData.sleep_score}점
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    fetchSleepDetail(date);
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
      <div className="max-w-xl mx-auto pt-32 px-4">
        <h1 className="text-white text-2xl font-bold text-center mb-8">
          수면 피드백 캘린더
        </h1>
        <div className="calendar-wrapper bg-white rounded-lg p-2 pb-6 shadow-lg">
          <Calendar
            onChange={setValue}
            value={value}
            className="custom-calendar"
            tileContent={tileContent}
            onClickDay={handleDateClick}
            navigationLabel={({ date }) => {
              const year = date.getFullYear();
              const month = date.getMonth() + 1;
              return (
                <div className="navigation-label text-xs font-bold">
                  {year}년 {month}월
                </div>
              );
            }}
            prevLabel={<img src={backward} alt="이전" className='w-4 h-4'/>}
            nextLabel={<img src={forward} alt="다음" className='w-4 h-4'/>}
          />
        </div>
      </div>

      {detailData && (
        <SleepDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sleepId={detailData.sleep_id}
          summary={detailData.summary}
          detail={detailData.detail}
          error={detailData.error}
        />
      )}
    </div>
  );
}