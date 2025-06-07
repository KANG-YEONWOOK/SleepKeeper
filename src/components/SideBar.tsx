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
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16" />

          {/* 메뉴 항목들 */}
          <div className="flex-1 px-4 py-2">
            <button
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center"
              onClick={() => {
                // TODO: 피드백 달력 페이지로 이동
                onClose();
              }}
            >
              <span className="font-bold ml-2">피드백 달력</span>
            </button>
          </div>

          {/* 로그아웃 버튼 */}
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