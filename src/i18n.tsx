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

const makeLang = (o: { nav: Translations['nav']; landing: Translations['landing']; catalog: Partial<Translations['catalog']>; game: Partial<Translations['game']> }): Translations => ({
  nav: o.nav,
  landing: o.landing,
  catalog: { ...en.catalog, ...o.catalog },
  game: { ...en.game, ...o.game },
})

const de: Translations = makeLang({
  nav: { home: 'Startseite', catalog: 'Spielekatalog', about: 'Über uns' },
  landing: {
    hero_title: 'Spielt richtig', hero_subtitle: 'Kein Streit, keine Fehler, keine 20-seitigen Regelbücher',
    hero_cta: 'Katalog öffnen', hero_secondary: 'So funktioniert es',
    problem_title: 'Kommt euch das bekannt vor?',
    problem_items: ['Ein Brettspiel gekauft — 20 Seiten Regeln, niemand will sie lesen', 'YouTube-Video angesehen — jeder erinnert sich anders', 'Den halben Abend über die Regeln gestritten', 'Jemand hat sein ganzes Leben falsch gespielt', 'Kein Spielleiter — niemand will die Regeln vorlesen', 'Timer vergessen, Würfel verloren, Rollen vertauscht'],
    solution_title: 'Ein Tipp — und ihr spielt', solution_subtitle: 'GameStol — ein digitaler Spielleiter, der die Regeln besser kennt als ihr',
    features: [
      { title: 'Schritt-für-Schritt-Anleitung', desc: 'Die App führt durch das Spiel — Phase für Phase' },
      { title: 'Automatische Rollenvergabe', desc: 'Geheime Rollenvergabe für Mafia, Bunker und mehr' },
      { title: 'Eingebaute Timer', desc: 'Timer für jedes Spiel mit den richtigen Einstellungen' },
      { title: 'Punktezählung', desc: 'Automatische Punktezählung nach den Regeln jedes Spiels' },
    ],
    games_title: 'Spiele', games_subtitle: 'Wählt ein Spiel und startet in 30 Sekunden',
    cta_title: 'Jetzt starten', cta_subtitle: 'Kostenlos. Ohne Registrierung. Funktioniert auf dem Handy.',
    cta_button: 'Spielekatalog öffnen', footer: 'Mit Liebe zu Brettspielen gemacht',
  },
  catalog: { title: 'Spielekatalog', subtitle: 'Wählt ein Spiel für den Abend', search: 'Spiel suchen...', players: 'Spieler',
    difficulty: { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' }, all: 'Alle', start: 'Spielen',
    how_to_play: 'Spielanleitung', common_mistakes: 'Häufige Fehler', back: 'Zurück', duration: 'Dauer' },
  game: { players: 'Spieler', start_game: 'Spiel starten', end_game: 'Beenden', next: 'Weiter', skip: 'Überspringen',
    correct: 'Richtig', score: 'Punkte', round: 'Runde', team: 'Team', winner: 'Gewinner', results: 'Ergebnisse',
    game_over: 'Spiel vorbei', congratulations: 'Herzlichen Glückwunsch!', time_up: 'Zeit abgelaufen!',
    play_again: 'Nochmal spielen', back_to_catalog: 'Zum Katalog', vote: 'Abstimmen', eliminate: 'Ausschließen',
    yes: 'Ja', no: 'Nein', irrelevant: 'Egal', hint: 'Hinweis', answer: 'Antwort' },
})

const fr: Translations = makeLang({
  nav: { home: 'Accueil', catalog: 'Catalogue', about: 'À propos' },
  landing: {
    hero_title: 'Jouez correctement', hero_subtitle: 'Sans disputes, sans erreurs, sans manuels de 20 pages',
    hero_cta: 'Ouvrir le catalogue', hero_secondary: 'Comment ça marche',
    problem_title: 'Ça vous dit quelque chose ?',
    problem_items: ['Acheté un jeu — 20 pages de règles, personne ne veut les lire', 'Regardé une vidéo YouTube — chacun se souvient différemment', 'Passé la moitié de la soirée à discuter des règles', 'Quelqu\'un a mal joué toute sa vie sans le savoir', 'Pas de maître du jeu — personne ne veut lire les règles', 'Oublié le minuteur, perdu les dés, confondu les rôles'],
    solution_title: 'Un clic — et vous jouez', solution_subtitle: 'GameStol — un animateur numérique qui connaît les règles mieux que vous',
    features: [
      { title: 'Guide étape par étape', desc: 'L\'app guide le jeu — phase par phase' },
      { title: 'Distribution auto des rôles', desc: 'Attribution secrète pour Mafia, Bunker et autres' },
      { title: 'Minuteries intégrées', desc: 'Minuteries pour chaque jeu avec les bons réglages' },
      { title: 'Comptage des points', desc: 'Comptage automatique selon les règles de chaque jeu' },
    ],
    games_title: 'Jeux', games_subtitle: 'Choisissez un jeu et commencez en 30 secondes',
    cta_title: 'Commencez maintenant', cta_subtitle: 'Gratuit. Sans inscription. Fonctionne sur téléphone.',
    cta_button: 'Ouvrir le catalogue', footer: 'Fait avec amour pour les jeux de société',
  },
  catalog: { title: 'Catalogue', subtitle: 'Choisissez un jeu', search: 'Rechercher...', players: 'joueurs',
    difficulty: { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' }, all: 'Tous', start: 'Jouer',
    how_to_play: 'Comment jouer', common_mistakes: 'Erreurs courantes', back: 'Retour', duration: 'Durée' },
  game: { players: 'Joueurs', start_game: 'Commencer', next: 'Suivant', skip: 'Passer', correct: 'Correct',
    score: 'Score', round: 'Tour', team: 'Équipe', winner: 'Gagnant', results: 'Résultats',
    game_over: 'Fin du jeu', congratulations: 'Félicitations !', time_up: 'Temps écoulé !',
    play_again: 'Rejouer', back_to_catalog: 'Au catalogue', vote: 'Voter', eliminate: 'Éliminer',
    yes: 'Oui', no: 'Non', irrelevant: 'Sans importance', hint: 'Indice', answer: 'Réponse' },
})

const pt: Translations = makeLang({
  nav: { home: 'Início', catalog: 'Catálogo', about: 'Sobre' },
  landing: {
    hero_title: 'Jogue certo', hero_subtitle: 'Sem discussões, sem erros, sem manuais de 20 páginas',
    hero_cta: 'Abrir Catálogo', hero_secondary: 'Como funciona',
    problem_title: 'Parece familiar?',
    problem_items: ['Comprou um jogo — 20 páginas de regras que ninguém quer ler', 'Assistiu um vídeo — cada um lembrou diferente', 'Metade da noite discutindo como jogar', 'Alguém jogou errado a vida toda sem saber', 'Sem mestre — ninguém quer ler as regras', 'Esqueceu o timer, perdeu o dado, confundiu os papéis'],
    solution_title: 'Um toque — e você joga', solution_subtitle: 'GameStol — um anfitrião digital que conhece as regras melhor que você',
    features: [
      { title: 'Guia passo a passo', desc: 'O app conduz o jogo — fase por fase' },
      { title: 'Distribuição automática', desc: 'Atribuição secreta de papéis para Máfia, Bunker e mais' },
      { title: 'Temporizadores', desc: 'Timers para cada jogo com configurações corretas' },
      { title: 'Pontuação', desc: 'Contagem automática pelas regras de cada jogo' },
    ],
    games_title: 'Jogos', games_subtitle: 'Escolha um jogo e comece em 30 segundos',
    cta_title: 'Comece agora', cta_subtitle: 'Grátis. Sem cadastro. Funciona no celular.',
    cta_button: 'Abrir Catálogo', footer: 'Feito com amor por jogos de tabuleiro',
  },
  catalog: { title: 'Catálogo', subtitle: 'Escolha um jogo', search: 'Buscar...', players: 'jogadores',
    difficulty: { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' }, all: 'Todos', start: 'Jogar',
    how_to_play: 'Como jogar', common_mistakes: 'Erros comuns', back: 'Voltar', duration: 'Duração' },
  game: { players: 'Jogadores', start_game: 'Iniciar', next: 'Próximo', skip: 'Pular', correct: 'Correto',
    score: 'Pontuação', round: 'Rodada', team: 'Time', winner: 'Vencedor', results: 'Resultados',
    game_over: 'Fim de jogo', congratulations: 'Parabéns!', time_up: 'Tempo esgotado!',
    play_again: 'Jogar novamente', back_to_catalog: 'Ao catálogo', vote: 'Votar', eliminate: 'Eliminar',
    yes: 'Sim', no: 'Não', irrelevant: 'Irrelevante', hint: 'Dica', answer: 'Resposta' },
})

const zh: Translations = makeLang({
  nav: { home: '首页', catalog: '游戏目录', about: '关于' },
  landing: {
    hero_title: '正确地玩', hero_subtitle: '不争论，不犯错，不翻20页规则书',
    hero_cta: '打开目录', hero_secondary: '如何运作',
    problem_title: '听起来熟悉吗？',
    problem_items: ['买了桌游 — 20页规则，没人想读', '看了视频 — 每个人记住的版本不同', '花了半个晚上争论怎么玩', '有人一辈子都玩错了却不知道', '没有主持人 — 没人想当"读规则的人"', '忘了计时器，丢了骰子，搞混了角色'],
    solution_title: '一键开始游戏', solution_subtitle: 'GameStol — 比你更懂规则的数字主持人',
    features: [
      { title: '逐步引导', desc: '应用替你主持 — 一个阶段接一个阶段' },
      { title: '自动分配角色', desc: '为狼人杀、地堡等游戏秘密分配角色' },
      { title: '内置计时器', desc: '为每款游戏提供正确设置的计时器' },
      { title: '计分', desc: '按每款游戏的规则自动计分' },
    ],
    games_title: '游戏', games_subtitle: '选择一款游戏，30秒开始',
    cta_title: '立即开始', cta_subtitle: '免费。无需注册。手机即可使用。',
    cta_button: '打开游戏目录', footer: '为桌游爱好者精心打造',
  },
  catalog: { title: '游戏目录', subtitle: '选择今晚的游戏', search: '搜索游戏...', players: '玩家',
    difficulty: { easy: '简单', medium: '中等', hard: '困难' }, all: '全部', start: '开始',
    how_to_play: '如何游戏', common_mistakes: '常见错误', back: '返回', duration: '时长' },
  game: { players: '玩家', start_game: '开始游戏', next: '下一步', skip: '跳过', correct: '正确',
    score: '得分', round: '回合', team: '队伍', winner: '获胜者', results: '结果',
    game_over: '游戏结束', congratulations: '恭喜！', time_up: '时间到！',
    play_again: '再玩一次', back_to_catalog: '返回目录', vote: '投票', eliminate: '淘汰',
    yes: '是', no: '否', irrelevant: '无关', hint: '提示', answer: '答案' },
})

const ja: Translations = makeLang({
  nav: { home: 'ホーム', catalog: 'ゲームカタログ', about: '概要' },
  landing: {
    hero_title: '正しくプレイ', hero_subtitle: '議論なし、ミスなし、20ページのルールブックなし',
    hero_cta: 'カタログを開く', hero_secondary: '仕組み',
    problem_title: 'こんな経験ありませんか？',
    problem_items: ['ボードゲームを買った — 20ページのルール、誰も読みたがらない', 'YouTube動画を見た — みんな違う内容を覚えている', '夜の半分をルールの議論に費やした', '一生間違ったプレイをしていた人がいた', '進行役がいない — 誰もルールを読みたがらない', 'タイマーを忘れ、サイコロをなくし、役割を間違えた'],
    solution_title: 'ワンタップでゲーム開始', solution_subtitle: 'GameStol — あなたよりルールを知っているデジタルホスト',
    features: [
      { title: 'ステップバイステップ', desc: 'アプリがゲームを進行 — フェーズごとに' },
      { title: '自動役割配布', desc: 'マフィア、バンカーなどの秘密の役割配布' },
      { title: '内蔵タイマー', desc: '各ゲームに正しい設定のタイマー' },
      { title: 'スコア計算', desc: '各ゲームのルールに基づく自動計算' },
    ],
    games_title: 'ゲーム', games_subtitle: 'ゲームを選んで30秒で開始',
    cta_title: '今すぐ始める', cta_subtitle: '無料。登録不要。スマホで動作。',
    cta_button: 'カタログを開く', footer: 'ボードゲームへの愛を込めて',
  },
  catalog: { title: 'カタログ', subtitle: '今夜のゲームを選ぶ', search: 'ゲームを検索...', players: 'プレイヤー',
    difficulty: { easy: '簡単', medium: '普通', hard: '難しい' }, all: 'すべて', start: 'プレイ',
    how_to_play: '遊び方', common_mistakes: 'よくある間違い', back: '戻る', duration: '所要時間' },
  game: { players: 'プレイヤー', start_game: 'ゲーム開始', next: '次へ', skip: 'スキップ', correct: '正解',
    score: 'スコア', round: 'ラウンド', team: 'チーム', winner: '勝者', results: '結果',
    game_over: 'ゲーム終了', congratulations: 'おめでとう！', time_up: '時間切れ！',
    play_again: 'もう一度', back_to_catalog: 'カタログへ', vote: '投票', eliminate: '排除',
    yes: 'はい', no: 'いいえ', irrelevant: '関係なし', hint: 'ヒント', answer: '答え' },
})

const ko: Translations = makeLang({
  nav: { home: '홈', catalog: '게임 카탈로그', about: '소개' },
  landing: {
    hero_title: '제대로 플레이하세요', hero_subtitle: '논쟁 없이, 실수 없이, 20페이지 규칙서 없이',
    hero_cta: '카탈로그 열기', hero_secondary: '작동 방식',
    problem_title: '익숙한가요?',
    problem_items: ['보드게임을 샀는데 — 20페이지 규칙, 아무도 읽고 싶어하지 않음', '유튜브 영상을 봤는데 — 다들 다르게 기억함', '저녁 반을 규칙 논쟁으로 보냄', '평생 잘못 플레이한 사람이 있었음', '진행자 없음 — 아무도 규칙 읽기 싫어함', '타이머를 잊고, 주사위를 잃고, 역할을 헷갈림'],
    solution_title: '한 번 터치로 플레이', solution_subtitle: 'GameStol — 당신보다 규칙을 잘 아는 디지털 호스트',
    features: [
      { title: '단계별 진행', desc: '앱이 게임을 진행합니다 — 단계별로' },
      { title: '자동 역할 배분', desc: '마피아, 벙커 등의 비밀 역할 배분' },
      { title: '내장 타이머', desc: '각 게임에 맞는 올바른 타이머 설정' },
      { title: '점수 계산', desc: '각 게임 규칙에 따른 자동 계산' },
    ],
    games_title: '게임', games_subtitle: '게임을 선택하고 30초 만에 시작하세요',
    cta_title: '지금 시작하세요', cta_subtitle: '무료. 가입 불필요. 휴대폰에서 작동.',
    cta_button: '게임 카탈로그 열기', footer: '보드게임에 대한 사랑으로 만들었습니다',
  },
  catalog: { title: '카탈로그', subtitle: '오늘 밤 게임을 선택하세요', search: '게임 검색...', players: '플레이어',
    difficulty: { easy: '쉬움', medium: '보통', hard: '어려움' }, all: '전체', start: '플레이',
    how_to_play: '플레이 방법', common_mistakes: '흔한 실수', back: '뒤로', duration: '소요 시간' },
  game: { players: '플레이어', start_game: '게임 시작', next: '다음', skip: '건너뛰기', correct: '정답',
    score: '점수', round: '라운드', team: '팀', winner: '승자', results: '결과',
    game_over: '게임 종료', congratulations: '축하합니다!', time_up: '시간 초과!',
    play_again: '다시 플레이', back_to_catalog: '카탈로그로', vote: '투표', eliminate: '제거',
    yes: '예', no: '아니오', irrelevant: '무관', hint: '힌트', answer: '정답' },
})

const tr: Translations = makeLang({
  nav: { home: 'Ana Sayfa', catalog: 'Oyun Kataloğu', about: 'Hakkında' },
  landing: {
    hero_title: 'Doğru oyna', hero_subtitle: 'Tartışma yok, hata yok, 20 sayfalık kural kitabı yok',
    hero_cta: 'Kataloğu Aç', hero_secondary: 'Nasıl çalışır',
    problem_title: 'Tanıdık geldi mi?',
    problem_items: ['Kutu oyunu aldınız — 20 sayfa kural, kimse okumak istemiyor', 'YouTube videosu izlediniz — herkes farklı hatırlıyor', 'Gecenin yarısını kuralları tartışarak geçirdiniz', 'Biri hayatı boyunca yanlış oynamış ama bilmiyormuş', 'Oyun yöneticisi yok — kimse kural okuyucu olmak istemiyor', 'Zamanlayıcıyı unuttunuz, zarı kaybettiniz, rolleri karıştırdınız'],
    solution_title: 'Bir dokunuş — ve oynuyorsunuz', solution_subtitle: 'GameStol — kuralları sizden daha iyi bilen dijital ev sahibi',
    features: [
      { title: 'Adım adım rehberlik', desc: 'Uygulama oyunu yönetir — aşama aşama' },
      { title: 'Otomatik rol dağıtımı', desc: 'Mafya, Sığınak ve diğer oyunlar için gizli rol dağıtımı' },
      { title: 'Yerleşik zamanlayıcılar', desc: 'Her oyun için doğru ayarlarda zamanlayıcılar' },
      { title: 'Puan takibi', desc: 'Her oyunun kurallarına göre otomatik sayım' },
    ],
    games_title: 'Oyunlar', games_subtitle: 'Bir oyun seçin ve 30 saniyede başlayın',
    cta_title: 'Hemen başlayın', cta_subtitle: 'Ücretsiz. Kayıt gerektirmez. Telefonunuzda çalışır.',
    cta_button: 'Oyun Kataloğunu Aç', footer: 'Kutu oyunlarına sevgiyle yapıldı',
  },
  catalog: { title: 'Katalog', subtitle: 'Akşam için bir oyun seçin', search: 'Oyun ara...', players: 'oyuncu',
    difficulty: { easy: 'Kolay', medium: 'Orta', hard: 'Zor' }, all: 'Tümü', start: 'Oyna',
    how_to_play: 'Nasıl oynanır', common_mistakes: 'Sık yapılan hatalar', back: 'Geri', duration: 'Süre' },
  game: { players: 'Oyuncular', start_game: 'Oyunu Başlat', next: 'Sonraki', skip: 'Atla', correct: 'Doğru',
    score: 'Puan', round: 'Tur', team: 'Takım', winner: 'Kazanan', results: 'Sonuçlar',
    game_over: 'Oyun Bitti', congratulations: 'Tebrikler!', time_up: 'Süre doldu!',
    play_again: 'Tekrar oyna', back_to_catalog: 'Kataloğa dön', vote: 'Oyla', eliminate: 'Ele',
    yes: 'Evet', no: 'Hayır', irrelevant: 'Önemsiz', hint: 'İpucu', answer: 'Cevap' },
})

const it: Translations = makeLang({
  nav: { home: 'Home', catalog: 'Catalogo Giochi', about: 'Info' },
  landing: {
    hero_title: 'Gioca nel modo giusto', hero_subtitle: 'Niente discussioni, niente errori, niente manuali da 20 pagine',
    hero_cta: 'Apri Catalogo', hero_secondary: 'Come funziona',
    problem_title: 'Ti suona familiare?',
    problem_items: ['Comprato un gioco — 20 pagine di regole, nessuno vuole leggerle', 'Visto un video YouTube — ognuno ricorda una versione diversa', 'Metà serata a discutere come si gioca', 'Qualcuno ha giocato sbagliato per tutta la vita senza saperlo', 'Nessun moderatore — nessuno vuole leggere le regole', 'Dimenticato il timer, perso i dadi, confusi i ruoli'],
    solution_title: 'Un tocco — e giocate', solution_subtitle: 'GameStol — un host digitale che conosce le regole meglio di voi',
    features: [
      { title: 'Guida passo passo', desc: 'L\'app gestisce il gioco — fase per fase' },
      { title: 'Distribuzione automatica', desc: 'Assegnazione segreta dei ruoli per Mafia, Bunker e altri' },
      { title: 'Timer integrati', desc: 'Timer per ogni gioco con le impostazioni corrette' },
      { title: 'Conteggio punti', desc: 'Conteggio automatico secondo le regole di ogni gioco' },
    ],
    games_title: 'Giochi', games_subtitle: 'Scegli un gioco e inizia in 30 secondi',
    cta_title: 'Inizia ora', cta_subtitle: 'Gratuito. Senza registrazione. Funziona sul telefono.',
    cta_button: 'Apri Catalogo Giochi', footer: 'Fatto con amore per i giochi da tavolo',
  },
  catalog: { title: 'Catalogo', subtitle: 'Scegli un gioco per la serata', search: 'Cerca gioco...', players: 'giocatori',
    difficulty: { easy: 'Facile', medium: 'Medio', hard: 'Difficile' }, all: 'Tutti', start: 'Gioca',
    how_to_play: 'Come giocare', common_mistakes: 'Errori comuni', back: 'Indietro', duration: 'Durata' },
  game: { players: 'Giocatori', start_game: 'Inizia', next: 'Avanti', skip: 'Salta', correct: 'Corretto',
    score: 'Punteggio', round: 'Turno', team: 'Squadra', winner: 'Vincitore', results: 'Risultati',
    game_over: 'Fine partita', congratulations: 'Congratulazioni!', time_up: 'Tempo scaduto!',
    play_again: 'Gioca ancora', back_to_catalog: 'Al catalogo', vote: 'Vota', eliminate: 'Elimina',
    yes: 'Sì', no: 'No', irrelevant: 'Irrilevante', hint: 'Suggerimento', answer: 'Risposta' },
})

const ar: Translations = makeLang({
  nav: { home: 'الرئيسية', catalog: 'كتالوج الألعاب', about: 'حول' },
  landing: {
    hero_title: 'العب بشكل صحيح', hero_subtitle: 'بدون جدال، بدون أخطاء، بدون كتيبات من 20 صفحة',
    hero_cta: 'افتح الكتالوج', hero_secondary: 'كيف يعمل',
    problem_title: 'يبدو مألوفاً؟',
    problem_items: ['اشتريت لعبة — 20 صفحة قواعد، لا أحد يريد قراءتها', 'شاهدت فيديو — كل شخص يتذكر نسخة مختلفة', 'قضيت نصف المساء في الجدال حول كيفية اللعب', 'شخص ما لعب بشكل خاطئ طوال حياته ولم يعرف', 'لا يوجد مدير لعبة — لا أحد يريد قراءة القواعد', 'نسيت المؤقت، فقدت النرد، خلطت الأدوار'],
    solution_title: 'نقرة واحدة — وأنت تلعب', solution_subtitle: 'GameStol — مضيف رقمي يعرف القواعد أفضل منك',
    features: [
      { title: 'إرشاد خطوة بخطوة', desc: 'التطبيق يدير اللعبة — مرحلة بمرحلة' },
      { title: 'توزيع تلقائي للأدوار', desc: 'توزيع سري للأدوار في المافيا والملجأ وغيرها' },
      { title: 'مؤقتات مدمجة', desc: 'مؤقتات لكل لعبة بالإعدادات الصحيحة' },
      { title: 'حساب النقاط', desc: 'حساب تلقائي وفقاً لقواعد كل لعبة' },
    ],
    games_title: 'الألعاب', games_subtitle: 'اختر لعبة وابدأ في 30 ثانية',
    cta_title: 'ابدأ الآن', cta_subtitle: 'مجاني. بدون تسجيل. يعمل على الهاتف.',
    cta_button: 'افتح كتالوج الألعاب', footer: 'صنع بحب لألعاب الطاولة',
  },
  catalog: { title: 'الكتالوج', subtitle: 'اختر لعبة للمساء', search: 'بحث...', players: 'لاعبين',
    difficulty: { easy: 'سهل', medium: 'متوسط', hard: 'صعب' }, all: 'الكل', start: 'العب',
    how_to_play: 'كيف تلعب', common_mistakes: 'أخطاء شائعة', back: 'رجوع', duration: 'المدة' },
  game: { players: 'اللاعبون', start_game: 'بدء اللعبة', next: 'التالي', skip: 'تخطي', correct: 'صحيح',
    score: 'النقاط', round: 'الجولة', team: 'الفريق', winner: 'الفائز', results: 'النتائج',
    game_over: 'انتهت اللعبة', congratulations: 'تهانينا!', time_up: 'انتهى الوقت!',
    play_again: 'العب مرة أخرى', back_to_catalog: 'العودة', vote: 'تصويت', eliminate: 'استبعاد',
    yes: 'نعم', no: 'لا', irrelevant: 'غير مهم', hint: 'تلميح', answer: 'إجابة' },
})

const translations: Record<string, Translations> = { ru, en, es, de, fr, pt, zh, ja, ko, tr, it, ar }

interface I18nContextType {
  lang: LangCode
  setLang: (l: LangCode) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: en,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem('gamestol-lang')
    if (saved && translations[saved]) return saved as LangCode
    const browserLang = navigator.language.split('-')[0]
    if (translations[browserLang]) return browserLang as LangCode
    return 'en'
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
