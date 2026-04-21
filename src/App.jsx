import React, { useState, useEffect } from 'react';

export default function AuraApp() {
  const [activeTab, setActiveTab] = useState('links');
  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('CZ');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passInput, setPassInput] = useState('');
  const adminPassword = 'admin'; // Tady si nastav své heslo

  const t = {
    CZ: {
      tabs: ['odkazy', 'správa', 'admin', 'feedback'],
      addTitle: 'Nová Karta',
      listTitle: 'Aktuální karty',
      nameLabel: 'Název portálu',
      urlLabel: 'URL adresa',
      descLabel: 'Popis (nepovinné)',
      addBtn: 'PŘIDAT DO AURY +',
      emptyAdmin: 'Admin panel je uzamčen.',
      feedbackOffline: 'Feedback systém je offline.',
      defaultDesc: 'Uživatelský odkaz',
    },
    EN: {
      tabs: ['links', 'manage', 'admin', 'feedback'],
      addTitle: 'New Card',
      listTitle: 'Current Cards',
      nameLabel: 'Portal Name',
      urlLabel: 'URL Address',
      descLabel: 'Description (optional)',
      addBtn: 'ADD TO AURA +',
      emptyAdmin: 'Admin panel is locked.',
      feedbackOffline: 'Feedback system is offline.',
      defaultDesc: 'User link',
    },
  };

  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('aura-links');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            label: 'Google',
            url: 'https://google.com',
            desc: 'Vyhledávač',
            color: 'bg-emerald-500',
          },
          {
            id: 2,
            label: 'YouTube',
            url: 'https://youtube.com',
            desc: 'Video portál',
            color: 'bg-red-600',
          },
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
        color: 'bg-emerald-500', // Nové karty budou mít automaticky zelený proužek
      };
      setLinks([...links, newEntry]);
      setNewLabel('');
      setNewUrl('');
      setNewDesc('');
    }
  };

  const deleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode ? 'bg-[#0f1115] text-white' : 'bg-gray-50 text-gray-900'
      } p-6 font-sans text-xs`}
    >
      <header className="max-w-4xl mx-auto mb-6 relative flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 flex flex-col space-y-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition-all border ${
              darkMode
                ? 'bg-[#1a1d23] border-gray-800 shadow-none'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setLang(lang === 'CZ' ? 'EN' : 'CZ')}
            className={`p-2 rounded-xl transition-all border font-black text-[9px] ${
              darkMode
                ? 'bg-[#1a1d23] border-gray-800'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {lang === 'CZ' ? 'CZ' : 'EN'}
          </button>
        </div>

        <div className="mt-4 mb-2">
          <img
            src="/logo_nobg.png"
            alt="Aura Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-all"
          />
        </div>

        <p
          className={`${
            darkMode ? 'text-gray-600' : 'text-gray-400'
          } uppercase tracking-[0.25em] text-[8px] font-black italic`}
        >
          STREAMLINE YOUR WORKDAY WITH AURA
        </p>
      </header>

      <nav className="max-w-4xl mx-auto flex justify-center space-x-1.5 mb-8 text-[9px] font-black">
        {['links', 'manage', 'admin', 'feedback'].map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full transition-all ${
              activeTab === tab
                ? darkMode
                  ? 'bg-white text-black'
                  : 'bg-black text-white'
                : darkMode
                ? 'text-gray-500 hover:text-white'
                : 'text-gray-400 hover:text-black'
            }`}
          >
            {t[lang].tabs[index].toUpperCase()}
          </button>
        ))}
      </nav>

      <main className="max-w-4xl mx-auto flex justify-center">
        {activeTab === 'links' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={`${
                  darkMode
                    ? 'bg-[#1a1d23] border-gray-800 hover:bg-[#20242b]'
                    : 'bg-white border-gray-100 hover:bg-gray-50 shadow-sm'
                } p-1.5 px-4 rounded-lg transition-all flex items-center space-x-3 border`}
              >
                <div className={`w-1 h-5 ${link.color} rounded-full`}></div>
                <div className="text-left overflow-hidden">
                  <h3
                    className={`text-sm font-bold truncate ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {link.label}
                  </h3>
                  <p className="text-gray-500 text-[9px] leading-tight truncate">
                    {link.desc}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
            {/* ZELENÁ SEKCE: PŘIDÁNÍ */}
            <div
              className={`${
                darkMode
                  ? 'bg-[#1a1d23] border-gray-800'
                  : 'bg-white border-gray-100 shadow-lg'
              } flex-1 p-6 rounded-2xl border`}
            >
              <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-emerald-500">
                {t[lang].addTitle}
              </h2>
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase ml-1">
                    {t[lang].nameLabel}
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 mt-0.5 rounded-lg outline-none border focus:ring-1 focus:ring-emerald-500 ${
                      darkMode
                        ? 'bg-[#0f1115] border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase ml-1">
                    {t[lang].urlLabel}
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 mt-0.5 rounded-lg outline-none border focus:ring-1 focus:ring-emerald-500 ${
                      darkMode
                        ? 'bg-[#0f1115] border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[8px] font-black text-gray-500 uppercase ml-1">
                    {t[lang].descLabel}
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 mt-0.5 rounded-lg outline-none border focus:ring-1 focus:ring-emerald-500 ${
                      darkMode
                        ? 'bg-[#0f1115] border-gray-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-black'
                    }`}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
                <button
                  onClick={addLink}
                  className="w-full bg-emerald-600 text-white p-2 rounded-lg font-black hover:bg-emerald-700 transition-all mt-2 text-[9px] uppercase italic shadow-md shadow-emerald-900/20"
                >
                  {t[lang].addBtn}
                </button>
              </div>
            </div>

            {/* ORANŽOVÁ SEKCE: SEZNAM */}
            <div
              className={`${
                darkMode
                  ? 'bg-[#1a1d23] border-gray-800'
                  : 'bg-white border-gray-100 shadow-lg'
              } flex-1 p-6 rounded-2xl border`}
            >
              <h2 className="text-sm font-black mb-4 uppercase tracking-widest text-orange-500">
                {t[lang].listTitle}
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      darkMode
                        ? 'bg-[#0f1115] border-gray-800'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <span className="font-bold text-[10px] truncate max-w-[120px]">
                      {link.label}
                    </span>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="bg-orange-500/10 hover:bg-orange-500 text-orange-600 hover:text-white p-1 px-2 rounded-md transition-all text-[8px] font-black uppercase border border-orange-500/20 hover:border-orange-500"
                    >
                      DEL ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 animate-fade-in pb-12">
              
              {/* ... tvůj stávající kód (přidávání karet, seznam karet atd.) ... */}

              {/* --- TADY ZAČÍNÁ INDIKÁTOR VERZE --- */}
              <div className="pt-8 mt-12 border-t border-gray-800/50 flex flex-col items-center">
                <div className="flex items-center space-x-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-mono text-gray-500 tracking-tighter uppercase">
                    Build: Production
                  </span>
                  <span className="text-[10px] font-black text-emerald-500/70 ml-2">
                    v1.0
                  </span>
                </div>
                <p className="text-[8px] text-gray-600 mt-2 uppercase tracking-[0.2em] font-bold">
                  Aura OS • 2024
                </p>
              </div>
              {/* --- TADY KONČÍ INDIKÁTOR VERZE --- */}
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="w-full max-w-sm mx-auto animate-fade-in">
            {!isAdmin ? (
              /* LOCK SCREEN */
              <div
                className={`p-8 rounded-2xl border text-center transition-all ${
                  darkMode
                    ? 'bg-[#1a1d23] border-gray-800'
                    : 'bg-white border-gray-100 shadow-xl'
                }`}
              >
                <div className="mb-4 text-2xl">🔒</div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">
                  {lang === 'CZ' ? 'Zóna Adminů' : 'Admin Restricted'}
                </h2>

                <input
                  type="password"
                  placeholder="•••••"
                  className={`w-full p-3 rounded-xl outline-none border text-center transition-all focus:ring-1 focus:ring-emerald-500 mb-3 ${
                    darkMode
                      ? 'bg-[#0f1115] border-gray-700 text-white'
                      : 'bg-gray-50 border-gray-200 text-black'
                  }`}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && passInput === adminPassword)
                      setIsAdmin(true);
                  }}
                />

                <button
                  onClick={() => {
                    if (passInput === adminPassword) setIsAdmin(true);
                    else
                      alert(lang === 'CZ' ? 'Špatné heslo' : 'Wrong password');
                  }}
                  className="w-full bg-emerald-600 text-white p-3 rounded-xl font-black hover:bg-emerald-700 transition-all text-[9px] uppercase italic tracking-widest"
                >
                  {lang === 'CZ' ? 'VSTOUPIT' : 'ACCESS'}
                </button>
              </div>
            ) : (
              /* ODEMČENÝ OBSAH ADMIN TABU */
              <div className="animate-fade-in text-center">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500">
                    {lang === 'CZ' ? 'ADMIN KONZOLE' : 'ADMIN CONSOLE'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      setPassInput('');
                    }}
                    className="text-[8px] font-black text-orange-500 hover:underline uppercase"
                  >
                    {lang === 'CZ' ? 'Odhlásit' : 'Logout'}
                  </button>
                </div>

                {/* Tady bude tvůj budoucí Toolbox / Diagnostika */}
                <div
                  className={`p-12 rounded-2xl border-2 border-dashed ${
                    darkMode
                      ? 'border-gray-800 text-gray-700'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <p className="font-black italic uppercase tracking-tighter">
                    {lang === 'CZ'
                      ? 'Systém připraven k nasazení modulů...'
                      : 'System ready for module deployment...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'feedback' && (
          <div className="py-16 text-gray-500 italic text-[10px] tracking-wide uppercase font-black">
            {t[lang].feedbackOffline}
          </div>
        )}
      </main>
    </div>
  );
}
