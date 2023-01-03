import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import authStorage from '../lib/auth/authStorage'
import AuthContext from '../lib/auth/context'

export default function App({ Component, pageProps }: AppProps) {
  const [isUserReady, setIsUserReady] = useState(false);
  const [user, setUser] = useState();

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    setIsUserReady(true);
    if (user) setUser(user);
  };

  useEffect(() => {
    restoreUser();
  }, []);

  if (!isUserReady) {
    return <div>User isn&apos;t ready yet</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeProvider attribute='class'>
        <div className=' flex flex-col justify-between min-h-screen'>
          <div className='grow flex flex-col'>
            <Navbar />
            <Component {...pageProps} />
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    </AuthContext.Provider>
  )
}
