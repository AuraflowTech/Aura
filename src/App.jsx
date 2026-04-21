import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { LogIn } from 'lucide-react';

export default function AuraApp() {
  const [activeTab, setActiveTab] = useState('links');
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('CZ');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const adminPassword = 'admin'; 
  const [session, setSession] = useState(null);

  // --- AUTH LOGIKA ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Tohle zajistí, že se vrátíš přesně tam, kde jsi teď
        redirectTo: window.location.origin 
      }
    });
    if (error) console.error("Auth error:", error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- LOKÁLNÍ STAV ODKAZŮ ---
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('aura-links');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'Google', url: 'https://google.com', desc: 'Vyhledávač', color: 'bg-emerald-500' },
      { id: 2, label: 'YouTube', url: 'https://youtube.com', desc: 'Video portál', color: 'bg-red-600' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aura-links', JSON.stringify(links));
  }, [links]);

  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const addLink = () => {
    if (newLabel && newUrl) {
      const newEntry = {
        id: Date.now(),
        label: newLabel,
        url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
        desc: newDesc || t[lang].defaultDesc,
        color: 'bg-emerald-500',
      };
      setLinks([...links, newEntry]);
      setNewLabel(''); setNewUrl(''); setNewDesc('');
    }
  };

  const deleteLink = (id) => setLinks(links.filter((link) => link.id !== id));

  const t = {
    CZ: {
      tabs: ['odkazy', 'správa', 'admin', 'feedback'],
      addTitle: 'Nová Karta',
      listTitle: 'Aktuální karty',
      nameLabel: 'Název portálu',
      urlLabel: 'URL adresa',
      descLabel: 'Popis (nepovinné)',
      addBtn: 'PŘIDAT DO AURY +',
      feedbackOffline: 'Feedback systém je offline.',
      defaultDesc: 'Uživatelský odkaz',
      signIn: 'Přihlásit se přes Google',
    },
    EN: {
      tabs: ['links', 'manage', 'admin', 'feedback'],
      addTitle: 'New Card',
      listTitle: 'Current Cards',
      nameLabel: 'Portal Name',
      urlLabel: 'URL Address',
      descLabel: 'Description (optional)',
      addBtn: 'ADD TO AURA +',
      feedbackOffline: 'Feedback system is offline.',
      defaultDesc: 'User link',
      signIn: 'Sign in with Google',
    },
  };

  // --- AUTH GUARD ---
  if (!session) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-[#0f1115]' : 'bg-gray-50'}`}>
        <div className={`p-10 rounded-3xl border text-center max-w-sm w-full ${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white border-gray-100 shadow-2xl'}`}>
          <img src="/logo_nobg.png" alt="Aura Logo" className="h-16 mx-auto mb-6" />
          <h1 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>AURA OS Terminal</h1>
          <button onClick={handleLogin} className="flex items-center justify-center w-full gap-3 bg-white text-black p-3.5 rounded-xl font-black hover:bg-gray-200 transition-all text-[10px] uppercase shadow-lg">
            <LogIn size={16} />
            {t[lang].signIn}
          </button>
        </div>
      </div>
    );
  }

  // --- HLAVNÍ DASHBOARD ---
  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-[#0f1115] text-white' : 'bg-gray-50 text-gray-900'} p-6 font-sans text-xs`}>
      <header className="max-w-4xl mx-auto mb-6 relative flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 flex flex-col space-y-2">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl border ${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white border-gray-200'}`}>{darkMode ? '☀️' : '🌙'}</button>
          <button onClick={() => setLang(lang === 'CZ' ? 'EN' : 'CZ')} className={`p-2 rounded-xl border font-black text-[9px] ${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white border-gray-200'}`}>{lang}</button>
          <button onClick={handleLogout} className="p-2 rounded-xl border bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px]">🚪</button>
        </div>
        <div className="mt-4 mb-2"><img src="/logo_nobg.png" alt="Logo" className="h-12 w-auto" /></div>
        <p className={`${darkMode ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-[0.25em] text-[8px] font-black italic`}>
          USER: {session.user.email.split('@')[0].toUpperCase()}
        </p>
      </header>

      <nav className="max-w-4xl mx-auto flex justify-center space-x-1.5 mb-8 text-[9px] font-black">
        {t[lang].tabs.map((tabLabel, index) => {
          const tabKey = ['links', 'manage', 'admin', 'feedback'][index];
          return (
            <button key={tabKey} onClick={() => setActiveTab(tabKey)} className={`px-4 py-1.5 rounded-full transition-all ${activeTab === tabKey ? (darkMode ? 'bg-white text-black' : 'bg-black text-white') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
              {tabLabel.toUpperCase()}
            </button>
          );
        })}
      </nav>

      <main className="max-w-4xl mx-auto flex justify-center">
        {/* TAB ODKAZY */}
        {activeTab === 'links' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
            {links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className={`${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white border-gray-100'} p-1.5 px-4 rounded-lg transition-all flex items-center space-x-3 border hover:scale-[1.02]`}>
                <div className={`w-1 h-5 ${link.color} rounded-full`}></div>
                <div className="text-left overflow-hidden">
                  <h3 className="text-sm font-bold truncate">{link.label}</h3>
                  <p className="text-gray-500 text-[9px] leading-tight truncate">{link.desc}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* TAB SPRÁVA */}
        {activeTab === 'manage' && (
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl animate-fade-in">
            <div className={`${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white shadow-lg'} flex-1 p-6 rounded-2xl border`}>
              <h2 className="text-sm font-black mb-4 uppercase text-emerald-500">{t[lang].addTitle}</h2>
              <div className="space-y-3">
                <input placeholder={t[lang].nameLabel} className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-[#0f1115] border-gray-700' : 'bg-gray-50'}`} value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
                <input placeholder={t[lang].urlLabel} className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-[#0f1115] border-gray-700' : 'bg-gray-50'}`} value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                <input placeholder={t[lang].descLabel} className={`w-full p-2 rounded-lg border outline-none ${darkMode ? 'bg-[#0f1115] border-gray-700' : 'bg-gray-50'}`} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
                <button onClick={addLink} className="w-full bg-emerald-600 text-white p-2 rounded-lg font-black uppercase text-[9px] hover:bg-emerald-700">{t[lang].addBtn}</button>
              </div>
            </div>
            <div className={`${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white shadow-lg'} flex-1 p-6 rounded-2xl border`}>
              <h2 className="text-sm font-black mb-4 uppercase text-orange-500">{t[lang].listTitle}</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-2 rounded-lg border border-gray-800/50 bg-black/10">
                    <span className="font-bold text-[10px] truncate max-w-[120px]">{link.label}</span>
                    <button onClick={() => deleteLink(link.id)} className="text-orange-500 font-black text-[8px] hover:underline">DEL ✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB ADMIN */}
        {activeTab === 'admin' && (
          <div className="w-full max-w-sm mx-auto">
            {!isAdmin ? (
              <div className={`p-8 rounded-2xl border text-center ${darkMode ? 'bg-[#1a1d23] border-gray-800' : 'bg-white shadow-xl'}`}>
                <div className="mb-4 text-2xl">🔒</div>
                <input type="password" placeholder="•••••" className={`w-full p-3 rounded-xl border text-center mb-3 ${darkMode ? 'bg-[#0f1115] border-gray-700' : 'bg-gray-50'}`} value={passInput} onChange={(e) => setPassInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && passInput === adminPassword && setIsAdmin(true)} />
                <button onClick={() => passInput === adminPassword ? setIsAdmin(true) : alert('Wrong')} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-black uppercase text-[9px]">ACCESS</button>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-emerald-500 font-black uppercase mb-4">ADMIN CONSOLE ACTIVE</h2>
                <button onClick={() => setIsAdmin(false)} className="text-[8px] text-orange-500 uppercase font-black">Lock Console</button>
              </div>
            )}
          </div>
        )}

        {/* TAB FEEDBACK */}
        {activeTab === 'feedback' && <div className="py-16 text-gray-500 italic font-black uppercase">{t[lang].feedbackOffline}</div>}
      </main>
    </div>
  );
}