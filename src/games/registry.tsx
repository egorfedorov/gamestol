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

interface BilingualGameInfo extends Omit<GameInfo, 'tagline' | 'description' | 'howToPlay' | 'commonMistakes'> {
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
]

// Export games with current language support
// Components read lang from useI18n hook and use L(ru, en) pattern
export function getGames(lang: string): GameInfo[] {
  const isRu = lang === 'ru'
  return gamesData.map(g => ({
    ...g,
    tagline: isRu ? g.tagline.ru : g.tagline.en,
    description: isRu ? g.description.ru : g.description.en,
    howToPlay: isRu ? g.howToPlay.ru : g.howToPlay.en,
    commonMistakes: isRu ? g.commonMistakes.ru : g.commonMistakes.en,
  }))
}

// Default export for backward compat — uses English
export const games = getGames('en')
