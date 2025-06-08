import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-10 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-24" />

          {/* 메뉴 항목들 */}
          <div className="flex-1 px-4 py-2">
            <button
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center"
              onClick={() => {
                navigate('/feedback-calander');
                onClose();
              }}
            >
              <img src="/sleeper.png" alt="sleeper" className="w-8 h-8" />
              <span className="font-bold ml-2">피드백 달력</span>
            </button>
            <button
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center"
              onClick={() => {
                navigate('/sleep-optimizer');
                onClose();
              }}
            >
              <img src="/sleeper.png" alt="sleeper" className="w-8 h-8" />
              <span className="font-bold ml-2">수면 최적화</span>
            </button>
          </div>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-white font-bold bg-red-800 hover:bg-red-600 rounded-lg transition-colors duration-200 flex items-center"
            >로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 