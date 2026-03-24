import { GameInfo } from '../types'
import MafiaGame from './MafiaGame'
import AliasGame from './AliasGame'
import CrocodileGame from './CrocodileGame'
import CodenamesGame from './CodenamesGame'
import QuizGame from './QuizGame'
import BunkerGame from './BunkerGame'
import HatGame from './HatGame'
import ImaginariumGame from './ImaginariumGame'
import ActivityGame from './ActivityGame'
import DanetkiGame from './DanetkiGame'
import AnagramGame from './AnagramGame'
import ContactGame from './ContactGame'
import ReverseCharadesGame from './ReverseCharadesGame'
import TickTockGame from './TickTockGame'
import OneNightGame from './OneNightGame'
import TabooGame from './TabooGame'
import SpyfallGame from './SpyfallGame'
import WhoAmIGame from './WhoAmIGame'
import ScattergoriesGame from './ScattergoriesGame'
import CitiesGame from './CitiesGame'
import TruthDareGame from './TruthDareGame'
import NeverHaveIGame from './NeverHaveIGame'
import ForfeitsGame from './ForfeitsGame'
import TwoTruthsGame from './TwoTruthsGame'
import WordChainGame from './WordChainGame'

interface BilingualGameInfo extends Omit<GameInfo, 'nameAlt' | 'tagline' | 'description' | 'howToPlay' | 'commonMistakes'> {
  tagline: { ru: string; en: string }
  description: { ru: string; en: string }
  howToPlay: { ru: string[]; en: string[] }
  commonMistakes: { ru: string[]; en: string[] }
}

const gamesData: BilingualGameInfo[] = [
  {
    id: 'mafia',
    name: 'Мафия',
    nameEn: 'Mafia',
    emoji: '🎭',
    tagline: {
      ru: 'Город засыпает... Просыпается мафия',
      en: 'The city sleeps... The mafia awakens',
    },
    description: {
      ru: 'Классическая игра на блеф и дедукцию. Мирные жители пытаются вычислить мафию, а мафия — остаться незамеченной. Ведущий управляет фазами дня и ночи.',
      en: 'A classic game of bluffing and deduction. Citizens try to identify the mafia, while the mafia tries to stay hidden. The host manages night and day phases.',
    },
    minPlayers: 6,
    maxPlayers: 20,
    duration: '30-60 min',
    difficulty: 'medium',
    hostMode: 'required',
    categories: ['party', 'detective'],
    howToPlay: {
      ru: [
        'Каждый игрок получает тайную роль: Мафия, Мирный, Доктор или Комиссар',
        'Ночью мафия выбирает жертву, доктор лечит, комиссар проверяет',
        'Днём все обсуждают, кто может быть мафией',
        'Голосование — большинством голосов исключают подозреваемого',
        'Побеждают мирные, если вся мафия раскрыта, или мафия, если их столько же, сколько мирных',
      ],
      en: [
        'Each player receives a secret role: Mafia, Citizen, Doctor, or Detective',
        'At night, mafia picks a victim, doctor heals, detective investigates',
        'During the day, everyone discusses who might be mafia',
        'Vote to eliminate a suspect by majority',
        'Citizens win if all mafia are found; mafia wins if they equal the citizens',
      ],
    },
    commonMistakes: {
      ru: [
        'Мафия открывает глаза не одновременно — ведущий должен контролировать',
        'Комиссар может проверить одного и того же человека дважды — бессмысленно',
        'Доктор не может лечить себя два раза подряд (в классических правилах)',
        'При равном голосовании никого не исключают, а не обоих',
        'Мёртвые игроки НЕ могут говорить и влиять на игру',
      ],
      en: [
        'Mafia members open eyes at different times — the host must control this',
        'Detective can check the same person twice — legal but pointless',
        'Doctor cannot heal themselves two nights in a row (classic rules)',
        'On a tied vote, no one is eliminated — not both',
        'Dead players CANNOT speak or influence the game',
      ],
    },
    component: MafiaGame,
  },
  {
    id: 'alias',
    name: 'Алиас',
    nameEn: 'Alias',
    emoji: '💬',
    tagline: {
      ru: 'Объясни слово, не называя его',
      en: 'Explain the word without saying it',
    },
    description: {
      ru: 'Командная игра, где нужно объяснять слова партнёрам по команде за ограниченное время. Нельзя использовать однокоренные слова.',
      en: 'A team game where you explain words to teammates within a time limit. No root words allowed.',
    },
    minPlayers: 4,
    maxPlayers: 20,
    duration: '30-60 min',
    difficulty: 'easy',
    hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: [
        'Разделитесь на команды по 2+ человека',
        'Один игрок объясняет слово, остальные в команде угадывают',
        'За 60 секунд нужно угадать как можно больше слов',
        'За правильный ответ +1, за пропуск -1',
        'Нельзя использовать однокоренные слова, жесты и звуки',
        'Побеждает команда, набравшая больше очков',
      ],
      en: [
        'Split into teams of 2+ players',
        'One player explains the word, teammates guess',
        'Guess as many words as possible in 60 seconds',
        'Correct answer: +1 point. Skip: -1 point',
        'No root words, gestures, or sounds allowed',
        'The team with the most points wins',
      ],
    },
    commonMistakes: {
      ru: [
        'Использование однокоренных слов — «дерево» нельзя объяснить как «деревянный»',
        'Показывание жестами — в Alias можно только говорить',
        'Объясняющий называет слово вслух при пропуске — другие команды могут запомнить',
        'Слишком долго объясняют одно слово — лучше пропустить и взять новое',
      ],
      en: [
        'Using root words — you can\'t explain "tree" by saying "wooden"',
        'Using gestures — in Alias you can only speak',
        'Saying the word aloud when skipping — other teams might remember it',
        'Spending too long on one word — better to skip and grab a new one',
      ],
    },
    component: AliasGame,
  },
  {
    id: 'crocodile',
    name: 'Крокодил',
    nameEn: 'Charades',
    emoji: '🐊',
    tagline: {
      ru: 'Покажи слово без слов',
      en: 'Act it out — no words allowed',
    },
    description: {
      ru: 'Игра-пантомима, где нужно показать слово жестами, без слов и звуков. Остальные угадывают.',
      en: 'A pantomime game where you act out words using gestures only — no speaking or sounds. Others guess.',
    },
    minPlayers: 3,
    maxPlayers: 20,
    duration: '20-40 min',
    difficulty: 'easy',
    hostMode: 'none',
    categories: ['party', 'creative'],
    howToPlay: {
      ru: ['Один игрок показывает слово жестами', 'Нельзя говорить, издавать звуки и показывать на предметы', 'Остальные пытаются угадать за отведённое время', 'Кто угадал — получает очко и становится следующим', 'Можно играть командами или каждый за себя'],
      en: ['One player acts out a word using gestures', 'No speaking, sounds, or pointing at objects', 'Others try to guess within the time limit', 'Whoever guesses correctly scores a point and goes next', 'Play in teams or free-for-all'],
    },
    commonMistakes: {
      ru: ['Показывающий издаёт звуки или шевелит губами — запрещено', 'Показывают на реальные предметы в комнате — нельзя', 'Используют буквы и цифры жестами — запрещено', 'Не засекают время — без лимита игра затягивается'],
      en: ['The actor makes sounds or moves their lips — forbidden', 'Pointing at real objects in the room — not allowed', 'Using letters or numbers with gestures — forbidden', 'Not setting a timer — without a limit the game drags on'],
    },
    component: CrocodileGame,
  },
  {
    id: 'codenames',
    name: 'Кодовые имена',
    nameEn: 'Codenames',
    emoji: '🕵️',
    tagline: {
      ru: 'Дай подсказку — одно слово, одно число',
      en: 'Give a clue — one word, one number',
    },
    description: {
      ru: 'Две команды соревнуются, кто быстрее угадает все свои слова на поле 5×5. Капитан даёт подсказки, а агенты выбирают слова.',
      en: 'Two teams compete to find all their words on a 5×5 grid. The spymaster gives clues, agents guess.',
    },
    minPlayers: 4, maxPlayers: 12, duration: '20-30 min', difficulty: 'medium', hostMode: 'none',
    categories: ['party', 'word', 'strategy'],
    howToPlay: {
      ru: ['На столе 25 слов (5×5). Каждое принадлежит красной/синей команде, нейтральное или убийца', 'Только капитаны видят цвета слов', 'Капитан даёт подсказку: одно слово + число связанных слов', 'Команда обсуждает и выбирает. Угадали — продолжают', 'Выбрали слово соперника — ход переходит. Убийца — мгновенный проигрыш'],
      en: ['25 words on a 5×5 grid. Each belongs to red/blue team, neutral, or assassin', 'Only spymasters see the color map', 'Spymaster gives a clue: one word + number of related words', 'Team discusses and guesses. Correct — keep going', 'Wrong team\'s word — turn ends. Assassin — instant loss'],
    },
    commonMistakes: {
      ru: ['Капитан даёт подсказку из нескольких слов — можно только ОДНО', 'Подсказка совпадает со словом на поле — запрещено', 'Капитан реагирует мимикой — покерфейс обязателен', 'Один человек выбирает без обсуждения — обсуждение важно', 'Забывают, что убийца = мгновенный проигрыш'],
      en: ['Spymaster gives multi-word clues — only ONE word allowed', 'Clue matches a word on the board — forbidden', 'Spymaster reacts with expressions — poker face required', 'One person picks without discussion — teamwork is key', 'Forgetting the assassin = instant loss, not just a penalty'],
    },
    component: CodenamesGame,
  },
  {
    id: 'quiz',
    name: 'Что? Где? Когда?',
    nameEn: 'Quiz Battle',
    emoji: '🧠',
    tagline: {
      ru: 'Минута на обсуждение — отвечайте!',
      en: 'One minute to discuss — answer!',
    },
    description: {
      ru: 'Интеллектуальная игра, где команда обсуждает вопрос за 60 секунд и даёт ответ.',
      en: 'A trivia game where the team discusses each question for 60 seconds and gives an answer.',
    },
    minPlayers: 2, maxPlayers: 8, duration: '30-60 min', difficulty: 'hard', hostMode: 'optional',
    categories: ['strategy'],
    howToPlay: {
      ru: ['Ведущий зачитывает вопрос', 'У команды 60 секунд на обсуждение', 'Капитан даёт финальный ответ', 'За правильный ответ — очко', 'Играют до определённого количества вопросов'],
      en: ['The host reads a question', 'The team has 60 seconds to discuss', 'The captain gives the final answer', 'Correct answer earns a point', 'Play until a set number of questions'],
    },
    commonMistakes: {
      ru: ['Обсуждение после окончания времени — ответ нужно давать вовремя', 'Капитан не назначен — без него решение затягивается', 'Все говорят одновременно — слушайте друг друга', 'Гуглят ответы — убивает смысл игры'],
      en: ['Discussing after time runs out — answer must be given on time', 'No captain assigned — decisions drag without one', 'Everyone talks at once — listen to each other', 'Googling answers — defeats the purpose of the game'],
    },
    component: QuizGame,
  },
  {
    id: 'bunker',
    name: 'Бункер',
    nameEn: 'Bunker',
    emoji: '🏚️',
    tagline: {
      ru: 'Кто достоин выжить?',
      en: 'Who deserves to survive?',
    },
    description: {
      ru: 'Мир уничтожен катастрофой. Есть бункер на ограниченное число мест. Раскрывайте характеристики и убеждайте, почему именно вы должны выжить.',
      en: 'The world is destroyed by a catastrophe. There\'s a bunker with limited spots. Reveal your traits and convince others why you deserve to survive.',
    },
    minPlayers: 4, maxPlayers: 16, duration: '40-90 min', difficulty: 'medium', hostMode: 'none',
    categories: ['party', 'strategy'],
    howToPlay: {
      ru: ['Выбирается случайная катастрофа и параметры бункера', 'Каждый получает карту: профессия, здоровье, хобби, фобия, багаж, спецнавык', 'В каждом раунде раскрывают одну характеристику', 'После раскрытия — обсуждение и голосование за исключение', 'Продолжается, пока не останется нужное число выживших'],
      en: ['A random catastrophe and bunker parameters are chosen', 'Each player gets a card: profession, health, hobby, phobia, luggage, special skill', 'Each round, players reveal one trait', 'After revealing — discuss and vote to eliminate someone', 'Continue until the right number of survivors remain'],
    },
    commonMistakes: {
      ru: ['Раскрывают все характеристики сразу — по одной за раунд', 'Голосуют за себя — запрещено', 'Врут о характеристиках — карточки нельзя менять', 'Обсуждение слишком короткое — дайте каждому защиту'],
      en: ['Revealing all traits at once — one per round only', 'Voting for yourself — not allowed', 'Lying about traits — cards cannot be changed', 'Discussion too short — give everyone a chance to defend'],
    },
    component: BunkerGame,
  },
  {
    id: 'hat',
    name: 'Шляпа',
    nameEn: 'Hat Game',
    emoji: '🎩',
    tagline: {
      ru: 'Объясни, покажи, скажи одним словом',
      en: 'Explain it, act it, say it in one word',
    },
    description: {
      ru: 'Каждый кидает слова в шляпу. Затем в парах один объясняет, другой угадывает за 30 секунд.',
      en: 'Everyone puts words into the hat. Then in pairs, one explains and the other guesses in 30 seconds.',
    },
    minPlayers: 4, maxPlayers: 20, duration: '30-60 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Каждый пишет 5-10 слов и кладёт в «шляпу»', 'Игроки делятся на пары', 'Один объясняет слова, другой угадывает', 'На пару — 30 секунд', 'За угаданное слово — очко', 'Игра до пустой шляпы'],
      en: ['Each player writes 5-10 words and puts them in the "hat"', 'Players pair up', 'One explains words, the other guesses', '30 seconds per pair', 'Each guessed word = 1 point', 'Game ends when the hat is empty'],
    },
    commonMistakes: {
      ru: ['Кладут непонятные слова — все должны их знать', 'Не перемешивают слова', 'Подглядывают заранее', 'Используют однокоренные слова — запрещено'],
      en: ['Adding obscure words — everyone should know them', 'Not shuffling the words', 'Peeking at words in advance', 'Using root words — forbidden'],
    },
    component: HatGame,
  },
  {
    id: 'imaginarium',
    name: 'Имаджинариум',
    nameEn: 'Imaginarium / Dixit',
    emoji: '🎨',
    tagline: {
      ru: 'Угадай ассоциацию художника',
      en: 'Guess the storyteller\'s association',
    },
    description: {
      ru: 'Игра на ассоциации. Рассказчик загадывает ассоциацию, остальные подкладывают похожие карты. Все голосуют.',
      en: 'An association game. The storyteller gives a clue for their card. Others play similar cards. Everyone votes.',
    },
    minPlayers: 3, maxPlayers: 8, duration: '30-45 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'creative'],
    howToPlay: {
      ru: ['Рассказчик говорит ассоциацию к своей карте', 'Остальные подкладывают подходящую карту', 'Карты перемешиваются и выкладываются', 'Все голосуют за карту рассказчика', 'Если все/никто не угадал — рассказчик получает 0 очков'],
      en: ['Storyteller gives an association for their card', 'Others play a matching card from their hand', 'All cards are shuffled and revealed', 'Everyone votes for the storyteller\'s card', 'If everyone/no one guesses right — storyteller gets 0 points'],
    },
    commonMistakes: {
      ru: ['Слишком очевидная ассоциация — все угадают, 0 очков', 'Слишком абстрактная — никто не угадает, 0 очков', 'Нужен баланс — понятно не всем, но кому-то', 'Голосуют за свою карту — запрещено'],
      en: ['Too obvious association — everyone guesses, 0 points', 'Too abstract — no one guesses, same result', 'Need balance — clear to some but not all', 'Voting for your own card — forbidden'],
    },
    component: ImaginariumGame,
  },
  {
    id: 'activity',
    name: 'Активити',
    nameEn: 'Activity',
    emoji: '🎯',
    tagline: {
      ru: 'Объясни, нарисуй или покажи',
      en: 'Explain, draw, or act it out',
    },
    description: {
      ru: 'Командная игра: объясните слово словами, рисунком или пантомимой. Способ определяется случайно.',
      en: 'Team game: explain a word by speaking, drawing, or miming. The method is chosen randomly.',
    },
    minPlayers: 4, maxPlayers: 16, duration: '30-60 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word', 'creative'],
    howToPlay: {
      ru: ['Разделитесь на команды', 'Вытяните карту с заданием и способом', 'Объясните: словами, рисунком или жестами', '60 секунд на угадывание', 'Первая команда, набравшая цель — побеждает'],
      en: ['Split into teams', 'Draw a card with a word and method', 'Explain by: speaking, drawing, or miming', '60 seconds to guess', 'First team to reach the target score wins'],
    },
    commonMistakes: {
      ru: ['Путают способы — если рисовать, нельзя говорить', 'При рисовании пишут буквы — запрещено', 'При пантомиме издают звуки — нельзя', 'При объяснении показывают жестами — нельзя'],
      en: ['Mixing methods — if drawing, you can\'t speak', 'Writing letters while drawing — forbidden', 'Making sounds while miming — not allowed', 'Using gestures while explaining verbally — not allowed'],
    },
    component: ActivityGame,
  },
  {
    id: 'danetki',
    name: 'Данетки',
    nameEn: 'Black Stories',
    emoji: '🔮',
    tagline: {
      ru: 'Разгадай историю — только Да или Нет',
      en: 'Solve the mystery — Yes or No only',
    },
    description: {
      ru: 'Ведущий зачитывает странную ситуацию. Игроки задают вопросы: только «Да», «Нет» или «Неважно».',
      en: 'The host reads a strange situation. Players ask questions that can only be answered "Yes", "No", or "Irrelevant".',
    },
    minPlayers: 2, maxPlayers: 20, duration: '15-30 min', difficulty: 'medium', hostMode: 'required',
    categories: ['detective'],
    howToPlay: {
      ru: ['Ведущий зачитывает ситуацию', 'Игроки задают вопросы по очереди', 'Ведущий отвечает: Да / Нет / Неважно', 'Восстановите полную картину', 'Если застряли — ведущий даёт подсказку'],
      en: ['The host reads the situation', 'Players ask questions one by one', 'Host answers: Yes / No / Irrelevant', 'Reconstruct the full story', 'If stuck — the host gives a hint'],
    },
    commonMistakes: {
      ru: ['Открытые вопросы вместо закрытых — только да/нет', 'Ведущий отвечает подробно — только 3 варианта', 'Гадают без анализа — стройте цепочку', 'Ведущий подсматривает при каждом вопросе — прочитайте заранее'],
      en: ['Asking open questions instead of yes/no — only closed questions', 'Host gives detailed answers — only 3 options', 'Random guessing without analysis — build a chain of reasoning', 'Host checks the answer every time — read it beforehand'],
    },
    component: DanetkiGame,
  },
  {
    id: 'truth-dare',
    name: 'Правда или Действие',
    nameEn: 'Truth or Dare',
    emoji: '🔥',
    tagline: {
      ru: 'Правда — ответь честно. Действие — выполни задание',
      en: 'Truth — answer honestly. Dare — complete the challenge',
    },
    description: {
      ru: 'Классическая игра для компании. Каждый по очереди выбирает: ответить на каверзный вопрос или выполнить забавное задание.',
      en: 'A classic party game. Each player takes turns choosing: answer a tricky question or complete a fun dare.',
    },
    minPlayers: 2, maxPlayers: 20, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party'],
    howToPlay: {
      ru: ['Случайный игрок выбирает: Правда или Действие', 'Правда — ответь честно на вопрос', 'Действие — выполни задание', 'Игра идёт по раундам, все играют по очереди'],
      en: ['Random player chooses: Truth or Dare', 'Truth — answer a question honestly', 'Dare — complete the challenge', 'Game goes in rounds, everyone takes turns'],
    },
    commonMistakes: {
      ru: ['Отказываться отвечать — нужно быть честным', 'Выбирать всегда одно и то же — чередуйте', 'Задания слишком жёсткие — держите баланс', 'Пропускать свою очередь — все участвуют'],
      en: ['Refusing to answer — you must be honest', 'Always picking the same — alternate', 'Dares too extreme — keep balance', 'Skipping your turn — everyone participates'],
    },
    component: TruthDareGame,
  },
  {
    id: 'never-have-i',
    name: 'Я Никогда Не',
    nameEn: 'Never Have I Ever',
    emoji: '🙈',
    tagline: {
      ru: 'Я никогда не... а ты?',
      en: 'Never have I ever... but have you?',
    },
    description: {
      ru: 'Игра-признание. Читается утверждение, и те, кто это делал, теряют очко. Кто дошёл до нуля — выбывает.',
      en: 'A confession game. A statement is read, and those who have done it lose a point. Reach zero — you are out.',
    },
    minPlayers: 2, maxPlayers: 20, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party'],
    howToPlay: {
      ru: ['Все начинают с одинаковым количеством очков', 'Читается утверждение "Я никогда не..."', 'Если ты ЭТО ДЕЛАЛ — нажми на своё имя (-1 очко)', 'Кто дошёл до 0 — выбывает', 'Последний оставшийся — победитель'],
      en: ['Everyone starts with the same number of points', 'A "Never have I ever..." statement is read', 'If you HAVE done it — tap your name (-1 point)', 'Reach 0 points — you are out', 'Last one standing wins'],
    },
    commonMistakes: {
      ru: ['Врать о том, что делал — играйте честно', 'Подглядывать за другими перед нажатием — решайте сами', 'Слишком специфичные утверждения — они должны быть универсальными', 'Обижаться на утверждения — это игра!'],
      en: ['Lying about what you have done — play honestly', 'Peeking at others before tapping — decide for yourself', 'Too specific statements — keep them universal', 'Getting offended by statements — it is a game!'],
    },
    component: NeverHaveIGame,
  },
  {
    id: 'forfeits',
    name: 'Фанты',
    nameEn: 'Forfeits',
    emoji: '🎪',
    tagline: {
      ru: 'Выполни задание — получи очко',
      en: 'Complete the challenge — score a point',
    },
    description: {
      ru: 'Каждый игрок получает случайное задание. Выполняет его, а остальные голосуют — зачёт или нет.',
      en: 'Each player gets a random challenge. Complete it, and others vote — pass or fail.',
    },
    minPlayers: 2, maxPlayers: 20, duration: '20-40 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'creative'],
    howToPlay: {
      ru: ['Случайный игрок получает задание', 'Игрок выполняет задание', 'Остальные голосуют: зачёт или нет', 'Большинство решает — +1 очко за успех', 'Побеждает тот, кто набрал больше очков'],
      en: ['Random player gets a challenge', 'Player completes the challenge', 'Others vote: pass or fail', 'Majority decides — +1 point for success', 'Player with the most points wins'],
    },
    commonMistakes: {
      ru: ['Отказываться выполнять — можно пропустить, но без очков', 'Голосовать предвзято — будьте объективны', 'Слишком быстро голосовать — дайте игроку закончить', 'Не засекать время для заданий с лимитом'],
      en: ['Refusing to perform — you can skip, but no points', 'Voting with bias — be objective', 'Voting too quickly — let the player finish', 'Not timing challenges that have a time limit'],
    },
    component: ForfeitsGame,
  },
  {
    id: 'two-truths',
    name: 'Две Правды и Ложь',
    nameEn: 'Two Truths and a Lie',
    emoji: '🤥',
    tagline: {
      ru: 'Угадай, где ложь среди правды',
      en: 'Spot the lie among the truths',
    },
    description: {
      ru: 'Игрок называет 3 факта о себе — 2 правды и 1 ложь. Остальные голосуют, какой факт ложный.',
      en: 'A player states 3 facts about themselves — 2 truths and 1 lie. Others vote on which is the lie.',
    },
    minPlayers: 3, maxPlayers: 20, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party'],
    howToPlay: {
      ru: ['Игрок называет 3 факта о себе: 2 правды и 1 ложь', 'Остальные голосуют — какой факт ложный', 'Угадавшие получают +1 очко', 'Если никто не угадал — ведущий получает +1', 'Побеждает тот, кто набрал больше очков'],
      en: ['Player states 3 facts: 2 truths and 1 lie', 'Others vote — which fact is the lie', 'Correct guessers get +1 point', 'If nobody guesses — the presenter gets +1', 'Player with the most points wins'],
    },
    commonMistakes: {
      ru: ['Ложь слишком очевидная — сделайте её правдоподобной', 'Правда слишком невероятная — баланс важен', 'Выдают себя мимикой — покерфейс!', 'Называют факты, которые все уже знают'],
      en: ['Lie too obvious — make it believable', 'Truth too unbelievable — balance is key', 'Giving it away with expressions — poker face!', 'Stating facts everyone already knows'],
    },
    component: TwoTruthsGame,
  },
  {
    id: 'word-chain',
    name: 'Цепочка Слов',
    nameEn: 'Word Chain',
    emoji: '🔗',
    tagline: {
      ru: 'Назови слово — или вылетаешь!',
      en: 'Say a word — or you are out!',
    },
    description: {
      ru: 'Игроки по очереди называют слова (ассоциации или на последнюю букву). Не успел — выбываешь. Последний — победитель.',
      en: 'Players take turns saying words (associations or last-letter chain). Fail and you are out. Last one standing wins.',
    },
    minPlayers: 2, maxPlayers: 20, duration: '10-20 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Выберите режим: ассоциации или последняя буква', 'Игроки по очереди называют слова', 'Есть таймер — не успел или ошибся — выбываешь', 'Последний оставшийся — победитель'],
      en: ['Choose mode: associations or last letter', 'Players take turns saying words', 'Timer runs — fail or run out of time — you are out', 'Last one standing wins'],
    },
    commonMistakes: {
      ru: ['Повторять уже сказанные слова — нельзя', 'Слишком долго думать — таймер не ждёт', 'Спорить о связи слов — группа решает', 'Использовать имена собственные — обычно запрещено'],
      en: ['Repeating already said words — not allowed', 'Thinking too long — the timer does not wait', 'Arguing about word connections — the group decides', 'Using proper nouns — usually forbidden'],
    },
    component: WordChainGame,
  },
  {
    id: 'anagram',
    name: 'Слова из слова',
    nameEn: 'Words from Word',
    emoji: '🔤',
    tagline: {
      ru: 'Составь как можно больше слов из одного',
      en: 'Make as many words as possible from one',
    },
    description: {
      ru: 'Показывается длинное слово — за 2 минуты нужно найти как можно больше слов из его букв. Каждый играет сам за себя.',
      en: 'A long word is shown — in 2 minutes, find as many words as possible from its letters. Everyone plays for themselves.',
    },
    minPlayers: 2, maxPlayers: 12, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['word'],
    howToPlay: {
      ru: ['Показывается длинное слово', 'За 2 минуты составьте как можно больше слов из его букв', 'Записывайте слова на бумаге', 'После таймера каждый сообщает свой счёт', 'Побеждает тот, кто нашёл больше слов'],
      en: ['A long word is displayed', 'In 2 minutes, form as many words as possible from its letters', 'Write words on paper', 'After the timer, each player reports their count', 'Whoever found the most words wins'],
    },
    commonMistakes: {
      ru: ['Используют буквы, которых нет в слове', 'Считают однобуквенные слова — обычно не считаются', 'Забывают записать слова — потом не вспомнить', 'Не следят за количеством букв — каждая буква используется столько раз, сколько она есть в слове'],
      en: ['Using letters not in the word', 'Counting single-letter words — usually not allowed', 'Forgetting to write words down — can\'t remember later', 'Not tracking letter counts — each letter can only be used as many times as it appears'],
    },
    component: AnagramGame,
  },
  {
    id: 'contact',
    name: 'Контакт',
    nameEn: 'Contact',
    emoji: '📡',
    tagline: {
      ru: 'Угадай слово ведущего через подсказки',
      en: 'Guess the leader\'s word through clues',
    },
    description: {
      ru: 'Ведущий загадывает слово и говорит первую букву. Остальные дают друг другу подсказки — если двое думают об одном слове, кричат «Контакт!» и ведущий открывает следующую букву.',
      en: 'The leader thinks of a word and says the first letter. Others give each other clues — if two think of the same word, they shout "Contact!" and the leader reveals the next letter.',
    },
    minPlayers: 3, maxPlayers: 12, duration: '15-30 min', difficulty: 'medium', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Ведущий загадывает слово и называет первую букву', 'Игроки дают подсказки друг другу', 'Если двое подумали об одном слове — «Контакт!»', 'Ведущий либо угадывает, либо открывает букву', 'Цель — угадать слово ведущего'],
      en: ['Leader thinks of a word and says the first letter', 'Players give clues to each other', 'If two think of the same word — "Contact!"', 'Leader either guesses or reveals a letter', 'Goal — guess the leader\'s word'],
    },
    commonMistakes: {
      ru: ['Подсказка слишком очевидная — ведущий легко угадает', 'Кричат «Контакт!» без реального совпадения', 'Ведущий слишком долго думает — установите лимит', 'Не считают открытые буквы — теряется прогресс'],
      en: ['Clue is too obvious — leader guesses easily', 'Shouting "Contact!" without a real match', 'Leader takes too long — set a time limit', 'Not tracking revealed letters — progress is lost'],
    },
    component: ContactGame,
  },
  {
    id: 'reverse-charades',
    name: 'Обратные шарады',
    nameEn: 'Reverse Charades',
    emoji: '🔄',
    tagline: {
      ru: 'Вся команда показывает — один угадывает',
      en: 'Whole team acts — one person guesses',
    },
    description: {
      ru: 'Как обычные шарады, но наоборот! Вся команда показывает слово жестами, а ОДИН человек угадывает.',
      en: 'Like regular charades, but reversed! The whole team acts out the word, and ONE person guesses.',
    },
    minPlayers: 4, maxPlayers: 20, duration: '20-40 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'creative'],
    howToPlay: {
      ru: ['Разделитесь на команды', 'Вся команда видит слово, кроме угадывающего', 'Команда показывает слово жестами', 'Один человек угадывает', 'Угадали — следующее слово. Время ограничено!'],
      en: ['Split into teams', 'Whole team sees the word, except the guesser', 'Team acts out the word together', 'One person guesses', 'Correct — next word. Time is limited!'],
    },
    commonMistakes: {
      ru: ['Угадывающий подглядывает на экран — отвернитесь!', 'Команда издаёт звуки — только жесты', 'Один человек показывает, а не вся команда', 'Не засекают время — без лимита игра затягивается'],
      en: ['Guesser peeks at the screen — look away!', 'Team makes sounds — gestures only', 'One person acts instead of the whole team', 'Not setting a timer — game drags without a limit'],
    },
    component: ReverseCharadesGame,
  },
  {
    id: 'tick-tock',
    name: 'Тик-Так Бум',
    nameEn: 'Tick Tock Boom',
    emoji: '💣',
    tagline: {
      ru: 'Скажи слово, пока бомба не взорвалась!',
      en: 'Say a word before the bomb explodes!',
    },
    description: {
      ru: 'Показывается слог — назовите слово с ним и передайте «бомбу» дальше. Таймер скрыт — бомба взрывается случайно! Кто держит бомбу при взрыве — выбывает.',
      en: 'A syllable is shown — say a word containing it and pass the "bomb". Timer is hidden — the bomb explodes randomly! Whoever holds it when it blows — is eliminated.',
    },
    minPlayers: 2, maxPlayers: 12, duration: '10-20 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Показывается слог или буквы', 'Назовите слово, подходящее под критерий', 'Передайте «бомбу» следующему', 'Бомба взрывается случайно (10-60 сек)', 'Кто держит бомбу при взрыве — выбывает'],
      en: ['A syllable or letters are shown', 'Say a word that fits the criteria', 'Pass the "bomb" to the next player', 'Bomb explodes randomly (10-60 sec)', 'Whoever holds the bomb — is eliminated'],
    },
    commonMistakes: {
      ru: ['Повторяют уже сказанные слова — нельзя', 'Слишком долго думают — бомба не ждёт!', 'Передают бомбу без слова — нужно назвать слово', 'Называют несуществующие слова — не считается'],
      en: ['Repeating already-said words — not allowed', 'Thinking too long — the bomb won\'t wait!', 'Passing without saying a word — must say one', 'Making up non-existent words — doesn\'t count'],
    },
    component: TickTockGame,
  },
  {
    id: 'one-night',
    name: 'Одна Ночь',
    nameEn: 'One Night Werewolf',
    emoji: '🐺',
    tagline: {
      ru: 'Одна ночь, одно голосование, одна жизнь',
      en: 'One night, one vote, one life',
    },
    description: {
      ru: 'Быстрая версия Мафии. Одна ночная фаза: оборотни видят друг друга, провидец проверяет, вор крадёт роль. Затем 5 минут обсуждения и одно голосование.',
      en: 'A fast Mafia variant. One night phase: werewolves see each other, seer checks, robber steals a role. Then 5-minute discussion and one vote.',
    },
    minPlayers: 4, maxPlayers: 8, duration: '10-15 min', difficulty: 'medium', hostMode: 'required',
    categories: ['party', 'detective'],
    howToPlay: {
      ru: ['Каждый получает роль: Оборотень, Провидец, Вор или Мирный', 'ОДНА ночь: оборотни видят друг друга, провидец проверяет, вор крадёт роль', '5 минут обсуждения', 'ОДНО голосование — большинством', 'Если оборотень выбыл — деревня победила'],
      en: ['Each player gets a role: Werewolf, Seer, Robber, or Villager', 'ONE night: werewolves see each other, seer checks, robber steals a role', '5-minute discussion', 'ONE vote — by majority', 'If a werewolf is eliminated — village wins'],
    },
    commonMistakes: {
      ru: ['Вор забывает, что его роль поменялась', 'Провидец сразу говорит, кого проверил — лучше подождать', 'Оборотни не запомнили друг друга — внимательнее ночью', 'Голосуют без обсуждения — используйте все 5 минут'],
      en: ['Robber forgets their role changed', 'Seer immediately reveals who they checked — better to wait', 'Werewolves didn\'t remember each other — pay attention at night', 'Voting without discussion — use all 5 minutes'],
    },
    component: OneNightGame,
  },
  {
    id: 'taboo',
    name: 'Табу',
    nameEn: 'Taboo',
    emoji: '🚫',
    tagline: {
      ru: 'Объясни слово, но не произноси запрещённые!',
      en: 'Explain the word without saying the forbidden ones!',
    },
    description: {
      ru: 'Командная игра, где нужно объяснить слово, не используя список запрещённых слов. Соперники следят за нарушениями!',
      en: 'A team game where you explain a word without using a list of forbidden words. Opponents watch for violations!',
    },
    minPlayers: 4, maxPlayers: 20, duration: '30-60 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Разделитесь на команды', 'Объясняющий видит слово и список запрещённых слов', 'Объясните слово, НЕ используя запрещённые', 'Угадали: +1, нарушение табу: -1, пропуск: 0', 'Побеждает команда, первой набравшая цель'],
      en: ['Split into teams', 'The explainer sees the word and a list of forbidden words', 'Explain the word WITHOUT using the forbidden ones', 'Correct: +1, taboo violation: -1, skip: 0', 'First team to reach the target score wins'],
    },
    commonMistakes: {
      ru: ['Произносят запрещённое слово случайно — будьте внимательны', 'Используют однокоренные формы запрещённых слов — это тоже нарушение', 'Соперники не следят за нарушениями — они должны быть судьями', 'Слишком долго объясняют одно слово — лучше пропустить'],
      en: ['Accidentally saying a forbidden word — pay attention', 'Using root forms of forbidden words — that counts as a violation', 'Opponents not monitoring — they should be the judges', 'Spending too long on one word — better to skip'],
    },
    component: TabooGame,
  },
  {
    id: 'spyfall',
    name: 'Находка',
    nameEn: 'Spyfall',
    emoji: '🕵️‍♂️',
    tagline: {
      ru: 'Найди шпиона среди нас!',
      en: 'Find the spy among us!',
    },
    description: {
      ru: 'Все игроки знают локацию, кроме одного — шпиона. Задавайте вопросы, чтобы вычислить шпиона, а шпион пытается понять, где все находятся.',
      en: 'All players know the location except one — the spy. Ask questions to identify the spy, while the spy tries to figure out the location.',
    },
    minPlayers: 4, maxPlayers: 8, duration: '10-15 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'detective'],
    howToPlay: {
      ru: ['Каждый получает карточку с локацией, кроме шпиона', 'Игроки задают друг другу вопросы о локации', 'Отвечайте расплывчато — шпион слушает!', 'Голосуйте за шпиона. Если угадали — он может попытаться назвать локацию', 'Шпион побеждает, если остался нераскрытым или угадал локацию'],
      en: ['Everyone gets a location card except the spy', 'Players ask each other questions about the location', 'Answer vaguely — the spy is listening!', 'Vote for the spy. If found — the spy can try to guess the location', 'Spy wins if undetected or if they guess the location correctly'],
    },
    commonMistakes: {
      ru: ['Слишком прямые вопросы — выдают локацию шпиону', 'Слишком расплывчатые ответы — выглядите как шпион', 'Шпион задаёт общие вопросы — это подозрительно', 'Забывают, что шпион может угадать локацию после голосования'],
      en: ['Too direct questions — reveal the location to the spy', 'Too vague answers — makes you look like the spy', 'Spy asks generic questions — that is suspicious', 'Forgetting that the spy can guess the location after voting'],
    },
    component: SpyfallGame,
  },
  {
    id: 'whoami',
    name: 'Кто я?',
    nameEn: 'Who Am I?',
    emoji: '🤔',
    tagline: {
      ru: 'Угадай, кто ты, задавая вопросы!',
      en: 'Guess who you are by asking questions!',
    },
    description: {
      ru: 'Каждому игроку назначается персонаж, которого видят все, кроме него. Задавайте вопросы «да/нет» и угадайте, кто вы!',
      en: 'Each player is assigned a character that everyone can see except them. Ask yes/no questions and guess who you are!',
    },
    minPlayers: 2, maxPlayers: 10, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party'],
    howToPlay: {
      ru: ['Каждому назначается персонаж (только другие видят)', 'На своём ходу задавайте вопросы «да» или «нет»', 'Попытайтесь угадать, кто вы', 'Угадали — вы выиграли! Не угадали — ход переходит дальше'],
      en: ['Each player gets a character (only others can see it)', 'On your turn, ask yes/no questions', 'Try to guess who you are', 'Guessed correctly — you win! Wrong — turn passes'],
    },
    commonMistakes: {
      ru: ['Задают открытые вопросы вместо «да/нет»', 'Подсказывают игроку напрямую — только да/нет', 'Угадывают слишком рано без достаточно вопросов', 'Показывают экран игроку, которому назначен персонаж'],
      en: ['Asking open questions instead of yes/no', 'Giving direct hints — only yes/no answers', 'Guessing too early without enough questions', 'Showing the screen to the player who has the character'],
    },
    component: WhoAmIGame,
  },
  {
    id: 'scattergories',
    name: 'Эрудит',
    nameEn: 'Scattergories',
    emoji: '📝',
    tagline: {
      ru: 'Придумай уникальные слова на букву!',
      en: 'Think of unique words starting with a letter!',
    },
    description: {
      ru: 'Выпадает случайная буква и категории. Придумайте уникальные слова на эту букву для каждой категории. Совпавшие ответы не считаются!',
      en: 'A random letter and categories appear. Think of unique words starting with that letter for each category. Duplicate answers don\'t count!',
    },
    minPlayers: 2, maxPlayers: 8, duration: '15-30 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Появляется случайная буква и 5 категорий', 'За 2 минуты придумайте слова на эту букву', 'Зачитайте ответы — одинаковые вычёркиваются', 'Уникальный ответ = 1 очко', 'Побеждает набравший больше очков за все раунды'],
      en: ['A random letter and 5 categories appear', 'In 2 minutes, think of words starting with that letter', 'Read answers aloud — duplicates are crossed out', 'Unique answer = 1 point', 'Highest total score across all rounds wins'],
    },
    commonMistakes: {
      ru: ['Пишут слова не на заданную букву — не считается', 'Не вычёркивают одинаковые ответы — это ключевое правило', 'Пишут слишком общие слова — высок шанс совпадения', 'Подглядывают ответы соседа — играйте честно'],
      en: ['Writing words that don\'t start with the letter — doesn\'t count', 'Not crossing out duplicate answers — this is a key rule', 'Writing too common words — high chance of duplicates', 'Peeking at neighbors\' answers — play fair'],
    },
    component: ScattergoriesGame,
  },
  {
    id: 'cities',
    name: 'Города',
    nameEn: 'Cities',
    emoji: '🏙️',
    tagline: {
      ru: 'Назови город на последнюю букву!',
      en: 'Name a city starting with the last letter!',
    },
    description: {
      ru: 'Классическая игра в города. Называйте город на последнюю букву предыдущего. Не успел — выбываешь!',
      en: 'A classic last-letter city game. Name a city starting with the last letter of the previous one. Too slow — you\'re out!',
    },
    minPlayers: 2, maxPlayers: 10, duration: '10-20 min', difficulty: 'easy', hostMode: 'none',
    categories: ['party', 'word'],
    howToPlay: {
      ru: ['Первый игрок называет любой город', 'Следующий называет город на последнюю букву', 'Нельзя повторять города', 'Не успел за отведённое время — выбываешь', 'Последний оставшийся побеждает'],
      en: ['First player names any city', 'Next player names a city starting with the last letter', 'No repeating cities', 'Run out of time — you\'re eliminated', 'Last player standing wins'],
    },
    commonMistakes: {
      ru: ['Называют не города, а страны — только города', 'Повторяют город, который уже был — запрещено', 'Путают последнюю букву — будьте внимательны с ь/ъ/ы', 'Затягивают время — для этого есть таймер'],
      en: ['Naming countries instead of cities — cities only', 'Repeating a city that was already said — forbidden', 'Getting the last letter wrong — pay attention', 'Taking too long — that is what the timer is for'],
    },
    component: CitiesGame,
  },
]

// Export games with current language support
// Components read lang from useI18n hook and use L(ru, en) pattern
export function getGames(lang: string): GameInfo[] {
  const isRu = lang === 'ru'
  return gamesData.map(g => ({
    ...g,
    name: isRu ? g.name : g.nameEn,
    nameAlt: isRu ? g.nameEn : g.name,
    tagline: isRu ? g.tagline.ru : g.tagline.en,
    description: isRu ? g.description.ru : g.description.en,
    howToPlay: isRu ? g.howToPlay.ru : g.howToPlay.en,
    commonMistakes: isRu ? g.commonMistakes.ru : g.commonMistakes.en,
  }))
}

// Default export for backward compat — uses English
export const games = getGames('en')
