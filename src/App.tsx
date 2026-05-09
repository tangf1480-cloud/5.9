import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Solar, Lunar } from 'lunar-javascript';
import { Sparkles, Moon, Sun, CalendarDays, Compass, ArrowUp, Star, Flame, Droplet, Mountain, Wind } from 'lucide-react';
import { XIU_DETAILS } from './data/xiuDetails';
import { getDailyHoroscope } from './data/horoscope';

const FOUR_SYMBOLS: Record<string, { group: string, color: string, animalTitle: string, bg: string }> = {
  '角': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '木蛟' },
  '亢': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '金龙' },
  '氐': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '土貉' },
  '房': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '日兔' },
  '心': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '月狐' },
  '尾': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '火虎' },
  '箕': { group: '东方青龙', color: 'text-emerald-400', bg: 'bg-emerald-950/30', animalTitle: '水豹' },

  '斗': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '木獬' },
  '牛': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '金牛' },
  '女': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '土蝠' },
  '虚': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '日鼠' },
  '危': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '月燕' },
  '室': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '火猪' },
  '壁': { group: '北方玄武', color: 'text-blue-400', bg: 'bg-blue-950/30', animalTitle: '水獝' },

  '奎': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '木狼' },
  '娄': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '金狗' },
  '胃': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '土雉' },
  '昴': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '日鸡' },
  '毕': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '月乌' },
  '觜': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '火猴' },
  '参': { group: '西方白虎', color: 'text-zinc-300', bg: 'bg-zinc-800/30', animalTitle: '水猿' },

  '井': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '木犴' },
  '鬼': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '金羊' },
  '柳': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '土獐' },
  '星': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '日马' },
  '张': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '月鹿' },
  '翼': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '火蛇' },
  '轸': { group: '南方朱雀', color: 'text-rose-400', bg: 'bg-rose-950/30', animalTitle: '水蚓' },
};

const ZODIAC_ELEMENTS: Record<string, { element: string, color: string, bg: string, getIcon: () => React.ReactNode }> = {
  '白羊': { element: '火象星座', color: 'text-orange-500', bg: 'bg-orange-950/30', getIcon: () => <Sparkles className="w-6 h-6 text-orange-500" /> },
  '狮子': { element: '火象星座', color: 'text-orange-500', bg: 'bg-orange-950/30', getIcon: () => <Sun className="w-6 h-6 text-orange-500" /> },
  '射手': { element: '火象星座', color: 'text-orange-500', bg: 'bg-orange-950/30', getIcon: () => <Compass className="w-6 h-6 text-orange-500" /> },
  
  '金牛': { element: '土象星座', color: 'text-amber-600', bg: 'bg-amber-950/30', getIcon: () => <Moon className="w-6 h-6 text-amber-600" /> },
  '处女': { element: '土象星座', color: 'text-amber-600', bg: 'bg-amber-950/30', getIcon: () => <Sparkles className="w-6 h-6 text-amber-600" /> },
  '摩羯': { element: '土象星座', color: 'text-amber-600', bg: 'bg-amber-950/30', getIcon: () => <Compass className="w-6 h-6 text-amber-600" /> },
  
  '双子': { element: '风象星座', color: 'text-teal-400', bg: 'bg-teal-950/30', getIcon: () => <Sparkles className="w-6 h-6 text-teal-400" /> },
  '天秤': { element: '风象星座', color: 'text-teal-400', bg: 'bg-teal-950/30', getIcon: () => <Sun className="w-6 h-6 text-teal-400" /> },
  '水瓶': { element: '风象星座', color: 'text-teal-400', bg: 'bg-teal-950/30', getIcon: () => <Moon className="w-6 h-6 text-teal-400" /> },
  
  '巨蟹': { element: '水象星座', color: 'text-blue-500', bg: 'bg-blue-950/30', getIcon: () => <Moon className="w-6 h-6 text-blue-500" /> },
  '天蝎': { element: '水象星座', color: 'text-blue-500', bg: 'bg-blue-950/30', getIcon: () => <Sparkles className="w-6 h-6 text-blue-500" /> },
  '双鱼': { element: '水象星座', color: 'text-blue-500', bg: 'bg-blue-950/30', getIcon: () => <Compass className="w-6 h-6 text-blue-500" /> },
};

export default function App() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [searchedDate, setSearchedDate] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const [webViewVer, setWebViewVer] = useState<number | null>(null);

  const checkWebViewVersion = () => {
    const userAgent = navigator.userAgent;
    const chromeMatch = userAgent.match(/Chrome\/([\d.]+)/);
    if (chromeMatch && chromeMatch[1]) {
      const version = parseInt(chromeMatch[1].split('.')[0], 10);
      setWebViewVer(version);
      if (version < 70) {
        console.log(
          '%c当前 WebView 版本过低，可能导致显示异常，请升级 Android System WebView',
          'color: red; font-size: 14px; font-weight: bold;'
        );
      } else {
        console.log(
          '%cWebView 版本正常',
          'color: green; font-size: 14px; font-weight: bold;'
        );
      }
    } else {
      console.log('Not running in a Chrome-based WebView or browser.');
    }
  };

  useEffect(() => {
    checkWebViewVersion();
  }, []);

  const result = useMemo(() => {
    if (!searchedDate) return null;
    try {
      const [year, month, day] = searchedDate.split('-').map(Number);
      if (!year || !month || !day) return null;
      
      const solar = Solar.fromYmd(year, month, day);
      const lunar = solar.getLunar();
      
      const xingZuo = solar.getXingZuo();
      const xiu = lunar.getXiu();
      const symbolInfo = FOUR_SYMBOLS[xiu] || { group: '未知', color: 'text-gray-400', bg: 'bg-gray-800/30', animalTitle: '' };
      const zodiacInfo = ZODIAC_ELEMENTS[xingZuo] || { element: '未知', color: 'text-purple-400', bg: 'bg-purple-900/30', getIcon: () => <Star className="w-6 h-6 text-purple-400" /> };
      
      const shengXiao = lunar.getYearShengXiao();
      const lunarDateStr = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
      const yearZhi = lunar.getYearZhi();
      
      const dailyHoroscope = getDailyHoroscope(xingZuo);
      
      const todayLunar = Lunar.fromDate(new Date());
      const todayYi = todayLunar.getDayYi();
      const todayJi = todayLunar.getDayJi();
      
      return {
        solarDate: `${year}年${month}月${day}日`,
        lunarDateStr,
        lunarDetails: {
          ganZhiYear: lunar.getYearInGanZhi() + '年',
          month: lunar.getMonthInChinese() + '月',
          day: lunar.getDayInChinese()
        },
        todayFortune: {
          yi: todayYi,
          ji: todayJi
        },
        modern: {
          sign: xingZuo,
          element: zodiacInfo.element,
          color: zodiacInfo.color,
          bg: zodiacInfo.bg,
          icon: zodiacInfo.getIcon(),
          horoscope: dailyHoroscope
        },
        ancient: {
          xiu,
          fullTitle: `${xiu}${symbolInfo.animalTitle}`,
          group: symbolInfo.group,
          color: symbolInfo.color,
          bg: symbolInfo.bg,
          details: XIU_DETAILS[xiu] || {
            traits: '暂无详细记载。',
            myth: '暂无详细记载。',
            symbol: '暂无详细记载。'
          }
        },
        shengXiao: {
          animal: shengXiao,
          zhi: yearZhi
        }
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [searchedDate]);

  return (
    <div dir="ltr" className="min-h-[100dvh] bg-[#050510] text-white font-sans overflow-x-hidden flex flex-col items-center relative p-4 py-12 md:py-20 sm:p-12" style={{ direction: 'ltr' }}>
      {/* Mesh Gradient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        
        {/* Twinkling Stars Background */}
        <div className="absolute inset-0 z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                opacity: [Math.random() * 0.5 + 0.1, Math.random() * 0.8 + 0.4, Math.random() * 0.5 + 0.1],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}

          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-800/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.05, 1], x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full flex flex-col items-center justify-center gap-10 mt-[10vh] md:mt-[15vh] pb-20"
            >
              {/* Header Section */}
              <div className="text-center space-y-4 md:space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight font-light whitespace-nowrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-400">Celestial Oracle</span>
                </h1>
                <p className="text-indigo-200/60 text-sm sm:text-lg md:text-xl max-w-lg mx-auto font-light tracking-wide px-4">
                  输入你的出生日期，揭开现代西方星座与古代二十八星宿的神秘面纱。
                </p>
              </div>

              {/* Search / Input Section */}
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-full p-1.5 sm:p-2 flex items-center shadow-2xl mx-auto w-full max-w-2xl transition-all hover:bg-white/10 hover:border-white/20 hover:shadow-indigo-500/10 hover:shadow-2xl">
                <div className="flex-1 px-4 sm:px-8 flex items-center gap-2 sm:gap-4">
                  <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-indigo-400/80 font-bold whitespace-nowrap">Birth Date</span>
                  <input
                    type={birthDate ? "date" : "text"}
                    onFocus={(e) => (e.target.type = 'date')}
                    onBlur={(e) => !birthDate && (e.target.type = 'text')}
                    id="birthdate"
                    value={birthDate}
                    placeholder="YYYY-MM-DD"
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="bg-transparent border-none outline-none text-base sm:text-lg md:text-xl w-full text-white cursor-pointer font-light tracking-wide focus:ring-0 placeholder:text-white/30 transition-colors"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSearchedDate(birthDate)}
                  disabled={!birthDate}
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 sm:px-12 py-3 sm:py-4 rounded-full font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed opacity-90 backdrop-blur-md shadow-indigo-900/50 cursor-pointer whitespace-nowrap text-base sm:text-lg"
                >
                  开始探索
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.7, staggerChildren: 0.1, ease: "easeOut" }}
              className="w-full flex flex-col gap-8 pb-12"
            >
              {/* Header inside results to anchor "Drill Down" state */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-center justify-between w-full gap-4 mb-4 border-b border-white/5 pb-6 px-4 md:px-0"
              >
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <h2 className="text-2xl font-serif text-white tracking-wide">星象解析档案</h2>
                  <p className="text-slate-400/80 text-sm font-light mt-1">
                    公历：{result.solarDate} <span className="mx-2 opacity-30">|</span> 农历：{result.lunarDateStr}
                  </p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchedDate('')}
                  className="flex items-center gap-2 text-indigo-300 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase bg-white/5 py-2 px-5 rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md cursor-pointer"
                >
                  <span className="text-lg leading-none transform -translate-y-px">←</span> 返回重测
                </motion.button>
              </motion.div>

              <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 px-2 md:px-0">
                {/* Modern Zodiac Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-colors duration-500 border border-white/10 hover:border-white/20 rounded-[30px] md:rounded-[40px] p-6 lg:p-8 flex flex-col items-center text-center space-y-5 md:space-y-6 shadow-xl relative overflow-hidden group h-full"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-700 transform group-hover:scale-110">
                     <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-[10px] uppercase tracking-widest text-indigo-300">现代西方星座</span>
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] text-white group-hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] group-hover:scale-105 transition-all duration-500 shrink-0 relative">
                    <motion.div 
                      animate={{ scale: [1, 1.15, 1], y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                      className="scale-150 group-hover:scale-[1.8] group-hover:rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-500 flex items-center justify-center drop-shadow-md z-10"
                    >
                      {result.modern.icon}
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif mb-1 tracking-wide">{result.modern.sign}座</h2>
                    <p className="text-indigo-300/80 font-medium italic text-sm">Modern Western</p>
                  </div>
                  <div className="flex flex-col gap-4 w-full z-10 max-w-sm mx-auto flex-1 mt-2">
                    <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
                      <p className="text-slate-400 mb-1.5 uppercase tracking-widest text-[10px]">星象</p>
                      <p className="font-medium text-slate-200">{result.modern.element}</p>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-md border border-indigo-500/20 hover:bg-white/10 transition-colors text-left flex flex-col items-start shadow-[inset_0_0_20px_rgba(79,70,229,0.05)] flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {result.modern.element.includes('火') ? <Flame className="w-4 h-4 text-orange-400" /> :
                         result.modern.element.includes('水') ? <Droplet className="w-4 h-4 text-blue-400" /> :
                         result.modern.element.includes('土') ? <Mountain className="w-4 h-4 text-amber-400" /> :
                         result.modern.element.includes('风') ? <Wind className="w-4 h-4 text-teal-400" /> :
                         <Sparkles className="w-4 h-4 text-indigo-400" />}
                        <p className="text-indigo-300 uppercase tracking-widest text-[10px] font-semibold">
                          今日星运 ({new Date().getMonth() + 1}月{new Date().getDate()}日)
                        </p>
                      </div>
                      <p className="text-slate-300/90 text-xs sm:text-[13px] leading-relaxed font-light">{result.modern.horoscope}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Ancient Xiu Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-colors duration-500 border border-white/10 hover:border-white/20 rounded-[30px] md:rounded-[40px] p-6 lg:p-8 flex flex-col items-center text-center space-y-5 md:space-y-6 shadow-xl relative overflow-hidden group h-full"
                >
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-700 transform group-hover:scale-110">
                     <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 3l1.912 5.886h6.19l-5.007 3.638 1.912 5.886-5.007-3.638-5.007 3.638 1.912-5.886-5.007-3.638h6.19z"/></svg>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-[10px] uppercase tracking-widest text-amber-300">古代二十八宿</span>
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500/80 to-orange-600/80 rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] group-hover:scale-105 transition-all duration-500 shrink-0 relative">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], y: [0, -4, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="group-hover:scale-[1.2] group-hover:-rotate-12 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-500 flex items-center justify-center drop-shadow-md z-10"
                    >
                      <Moon className="w-10 h-10 text-white drop-shadow-md" />
                    </motion.div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif mb-1 tracking-wide">{result.ancient.xiu}宿</h2>
                    <p className="text-amber-300/80 font-medium italic text-sm">Ancient Chinese</p>
                  </div>
                  <div className="flex flex-col gap-4 w-full z-10 max-w-sm mx-auto flex-1 mt-2">
                  <div className="flex flex-row flex-wrap sm:flex-nowrap gap-4 w-full text-xs">
                      <div className="flex-1 min-w-[45%] bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-slate-400 mb-1.5 uppercase tracking-widest text-[10px]">方位</p>
                        <p className="font-medium text-slate-200">{result.ancient.group}</p>
                      </div>
                      <div className="flex-1 min-w-[45%] bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-colors">
                        <p className="text-slate-400 mb-1.5 uppercase tracking-widest text-[10px]">神兽</p>
                        <p className="font-medium text-slate-200">{result.ancient.fullTitle.slice(1)}</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-5 backdrop-blur-md border border-amber-500/20 hover:bg-white/10 transition-colors text-left flex flex-col items-start shadow-[inset_0_0_20px_rgba(245,158,11,0.05)] flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Moon className="w-4 h-4 text-amber-400" />
                        <p className="text-amber-300 uppercase tracking-widest text-[10px] font-semibold">
                          星宿短语
                        </p>
                      </div>
                      <p className="text-slate-300/90 text-xs sm:text-[13px] leading-relaxed font-light">{result.ancient.details.traits.split('。')[0]}。</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Lunar Calendar & ShengXiao Card (Spans full width for balance) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-colors duration-500 border border-white/10 hover:border-white/20 rounded-[40px] px-4 sm:px-8 py-12 lg:py-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden w-full max-w-4xl mx-auto group"
              >
                <div className="absolute bottom-0 left-0 p-2 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12 pointer-events-none">
                   <Sun className="w-48 h-48" />
                </div>
                <span className="absolute top-4 lg:top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-[10px] uppercase tracking-widest text-emerald-300/90 whitespace-nowrap z-10">传统农历与生肖</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 lg:gap-y-12 w-full z-10 mt-8">
                  <div className="flex flex-col items-center relative group/ganzhi w-full cursor-help">
                    <h3 className="text-[10px] font-medium text-slate-400 mb-2 tracking-widest uppercase border-b border-dashed border-slate-500 pb-0.5">干支历年</h3>
                    <p className="text-3xl lg:text-4xl font-serif text-white/90 drop-shadow-sm whitespace-nowrap">{result.lunarDetails.ganZhiYear}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 sm:w-60 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-3 sm:p-4 text-left text-xs text-slate-300 opacity-0 invisible group-hover/ganzhi:opacity-100 group-hover/ganzhi:visible transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-y-2 group-hover/ganzhi:translate-y-0">
                      <p><strong className="text-emerald-400 mb-1 block text-sm">干支 (Gan Zhi)</strong>The ancient Chinese Sexagenary cycle. It combines 10 Heavenly Stems and 12 Earthly Branches to track time, reflecting the cosmos's endless rhythm.</p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-emerald-500/20 rotate-45"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center relative group/shengxiao w-full cursor-help">
                    <h3 className="text-[10px] font-medium text-slate-400 mb-2 tracking-widest uppercase border-b border-dashed border-slate-500 pb-0.5">生肖</h3>
                    <p className="text-3xl lg:text-4xl font-serif text-white/90 drop-shadow-sm whitespace-nowrap">{result.shengXiao.animal}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-40 sm:w-60 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-3 sm:p-4 text-left text-xs text-slate-300 opacity-0 invisible group-hover/shengxiao:opacity-100 group-hover/shengxiao:visible transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-y-2 group-hover/shengxiao:translate-y-0">
                      <p><strong className="text-emerald-400 mb-1 block text-sm">生肖 (Chinese Zodiac)</strong>The 12 animal signs assigned to each year in a repeating 12-year cycle, representing attributes and fortunes in astrology.</p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-emerald-500/20 rotate-45"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center relative group/lunar w-full cursor-help">
                    <h3 className="text-[10px] font-medium text-slate-400 mb-2 tracking-widest uppercase border-b border-dashed border-slate-500 pb-0.5">农历月日</h3>
                    <p className="text-3xl lg:text-4xl font-serif text-white/90 drop-shadow-sm whitespace-nowrap">{result.lunarDetails.month}{result.lunarDetails.day}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-44 sm:w-60 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-3 sm:p-4 text-left text-xs text-slate-300 opacity-0 invisible group-hover/lunar:opacity-100 group-hover/lunar:visible transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-y-2 group-hover/lunar:translate-y-0">
                      <p><strong className="text-emerald-400 mb-1 block text-sm">农历 (Lunar Calendar)</strong>A traditional lunisolar calendar that indicates both the moon phase and the time of the solar year, historically vital for agriculture.</p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-emerald-500/20 rotate-45"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center relative group/taisui w-full cursor-help">
                    <h3 className="text-[10px] font-medium text-slate-400 mb-2 tracking-widest uppercase border-b border-dashed border-slate-500 pb-0.5">太岁地支</h3>
                    <p className="text-3xl lg:text-4xl font-serif text-white/90 drop-shadow-sm whitespace-nowrap">{result.shengXiao.zhi}</p>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-44 sm:w-60 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-3 sm:p-4 text-left text-xs text-slate-300 opacity-0 invisible group-hover/taisui:opacity-100 group-hover/taisui:visible transition-all duration-300 pointer-events-none z-50 shadow-2xl translate-y-2 group-hover/taisui:translate-y-0">
                      <p><strong className="text-emerald-400 mb-1 block text-sm">地支 (Earthly Branch)</strong>One of the 12 terms used to reckon time. It corresponds to the 12 zodiac animals and was believed to align with the orbit of Jupiter (Tai Sui).</p>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-emerald-500/20 rotate-45"></div>
                    </div>
                  </div>
                </div>

                {/* Today's Fortune (Lunar Almanac) */}
                <div className="w-full mt-10 pt-8 border-t border-white/5 relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-8 bg-gradient-to-l from-emerald-400/50 to-transparent"></div>
                    <p className="text-emerald-300 uppercase tracking-widest text-xs font-semibold">
                      今日黄历运势 ({new Date().getMonth() + 1}月{new Date().getDate()}日)
                    </p>
                    <div className="h-px w-8 bg-gradient-to-r from-emerald-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-emerald-950/20 rounded-2xl p-5 border border-emerald-500/20 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                        <span className="text-emerald-400 font-bold text-sm">宜</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed text-center">
                        {result.todayFortune.yi.length > 0 ? result.todayFortune.yi.slice(0, 8).join(' · ') : '诸事不宜'}
                      </p>
                    </div>
                    
                    <div className="bg-rose-950/20 rounded-2xl p-5 border border-rose-500/20 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
                        <span className="text-rose-400 font-bold text-sm">忌</span>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed text-center">
                        {result.todayFortune.ji.length > 0 ? result.todayFortune.ji.slice(0, 8).join(' · ') : '无所忌讳'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Ancient Interpretation Detailed Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-xl bg-white/5 hover:bg-white/10 transition-colors duration-500 border border-white/10 hover:border-white/20 rounded-[30px] md:rounded-[40px] p-6 sm:p-8 flex flex-col text-left space-y-6 sm:space-y-8 shadow-xl relative overflow-hidden w-full max-w-5xl mx-auto mt-4 group"
              >
                <div className="absolute top-24 right-5 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity pointer-events-none duration-1000">
                   <Moon className="w-64 h-64" />
                </div>
                <div className="z-10 w-full relative">
                  <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="h-px w-12 bg-gradient-to-l from-amber-400/50 to-transparent"></div>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="w-4 h-4 text-amber-400/70" />
                    </motion.div>
                    <h3 className="text-2xl font-serif text-amber-100/90 tracking-widest px-2">
                      星宿秘语录
                    </h3>
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <Sparkles className="w-4 h-4 text-amber-400/70" />
                    </motion.div>
                    <div className="h-px w-12 bg-gradient-to-r from-amber-400/50 to-transparent"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-3xl p-7 border border-white/5 backdrop-blur-md flex flex-col h-full">
                      <h4 className="text-xs uppercase tracking-widest text-amber-300/80 mb-5 font-semibold flex items-center gap-3 shrink-0">
                        <motion.span 
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        ></motion.span>
                        性格特质
                      </h4>
                      <p className="text-slate-300/90 text-sm leading-relaxed font-light flex-1">{result.ancient.details.traits}</p>
                    </div>
                    
                    <div className="bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-3xl p-7 border border-white/5 backdrop-blur-md flex flex-col h-full">
                      <h4 className="text-xs uppercase tracking-widest text-amber-300/80 mb-5 font-semibold flex items-center gap-3 shrink-0">
                        <motion.span 
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                          className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        ></motion.span>
                        神话典故
                      </h4>
                      <p className="text-slate-300/90 text-sm leading-relaxed font-light flex-1">{result.ancient.details.myth}</p>
                    </div>

                    <div className="bg-white/5 hover:bg-white/10 transition-colors duration-300 rounded-3xl p-7 border border-white/5 backdrop-blur-md md:col-span-2 flex flex-col h-full">
                      <h4 className="text-xs uppercase tracking-widest text-amber-300/80 mb-5 font-semibold flex items-center gap-3 shrink-0">
                        <motion.span 
                          animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.2, 0.8] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                          className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                        ></motion.span>
                        象征意义
                      </h4>
                      <p className="text-slate-300/90 text-sm leading-relaxed font-light flex-1">{result.ancient.details.symbol}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-indigo-600/80 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] backdrop-blur-md z-[100] transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {webViewVer !== null && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-2xl text-xs pointer-events-none transition-all">
          <p className="text-white/60 mb-1">WebView Chrome 内核版本:</p>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${webViewVer >= 70 ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`}></span>
            <span className={`font-bold ${webViewVer >= 70 ? 'text-green-300' : 'text-red-400'}`}>v{webViewVer}</span>
          </div>
          {webViewVer < 70 && <p className="text-red-400/80 mt-1 max-w-[150px]">版本过低，请升级 System WebView</p>}
        </div>
      )}

      {/* Decorative Borders */}
      <div className="fixed inset-0 border-[20px] border-white/[0.02] pointer-events-none rounded-sm z-50 hidden md:block mix-blend-overlay"></div>
    </div>
  );
}

