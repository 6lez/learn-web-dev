export const MONTHS_NOMINATIVE = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Названия месяцев в родительном падеже — для нижней панели («15 июня 2025»).
export const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

// Дни недели. Порядок — как у getDay(): 0 = воскресенье.
export const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// «Сегодня» — взято из реального времени браузера.
export const TODAY_DATE = new Date();
export const TODAY = {
  day: TODAY_DATE.getDate(),
  month: TODAY_DATE.getMonth(), // 0-индексный (0 = январь)
  year: TODAY_DATE.getFullYear(),
};

// compareDates — сравнивает две даты без времени.
// Возвращает -1, 0 или 1.
export function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// isDateSelectable — можно ли выбрать указанный день.
// Раньше today выбирать нельзя.
export function isDateSelectable(day, month, year) {
  return compareDates({ day, month, year }, TODAY) >= 0;
}

// buildCalendarGrid — строит плоский массив ячеек календаря для месяца.
// Каждая ячейка: { day, otherMonth }.
// otherMonth: true  → день из соседнего месяца (серый, некликабельный)
// otherMonth: false → день из текущего месяца
export function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startDayOfWeek = firstDay.getDay(); // 0 = воскресенье
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // неделя с Пн

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }

  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  return cells;
}
