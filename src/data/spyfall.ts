// Spyfall game data

export interface SpyfallLocation {
  name: string
  nameEn: string
  roles: string[]
  rolesEn: string[]
}

export const spyfallLocations: SpyfallLocation[] = [
  {
    name: 'Больница',
    nameEn: 'Hospital',
    roles: ['Хирург', 'Медсестра', 'Пациент', 'Анестезиолог', 'Санитар'],
    rolesEn: ['Surgeon', 'Nurse', 'Patient', 'Anesthesiologist', 'Orderly'],
  },
  {
    name: 'Школа',
    nameEn: 'School',
    roles: ['Учитель', 'Ученик', 'Директор', 'Уборщица', 'Школьный психолог', 'Охранник'],
    rolesEn: ['Teacher', 'Student', 'Principal', 'Janitor', 'School Counselor', 'Security Guard'],
  },
  {
    name: 'Ресторан',
    nameEn: 'Restaurant',
    roles: ['Шеф-повар', 'Официант', 'Гость', 'Бармен', 'Сомелье', 'Критик'],
    rolesEn: ['Head Chef', 'Waiter', 'Guest', 'Bartender', 'Sommelier', 'Food Critic'],
  },
  {
    name: 'Космическая станция',
    nameEn: 'Space Station',
    roles: ['Командир', 'Бортинженер', 'Учёный', 'Пилот', 'Врач экипажа'],
    rolesEn: ['Commander', 'Flight Engineer', 'Scientist', 'Pilot', 'Crew Doctor'],
  },
  {
    name: 'Пиратский корабль',
    nameEn: 'Pirate Ship',
    roles: ['Капитан', 'Штурман', 'Боцман', 'Канонир', 'Пленник', 'Кок'],
    rolesEn: ['Captain', 'Navigator', 'Bosun', 'Cannoneer', 'Prisoner', 'Cook'],
  },
  {
    name: 'Казино',
    nameEn: 'Casino',
    roles: ['Крупье', 'Игрок', 'Охранник', 'Владелец', 'Бармен'],
    rolesEn: ['Croupier', 'Gambler', 'Security Guard', 'Owner', 'Bartender'],
  },
  {
    name: 'Цирк',
    nameEn: 'Circus',
    roles: ['Клоун', 'Акробат', 'Дрессировщик', 'Жонглёр', 'Зритель', 'Директор цирка'],
    rolesEn: ['Clown', 'Acrobat', 'Animal Trainer', 'Juggler', 'Spectator', 'Ringmaster'],
  },
  {
    name: 'Аэропорт',
    nameEn: 'Airport',
    roles: ['Пилот', 'Стюардесса', 'Пассажир', 'Таможенник', 'Диспетчер', 'Грузчик'],
    rolesEn: ['Pilot', 'Flight Attendant', 'Passenger', 'Customs Officer', 'Air Traffic Controller', 'Baggage Handler'],
  },
  {
    name: 'Полицейский участок',
    nameEn: 'Police Station',
    roles: ['Детектив', 'Следователь', 'Задержанный', 'Дежурный', 'Адвокат'],
    rolesEn: ['Detective', 'Investigator', 'Suspect', 'Duty Officer', 'Lawyer'],
  },
  {
    name: 'Киностудия',
    nameEn: 'Movie Studio',
    roles: ['Режиссёр', 'Актёр', 'Оператор', 'Гримёр', 'Каскадёр', 'Продюсер'],
    rolesEn: ['Director', 'Actor', 'Camera Operator', 'Makeup Artist', 'Stunt Double', 'Producer'],
  },
  {
    name: 'Подводная лодка',
    nameEn: 'Submarine',
    roles: ['Капитан', 'Штурман', 'Радист', 'Механик', 'Кок'],
    rolesEn: ['Captain', 'Navigator', 'Radio Operator', 'Mechanic', 'Cook'],
  },
  {
    name: 'Университет',
    nameEn: 'University',
    roles: ['Профессор', 'Студент', 'Декан', 'Лаборант', 'Библиотекарь', 'Аспирант'],
    rolesEn: ['Professor', 'Student', 'Dean', 'Lab Assistant', 'Librarian', 'Graduate Student'],
  },
  {
    name: 'Музей',
    nameEn: 'Museum',
    roles: ['Экскурсовод', 'Охранник', 'Посетитель', 'Реставратор', 'Куратор'],
    rolesEn: ['Tour Guide', 'Security Guard', 'Visitor', 'Restorer', 'Curator'],
  },
  {
    name: 'Поезд',
    nameEn: 'Train',
    roles: ['Машинист', 'Проводник', 'Пассажир', 'Контролёр', 'Ревизор', 'Повар в вагоне-ресторане'],
    rolesEn: ['Train Driver', 'Conductor', 'Passenger', 'Ticket Inspector', 'Auditor', 'Dining Car Chef'],
  },
  {
    name: 'Спортзал',
    nameEn: 'Gym',
    roles: ['Тренер', 'Клиент', 'Администратор', 'Уборщик', 'Диетолог'],
    rolesEn: ['Personal Trainer', 'Client', 'Receptionist', 'Janitor', 'Nutritionist'],
  },
  {
    name: 'Свадьба',
    nameEn: 'Wedding',
    roles: ['Жених', 'Невеста', 'Свидетель', 'Фотограф', 'Тамада', 'Гость'],
    rolesEn: ['Groom', 'Bride', 'Best Man', 'Photographer', 'Master of Ceremonies', 'Guest'],
  },
  {
    name: 'Замок',
    nameEn: 'Castle',
    roles: ['Король', 'Рыцарь', 'Придворный шут', 'Стражник', 'Принцесса', 'Слуга'],
    rolesEn: ['King', 'Knight', 'Court Jester', 'Guard', 'Princess', 'Servant'],
  },
  {
    name: 'Яхта',
    nameEn: 'Yacht',
    roles: ['Капитан', 'Матрос', 'Владелец', 'Гость', 'Стюард'],
    rolesEn: ['Captain', 'Sailor', 'Owner', 'Guest', 'Steward'],
  },
  {
    name: 'Супермаркет',
    nameEn: 'Supermarket',
    roles: ['Кассир', 'Покупатель', 'Охранник', 'Мерчендайзер', 'Управляющий', 'Грузчик'],
    rolesEn: ['Cashier', 'Shopper', 'Security Guard', 'Merchandiser', 'Manager', 'Stock Clerk'],
  },
  {
    name: 'Банк',
    nameEn: 'Bank',
    roles: ['Менеджер', 'Кассир', 'Клиент', 'Охранник', 'Инкассатор'],
    rolesEn: ['Manager', 'Teller', 'Client', 'Security Guard', 'Cash-in-transit Officer'],
  },
]
