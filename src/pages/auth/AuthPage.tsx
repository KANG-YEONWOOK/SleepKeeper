import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import sleepKeeperLogo from '../../../public/sleepkeeperLogo.png';
import { useAuthStore } from '../../store/authStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: 실제 로그인 API 호출
      // 임시로 로그인 성공 처리
      const mockUser = {
        id: '1',
        email: email,
      };
      const mockToken = 'admin-token';
      
      login(mockUser, mockToken);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      navigate('/auth');
    }
  };

  return (
    <main className="flex h-screen w-screen items-center justify-center" style={{ backgroundColor: '#223A61' }}>
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8">
        <img src={sleepKeeperLogo} alt="Sleep Keeper Logo" className="w-32 h-32 mx-auto" />
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-900" style={{ color: '#223A61' }}>
            Sleep Keeper
          </h2>
          <p className="mt-2 text-sm text-gray-600" style={{ color: '#223A61' }}>
            Keep your Sleep, Keep your Health
          </p>
        </div>
        
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

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#223A61] hover:bg-[#1a2d4b] cursor-pointer transition-colors duration-200"
              style={{ backgroundColor: '#223A61', color: 'white' }}
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
