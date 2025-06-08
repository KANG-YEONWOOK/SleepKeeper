import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { hashPassword } from '../../utils/hashUtils';

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

function ErrorModal({ isOpen, message, onClose }: ErrorModalProps) {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인 실패</h3>
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

interface LoginResponse {
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  jwt_token: string;
}

interface SignupResponse {
  user: {
    user_id: string;
    name: string;
    email: string;
  };
  jwt_token: string;
}

async function login({ email, password_hash }: { email: string; password_hash: string }) {
  const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password_hash })
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data.body || '이메일 또는 비밀번호를 확인해주세요.');
  }
  return data;
}

async function signup({ email, name, password_hash }: { email: string; name: string; password_hash: string }) {
  const response = await fetch('https://2r3hmaxnj4.execute-api.eu-north-1.amazonaws.com/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      name,
      password_hash
    })
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data.body || '회원가입에 실패했습니다.');
  }
  return data;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hashedPassword = hashPassword(password);
      const data: LoginResponse = await login({ email, password_hash: hashedPassword });
      
      loginStore(
        { id: data.user.user_id, email: data.user.email, name: data.user.name },
        data.jwt_token
      );
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorModal({
        isOpen: true,
        message: error instanceof Error ? error.message : '로그인에 실패했습니다.'
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hashedPassword = hashPassword(password);
      const data: SignupResponse = await signup({ 
        email, 
        name, 
        password_hash: hashedPassword 
      });
      
      loginStore(
        { id: data.user.user_id, email: data.user.email, name: data.user.name },
        data.jwt_token
      );
      navigate('/home');
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorModal({
        isOpen: true,
        message: error instanceof Error ? error.message : '회원가입에 실패했습니다.'
      });
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center" style={{ backgroundColor: '#223A61' }}>
      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white m-6 p-8">
        <img src="/sleepkeeperLogo.png" alt="Sleep Keeper Logo" className="w-32 h-32 mx-auto" />
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-900" style={{ color: '#223A61' }}>
            Sleep Keeper
          </h2>
          <p className="mt-2 text-sm text-gray-600" style={{ color: '#223A61' }}>
            Keep your Sleep, Keep your Health
          </p>
        </div>
        
        {isLogin ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="email" className="sr-only">
                  이메일
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223A61] hover:bg-[#1a2d4b] cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: '#223A61', color: 'white' }}
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223A61] hover:bg-[#1a2d4b] cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: '#223A61', color: 'white' }}
              >
                회원가입
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4 rounded-md">
              <div>
                <label htmlFor="signup-email" className="sr-only">
                  이메일
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="signup-name" className="sr-only">
                  이름
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="sr-only">
                  비밀번호
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223A61] hover:bg-[#1a2d4b] cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: '#223A61', color: 'white' }}
              >
                회원가입
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223A61] hover:bg-[#1a2d4b] cursor-pointer transition-colors duration-200"
                style={{ backgroundColor: '#223A61', color: 'white' }}
              >
                로그인으로 돌아가기
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
