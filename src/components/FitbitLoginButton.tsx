import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

interface FitbitModalProps {
  isOpen: boolean;
  message: string;
  isSuccess: boolean;
  onClose: () => void;
}

function FitbitModal({ isOpen, message, isSuccess, onClose }: FitbitModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? '연동 성공' : '연동 실패'}
          </h3>
          <p className="text-gray-600 mb-4">{message}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-[#223A61] text-white rounded-md hover:bg-[#1a2d4b] transition-colors duration-200"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FitbitLoginButton() {
  // const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFitbitLogin = () => {
    const redirectUri = import.meta.env.VITE_FITBIT_REDIRECT_URI;
    const clientId = import.meta.env.VITE_FITBIT_CLIENT_ID;
    
    if (!redirectUri || !clientId) {
      setModalMessage('환경 변수가 설정되지 않았습니다.');
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    // URL 파라미터에서 성공/실패 여부 확인
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');

    if (status && message) {
      setIsSuccess(status === 'success');
      setModalMessage(message);
      setShowModal(true);
      // URL 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Fitbit 인증 페이지로 리다이렉트
      window.location.href = `https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }
  };

  return (
    <>
      <button 
        onClick={handleFitbitLogin} 
        className="bg-[#43909c] text-white rounded px-4 py-2 font-bold hover:bg-[#1a2d4b] transition-colors duration-200"
      >
        Fitbit 계정 연동하기
      </button>
      <FitbitModal
        isOpen={showModal}
        message={modalMessage}
        isSuccess={isSuccess}
        onClose={() => setShowModal(false)}
      />
    </>
  );
} 