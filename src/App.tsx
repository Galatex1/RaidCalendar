import { CalendarPlus, CalendarX, CircleNotch, Calendar as Clndr, DiscordLogo } from '@phosphor-icons/react';
import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import './App.css'
import Calendar from './Calendar';
import Login from './Login';
import one from './assets/one.jfif';
import two from './assets/two.jfif';
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr';

// const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

export const AuthContext = createContext<{ user: User, servers: Array<Server>, logout: () => void, bg: string }>(null);

const backgrounds = [
  one,
  two
];

interface User {
  id: number,
  username: string,
  avatar: string
}

interface Server {
  id: number,
  name: string,
  icon: string
}

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [servers, setServers] = useState<Array<Server> | null>(null);
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState(backgrounds[Math.floor(Math.random() * backgrounds.length)]);

  const loadUser = async () => {
    setLoading(true);
    try {
      let { data } = await axios.get('https://discord.com/api/users/@me', { headers: { Authorization: token, Accept: 'application/json' } });
      setUser(data);
    } catch (error) {
      logout();
    }

    try {
      let { data } = await axios.get('https://discord.com/api/users/@me/guilds', { headers: { Authorization: token, Accept: 'application/json' } });
      setServers(data);
    } catch (error) {
      // console.log(error)
      // logout();
    }

    setLoading(false);
  }

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  let redirect_uri = `https://discord.com/api/oauth2/authorize?client_id=1162065374561443962&redirect_uri=${encodeURI(/* location.href */"https://galatex1.github.io/RaidCalendar")}&response_type=token&scope=guilds%20identify`;

  useEffect(() => {
    if (!token) {
      const fragment = new URLSearchParams(window.location.hash.slice(1));

      let t = fragment.get('access_token');
      let type = fragment.get('token_type');

      if (t && type) {
        localStorage.setItem('token', `${type} ${t}`);
        setToken(`${type} ${t}`);
      }
      else {
        // window.location.replace(redirect_uri);
      }
    }

  }, [])

  useEffect(() => {
    console.log(token);
    if (token)
      loadUser();
  }, [token])



  return (
    <AuthContext.Provider value={{ user, logout, servers, bg }}>
      {
        (
          (user && servers && !loading)
            ? <Calendar />
            : (
              <div className='h-screen w-full bg-slate-900 mix-blend-multiply flex flex-col gap-8px text-white font-sans p-64px py-32px relative overflow-hidden items-center justify-center'>
                <img className='absolute w-full h-full bg-cover mix-blend-overlay z-0' src={bg} alt="background" />
                <h1 className='text-9xl font-bold text-white/70  text-center leading-none flex flex-col items-center gap-32px'>
                  <Clndr size={128} className="leading-none" />
                  <div>Raid Calendar</div>
                  <div className='text-4xl h-[128px]'>(by Galatex)</div>
                </h1>
                {
                  loading ?
                    <div className='absolute bottom-[15vh] aspect-square bg-white/10 rounded-full z-10 p-10px'>
                      <div className='animate-spin'>
                        <CircleNotch size={100} className='text-white' />
                      </div>
                    </div>
                    :
                    <a href={redirect_uri} className='inline-flex w-max rounded items-center gap-12px text-white p-8px mix-blend-screen hover:bg-[#1427f9] bg-[#5865f2]'><DiscordLogo size={24} /> Login with Discord</a>
                }
              </div>
            )
        )
      }
    </AuthContext.Provider>
  )
}

export default App
