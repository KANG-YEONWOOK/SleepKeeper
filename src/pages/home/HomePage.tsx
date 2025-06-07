import { useState } from 'react';
import sleepKeeperLogo from '../../../public/sleepkeeperLogo.png';
import SideBar from '../../components/SideBar';
import { useAuthStore } from '../../store/authStore';

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#223A61' }}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <img
              src="/hamburger.svg"
              alt="메뉴"
              className="w-6 h-6"
            />
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src={sleepKeeperLogo}
              alt="Sleep Keeper Logo"
              className="w-12 h-12"
            />
          </div>

          <div className="w-10"></div>
        </div>
      </header>

      {/* 사이드바 */}
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 메인 컨텐츠 영역 */}
      <main className="pt-16 px-4">
        {/* 환영 메시지 */}
        <div className="mt-6">
          <h1 className="text-white text-xl font-bold">
            {user?.email}님, 오늘도 숙면하세요!
          </h1>
        </div>

        {/* 최근 수면 데이터 영역 */}
        <div className="mt-8">
          <h2 className="text-white text-lg font-semibold text-center mb-4">
            최근 수면 데이터
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            {/* 여기에 수면 데이터 컴포넌트가 들어갈 예정 */}
            <p className="text-gray-500 text-center">
              수면 데이터를 불러오는 중...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
