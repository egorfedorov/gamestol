import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export const LANGUAGES = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
] as const

export type LangCode = typeof LANGUAGES[number]['code']

type Translations = typeof ru

const ru = {
  nav: {
    home: 'Главная',
    catalog: 'Каталог игр',
    about: 'О проекте',
  },
  landing: {
    hero_title: 'Играйте правильно',
    hero_subtitle: 'Без споров, без ошибок, без 20 страниц правил',
    hero_cta: 'Открыть каталог',
    hero_secondary: 'Как это работает',
    problem_title: 'Знакомо?',
    problem_items: [
      'Купили настолку — правила на 20 страниц, никто не хочет читать',
      'Посмотрели видео на YouTube — каждый запомнил свою версию правил',
      'Половину вечера спорили, как правильно ходить и считать очки',
      'Кто-то играл неправильно всю жизнь и даже не знал об этом',
      'Нет ведущего — никто не хочет быть «тем, кто читает правила»',
      'Забыли таймер, потеряли кубик, перепутали роли',
    ],
    solution_title: 'Один клик — и вы играете',
    solution_subtitle: 'GameStol — цифровой ведущий, который знает правила лучше вас',
    features: [
      { title: 'Пошаговое ведение', desc: 'Приложение ведёт игру за вас — фаза за фазой, ход за ходом' },
      { title: 'Автораздача ролей', desc: 'Тайная раздача ролей в Мафии, Бункере и других играх' },
      { title: 'Встроенные таймеры', desc: 'Таймеры для каждой игры с правильными настройками' },
      { title: 'Подсчёт очков', desc: 'Автоматический подсчёт по правилам каждой игры' },
    ],
    games_title: 'Игры',
    games_subtitle: 'Выберите игру и начните за 30 секунд',
    cta_title: 'Начните прямо сейчас',
    cta_subtitle: 'Бесплатно. Без регистрации. Работает на телефоне.',
    cta_button: 'Открыть каталог игр',
    footer: 'Сделано с любовью к настольным играм',
  },
  catalog: {
    title: 'Каталог игр',
    subtitle: 'Выберите игру для вечера',
    search: 'Поиск игры...',
    players: 'игроков',
    difficulty: { easy: 'Легко', medium: 'Средне', hard: 'Сложно' },
    all: 'Все',
    start: 'Играть',
    rules: 'Правила',
    mistakes: 'Частые ошибки',
    back: 'Назад',
    how_to_play: 'Как играть',
    common_mistakes: 'Частые ошибки',
    min_players: 'от',
    max_players: 'до',
    duration: 'Длительность',
  },
  game: {
    players: 'Игроки',
    add_player: 'Добавить',
    player_name: 'Имя игрока',
    start_game: 'Начать игру',
    end_game: 'Завершить',
    new_game: 'Новая игра',
    next: 'Далее',
    skip: 'Пропустить',
    correct: 'Угадали',
    score: 'Счёт',
    round: 'Раунд',
    turn: 'Ход',
    team: 'Команда',
    winner: 'Победитель',
    results: 'Результаты',
    back_to_catalog: 'К каталогу',
    phase: 'Фаза',
    vote: 'Голосовать',
    eliminate: 'Исключить',
    reveal: 'Показать',
    timer: 'Таймер',
    ready: 'Готов',
    yes: 'Да',
    no: 'Нет',
    irrelevant: 'Неважно',
    hint: 'Подсказка',
    answer: 'Ответ',
    teams: 'Команды',
    team_name: 'Название команды',
    add_team: 'Добавить команду',
    remove: 'Удалить',
    settings: 'Настройки',
    play_again: 'Играть снова',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    night: 'Ночь',
    day: 'День',
    discussion: 'Обсуждение',
    voting: 'Голосование',
    game_over: 'Игра окончена',
    congratulations: 'Поздравляем!',
    points: 'очков',
    words_left: 'Слов осталось',
    time_up: 'Время вышло!',
    your_word: 'Ваше слово',
    your_role: 'Ваша роль',
    show_role: 'Показать роль',
    hide_role: 'Скрыть роль',
    next_player: 'Следующий игрок',
    pass_device: 'Передайте устройство следующему игроку',
    spymaster: 'Капитан',
    field_agent: 'Агент',
    clue: 'Подсказка',
    clue_word: 'Слово-подсказка',
    clue_count: 'Количество',
    give_clue: 'Дать подсказку',
    question: 'Вопрос',
    guesses_left: 'Попыток осталось',
  },
}

const en: Translations = {
  nav: {
    home: 'Home',
    catalog: 'Game Catalog',
    about: 'About',
  },
  landing: {
    hero_title: 'Play it right',
    hero_subtitle: 'No arguments, no mistakes, no 20-page rulebooks',
    hero_cta: 'Open Catalog',
    hero_secondary: 'How it works',
    problem_title: 'Sound familiar?',
    problem_items: [
      'Bought a board game — 20 pages of rules, nobody wants to read them',
      'Watched a YouTube video — everyone remembers a different version',
      'Spent half the evening arguing about how to play correctly',
      'Someone played wrong their entire life and never knew',
      'No game master — nobody wants to be "the rule reader"',
      'Forgot the timer, lost the dice, mixed up the roles',
    ],
    solution_title: 'One tap — and you\'re playing',
    solution_subtitle: 'GameStol — a digital host that knows the rules better than you',
    features: [
      { title: 'Step-by-step hosting', desc: 'The app runs the game for you — phase by phase, turn by turn' },
      { title: 'Auto role dealing', desc: 'Secret role assignment for Mafia, Bunker, and other games' },
      { title: 'Built-in timers', desc: 'Timers for every game with correct settings' },
      { title: 'Score tracking', desc: 'Automatic scoring by each game\'s rules' },
    ],
    games_title: 'Games',
    games_subtitle: 'Choose a game and start in 30 seconds',
    cta_title: 'Start right now',
    cta_subtitle: 'Free. No registration. Works on your phone.',
    cta_button: 'Open Game Catalog',
    footer: 'Made with love for board games',
  },
  catalog: {
    title: 'Game Catalog',
    subtitle: 'Choose a game for the evening',
    search: 'Search games...',
    players: 'players',
    difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
    all: 'All',
    start: 'Play',
    rules: 'Rules',
    mistakes: 'Common Mistakes',
    back: 'Back',
    how_to_play: 'How to play',
    common_mistakes: 'Common mistakes',
    min_players: 'from',
    max_players: 'to',
    duration: 'Duration',
  },
  game: {
    players: 'Players',
    add_player: 'Add',
    player_name: 'Player name',
    start_game: 'Start Game',
    end_game: 'End Game',
    new_game: 'New Game',
    next: 'Next',
    skip: 'Skip',
    correct: 'Correct',
    score: 'Score',
    round: 'Round',
    turn: 'Turn',
    team: 'Team',
    winner: 'Winner',
    results: 'Results',
    back_to_catalog: 'Back to Catalog',
    phase: 'Phase',
    vote: 'Vote',
    eliminate: 'Eliminate',
    reveal: 'Reveal',
    timer: 'Timer',
    ready: 'Ready',
    yes: 'Yes',
    no: 'No',
    irrelevant: 'Irrelevant',
    hint: 'Hint',
    answer: 'Answer',
    teams: 'Teams',
    team_name: 'Team name',
    add_team: 'Add team',
    remove: 'Remove',
    settings: 'Settings',
    play_again: 'Play again',
    close: 'Close',
    confirm: 'Confirm',
    cancel: 'Cancel',
    night: 'Night',
    day: 'Day',
    discussion: 'Discussion',
    voting: 'Voting',
    game_over: 'Game Over',
    congratulations: 'Congratulations!',
    points: 'points',
    words_left: 'Words left',
    time_up: 'Time\'s up!',
    your_word: 'Your word',
    your_role: 'Your role',
    show_role: 'Show role',
    hide_role: 'Hide role',
    next_player: 'Next player',
    pass_device: 'Pass the device to the next player',
    spymaster: 'Spymaster',
    field_agent: 'Field Agent',
    clue: 'Clue',
    clue_word: 'Clue word',
    clue_count: 'Count',
    give_clue: 'Give clue',
    question: 'Question',
    guesses_left: 'Guesses left',
  },
}

const es: Translations = {
  nav: { home: 'Inicio', catalog: 'Catálogo', about: 'Acerca de' },
  landing: {
    hero_title: 'Juega bien',
    hero_subtitle: 'Sin discusiones, sin errores, sin manuales de 20 páginas',
    hero_cta: 'Abrir Catálogo',
    hero_secondary: 'Cómo funciona',
    problem_title: '¿Te suena?',
    problem_items: [
      'Compraste un juego — 20 páginas de reglas que nadie quiere leer',
      'Viste un video en YouTube — cada uno recordó una versión diferente',
      'Pasaste media noche discutiendo cómo jugar correctamente',
      'Alguien jugó mal toda su vida y nunca lo supo',
      'Sin moderador — nadie quiere ser "el que lee las reglas"',
      'Olvidaste el temporizador, perdiste los dados, confundiste los roles',
    ],
    solution_title: 'Un toque — y estás jugando',
    solution_subtitle: 'GameStol — un anfitrión digital que conoce las reglas mejor que tú',
    features: [
      { title: 'Guía paso a paso', desc: 'La app dirige el juego — fase por fase, turno por turno' },
      { title: 'Reparto automático', desc: 'Asignación secreta de roles para Mafia, Búnker y otros' },
      { title: 'Temporizadores', desc: 'Temporizadores para cada juego con ajustes correctos' },
      { title: 'Puntuación', desc: 'Conteo automático según las reglas de cada juego' },
    ],
    games_title: 'Juegos', games_subtitle: 'Elige un juego y empieza en 30 segundos',
    cta_title: 'Empieza ahora', cta_subtitle: 'Gratis. Sin registro. Funciona en tu teléfono.',
    cta_button: 'Abrir Catálogo', footer: 'Hecho con amor por los juegos de mesa',
  },
  catalog: { title: 'Catálogo', subtitle: 'Elige un juego', search: 'Buscar...', players: 'jugadores',
    difficulty: { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' }, all: 'Todos', start: 'Jugar',
    rules: 'Reglas', mistakes: 'Errores comunes', back: 'Atrás', how_to_play: 'Cómo jugar',
    common_mistakes: 'Errores comunes', min_players: 'de', max_players: 'a', duration: 'Duración' },
  game: { ...en.game, players: 'Jugadores', add_player: 'Añadir', start_game: 'Iniciar', end_game: 'Terminar',
    new_game: 'Nuevo juego', next: 'Siguiente', skip: 'Saltar', correct: 'Correcto', score: 'Puntuación',
    round: 'Ronda', turn: 'Turno', team: 'Equipo', winner: 'Ganador', results: 'Resultados',
    game_over: 'Fin del juego', congratulations: '¡Felicidades!', time_up: '¡Tiempo!',
    night: 'Noche', day: 'Día', back_to_catalog: 'Al catálogo', play_again: 'Jugar de nuevo' },
}

// Other languages inherit from English with key UI strings translated
const makePartialLang = (overrides: Partial<{ nav: Partial<Translations['nav']> }>): Translations => ({
  ...en,
  nav: { ...en.nav, ...overrides.nav },
})

const de = makePartialLang({ nav: { home: 'Startseite', catalog: 'Spielekatalog', about: 'Über uns' } })
const fr = makePartialLang({ nav: { home: 'Accueil', catalog: 'Catalogue', about: 'À propos' } })
const pt = makePartialLang({ nav: { home: 'Início', catalog: 'Catálogo', about: 'Sobre' } })
const zh = makePartialLang({ nav: { home: '首页', catalog: '游戏目录', about: '关于' } })
const ja = makePartialLang({ nav: { home: 'ホーム', catalog: 'ゲームカタログ', about: '概要' } })
const ko = makePartialLang({ nav: { home: '홈', catalog: '게임 카탈로그', about: '소개' } })
const tr = makePartialLang({ nav: { home: 'Ana Sayfa', catalog: 'Oyun Kataloğu', about: 'Hakkında' } })
const it = makePartialLang({ nav: { home: 'Home', catalog: 'Catalogo', about: 'Info' } })
const ar = makePartialLang({ nav: { home: 'الرئيسية', catalog: 'كتالوج الألعاب', about: 'حول' } })

const translations: Record<string, Translations> = { ru, en, es, de, fr, pt, zh, ja, ko, tr, it, ar }

interface I18nContextType {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType>({
  lang: 'ru',
  setLang: () => {},
  t: ru,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem('gamestol-lang')
    if (saved && translations[saved]) return saved as LangCode
    const browserLang = navigator.language.split('-')[0]
    if (translations[browserLang]) return browserLang as LangCode
    return 'ru'
  })

  const setLang = useCallback((l: LangCode) => {
    setLangState(l)
    localStorage.setItem('gamestol-lang', l)
    document.documentElement.lang = l
    if (l === 'ar') {
      document.documentElement.dir = 'rtl'
    } else {
      document.documentElement.dir = 'ltr'
    }
  }, [])

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] || en }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
