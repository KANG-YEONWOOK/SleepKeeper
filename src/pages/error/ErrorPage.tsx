import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <main className="flex h-screen w-screen items-center justify-center" style={{ backgroundColor: '#223A61' }}>
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 text-center">
        <h1 className="text-6xl font-bold text-[#223A61]">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600">요청하신 페이지가 존재하지 않거나 접근할 수 없습니다.</p>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-6 py-2 bg-[#223A61] text-white rounded-md hover:bg-[#1a2d4b] transition-colors duration-200"
        >
          홈으로 돌아가기
        </button>
      </div>
    </main>
  );
} 