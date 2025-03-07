import { ArrowClockwise, ArrowRight, CalendarBlank, Check, CheckCircle, CheckFat, Power, Star } from '@phosphor-icons/react';
import { ArrowLeft, CircleNotch, Person, PersonSimple, User } from '@phosphor-icons/react/dist/ssr';
import axios from 'axios';
import moment from 'moment'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './App';
import { useDebouncedCallback } from './useDebouncedCallback';


function Server({ s, setActive, setFavourite, favourite, checked }) {


  return (
    <label className={`flex items-center gap-6px p-12px py-4px group hover:bg-white/5font-semibold ${favourite ? 'order-2' : 'order-3'}`}>
      <div className={`w-17px h-17px rounded  border flex justify-center cursor-pointer flex-shrink-0 items-center border-slate-900 bg-slate-900 group-hover:bg-slate-600 ${checked ? ' text-white   ' : ''}`}>
        {checked && <CheckFat weight='fill' size={10} className="" />}
        <input type="checkbox" className='h-0 w-0 outline-none appearance-none' name={`active_${s.id}`} checked={checked} onChange={e => setActive(s.id, e.target.checked)} />
      </div>
      <div className='w-30px h-30px relative'>
        {
          s.icon
            ? <img className='w-30px h-30px rounded-full' src={`https://cdn.discordapp.com/icons/${s.id}/${s.icon}.webp`} alt={s.name} />
            : <div className='w-30px h-30px rounded-full text-xs bg-[#2b2d31] uppercase flex items-center justify-center'>{s.name.match(/\b(\w)/g).join('')}</div>
        }
        <Star onClick={_ => setFavourite(s.id)} size={16} className={`absolute bottom-0 right-0 translate-y-4px translate-x-4px  group-hover:block hover:scale-125 ${favourite ? 'text-yellow-500 cursor-pointer hover:text-white/50' : 'hidden hover:text-yellow-500 cursor-pointer text-white/50'}`} weight='fill' />
      </div>
      <div className='text-sm'>
        {s.name}
      </div>
    </label>
  );
}


function Calendar() {

  const [start, setStart] = useState(moment().startOf('month'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(moment());
  let days = start.daysInMonth();
  // const [open, setOpen] = useState(false)

  const { user, logout, servers, bg } = useContext(AuthContext)

  const [activeServers, setActiveServers] = useState(JSON.parse(localStorage.getItem('active_servers') ?? null) ?? servers.reduce((p, c) => ({ ...p, [c.id]: false }), {}));

  const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem('favourite_servers') ?? null) ?? []);

  const server_ids = Object.entries(activeServers).filter(([id, checked]) => checked).map(([id, checked]) => id);

  const user_id = user.id;

  const loadEvents = useDebouncedCallback(async () => {

    setEvents([])

    let _servers = [];
    let _events = [];

    let se = localStorage.getItem(`saved_events`);
    let saved: { saved: string, servers: Array<string>, events: Array<any> } | null = se ? JSON.parse(se) : null;
    let fresh = (saved && server_ids.reduce((p, c) => (p && (saved?.servers?.includes(c) ?? false)), true) && moment().diff(moment(saved.saved), 'minutes') < 10) ? saved : null;

    if (fresh) {
      _events = fresh.events;
      setEvents(_events.filter(e => server_ids.includes(e.serverId)));
      setLastUpdate(moment(saved.saved));
      console.log('Getting events from storage', moment(saved.saved).format(moment.localeData().longDateFormat('LLL')));
      return;
    }

    try {

      setLoading(true);
      for await (const serverid of server_ids) {

        // let { data } = await axios.post('https://corsproxy.io/?' + encodeURIComponent('https://raid-helper.dev/api/events/'), { accessToken: "U2FsdGVkX1/Yg/+RpLM3/rde/K1tPhdcqzYJOO91pTokMUuEh4xh3lYbelQxA6/V", serverid: serverid, IncludeSignUps: true }, {
        //   headers: {
        //     'Accept': 'application/json, text/plain, */*',
        //     'Content-Type': 'application/json',
        //   }
        // });

        let { data } = await axios.post(`https://raid-helper.dev/api/events/`, {
          accessToken: "U2FsdGVkX1/Yg/+RpLM3/rde/K1tPhdcqzYJOO91pTokMUuEh4xh3lYbelQxA6/V",
          serverid: serverid,
          IncludeSignUps: true
        }, {
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          }
        });
        console.log(data);
        _servers = [..._servers, data];

      }

      let evs = _servers.flatMap(s => s.events.map(e => ({ ...e, server: { name: s.servername, icon: s.servericon } })));
      setEvents(evs);

      for await (let server of _servers) {

        for await (const event of server.events) {
          let _event;
          if (moment(`${event.date} ${event.time}`, 'DD-MM-YYYY HH:mm').isBefore(moment())) {
            _event = event;
          }
          else {
            try {

              let { data } = await axios.get(`https://raid-helper.dev/api/v2/events/${event.raidId}`, {
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                }
              });
              await new Promise(resolve => setTimeout(resolve, 6000 / 10));
              _event = data;

            } catch (error) {
              _event = event;
            }

          }

          _events = [..._events, { ..._event, server: { name: server.servername, icon: server.servericon } }];
        }

      }

      setEvents(_events);
      console.log('Saving events to storage');
      localStorage.setItem('saved_events', JSON.stringify({ saved: moment(), events: _events, servers: server_ids }));
      setLastUpdate(moment());

    } catch (error) {

    }

    setLoading(false);

  }, 500);

  useEffect(() => {
    loadEvents();
  }, [start])

  useEffect(() => {
    if (activeServers)
      localStorage.setItem('active_servers', JSON.stringify(activeServers));
    loadEvents();
  }, [activeServers])

  useEffect(() => {
    if (favourites)
      localStorage.setItem('favourite_servers', JSON.stringify(favourites));
  }, [favourites])

  const getEventsByDay = (day) => events.filter(e => moment(`${e.date} ${e.time}`, 'DD-MM-YYYY HH:mm').isSame(start.clone().add(day, 'days'), 'day'));

  const partOf = (event) => {
    return (event?.signUps?.findIndex(signup => signup.userId == user_id) ?? -1) >= 0;
  }

  const multipleInDay = (arr: Array<any>) => arr.reduce((p, c) => p + (partOf(c) ? 1 : 0), 0)


  const setFavourite = (id) => setFavourites(f => f.includes(id) ? f.filter(x => x != id) : [...f, id])
  const setActive = (id, checked) => setActiveServers(s => ({ ...s, [id]: checked }));



  return (

    <div className='h-screen w-full bg-slate-900 flex flex-col text-white font-sans pt-0 relative overflow-hidden bg-blend-multiply items-stretch' style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover' }}>
      {/* <img className='absolute w-full h-full bg-cover mix-blend-overlay z-0' src={bg} alt="background" /> */}
      <div className='w-full flex flex-grow overflow-hidden'>
        <div className='w-[200px] flex-shrink-0 h-full bg-gray-950/80  border-r border-gray-900 flex flex-col justify-between gap-2px overflow-y-auto tagscrollbar pt-16px'>
          <div className='flex flex-col'>
            <h3 className='px-12px font-semibold text-xl flex items-center gap-8px pb-16px order-1'><CalendarBlank size={24} /> Raid Calendar</h3>
            {
              servers.map(s =>
                <Server key={`server-${s.id}`} s={s} favourite={favourites?.includes(s.id)} setFavourite={setFavourite} setActive={setActive} checked={activeServers[s.id] ?? false} />
              )
            }
          </div>
          <div className='relative px-12px justify-self-end flex justify-between items-center border-t border-slate-900 py-12px' >
            <div className='flex items-center gap-12px overflow-hidden overflow-ellipsis'>
              <img className='w-40px h-40px rounded-full object-cover ' src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt={user.username} />
              {user.username}
            </div>
            {<div onClick={e => { e.preventDefault(); e.stopPropagation(); logout() }} title="Logout" className='font-bold flex-shrink-0 text-red-700 hover:text-red-700/90 hover:scale-125 cursor-pointer rounded p-8px'><Power /> </div>}
          </div>
        </div>
        <div className='p-16px flex flex-col gap-4px flex-grow'>
          {
            loading &&
            <div className='fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/40 p-16px rounded z-50'>
              <CircleNotch className='animate-spin ' size={50} />
            </div>
          }
          <div className=' bg-slate-800/80 px-16px py-4px rounded text-3xl flex justify-between items-center flex-grow-0'>
            <ArrowLeft size={24} className="cursor-pointer hover:scale-110" onClick={e => setStart(s => s.clone().add(-1, 'month'))} />
            <div className='text-center'>
              {start.format('MMMM YYYY')}
              <div className='text-xs flex items-center gap-8px'> Updated: {lastUpdate?.format(moment.localeData().longDateFormat('LLL'))} <span title='Refresh Now' className='hover:animate-spin inline-flex'><ArrowClockwise className='hover:scale-110 cursor-pointer inline' size={16} onClick={_ => { localStorage.removeItem('saved_events'); loadEvents(); }} /></span> </div>
            </div>
            <ArrowRight size={24} className="cursor-pointer hover:scale-110" onClick={e => setStart(s => s.clone().add(1, 'month'))} />
          </div>
          <div className='w-full grid grid-cols-7 gap-4px flex-grow flex-shrink overflow-hidden' >
            {
              Array(days).fill(0).map((_, i) =>
                <div key={`day-${i}`} className={` bg-slate-800/80 min-h-[100px] rounded flex flex-col gap-4px overflow-y-auto tagscrollbar`}>
                  <div className='p-4px bg-slate-800/80 sticky top-0 z-40  backdrop-blur-3xl '>
                    <div className='flex items-center justify-between bg-slate-900 rounded px-6px font-semibold '>
                      <div>
                        {start.clone().add(i, 'days').format('dddd')}
                      </div>
                      <div>
                        {start.clone().add(i, 'days').format('D')}
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-4px p-4px'>
                    {
                      getEventsByDay(i).map((event, i, arr) => {
                        let p = partOf(event);
                        let signUp = event?.signUps?.find(signup => signup.userId == user_id)
                        let passed = moment(`${event.date} ${event.time}`, 'DD-MM-YYYY HH:mm').isBefore(moment());

                        return (
                          <div key={`event-${event.raidId ?? event.id}`} className={`${p ? (multipleInDay(arr) > 1 ? 'bg-red-700/60' : 'bg-green-900/60') : 'bg-slate-700'} ${passed && 'opacity-50'} rounded p-4px flex flex-col gap-4px relative`}>
                            <div className='font-medium text-sm flex justify-between items-center '>
                              <div className='flex items-center gap-8px'>
                                <img className='h-20px w-20px object-cover rounded-full' src={event.server.icon} />
                                <div>
                                  {event.server.name}
                                </div>
                              </div>
                              <div className='text-yellow-600'>
                                {moment(`${event.date} ${event.time}`, 'DD-MM-YYYY HH:mm').format('HH:mm')}
                              </div>
                            </div>
                            <div className='text-sm'>{event.title}</div>
                            <div className='flex justify-between items-center'>
                              <div className=' text-xs'>{event.channelName}</div>
                              <div className='flex items-center gap-6px text-xs'><User size={14} /> {event.signupcount ?? event?.signUps?.length ?? 0}</div>
                            </div>
                            {
                              (p && signUp) &&
                              <div className='flex gap-8px items-center'>
                                <img className='h-20px w-20px object-cover rounded-full' src={`https://cdn.discordapp.com/emojis/${signUp.classEmoteId}.png`} />
                                <img className='h-20px w-20px object-cover rounded-full' src={`https://cdn.discordapp.com/emojis/${signUp.roleEmoteId}.png`} />
                                <div>{signUp.name}</div>
                              </div>
                            }
                          </div>
                        )
                      }

                      )
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
