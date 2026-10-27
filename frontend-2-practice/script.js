// ============================================================
// 1. ДАННЫЕ
// ============================================================

const TODAY_DATE = new Date();
const TODAY = {
  day: TODAY_DATE.getDate(),
  month: TODAY_DATE.getMonth(),
  year: TODAY_DATE.getFullYear(),
};

// Слоты времени для чт/нечт дней (сделал что то типо имитации сервера, заполненности).
const SLOTS_EVEN_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "12:00", available: false },
  { time: "13:00", available: false },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

const SLOTS_ODD_DAY = [
  { time: "10:00", available: true },
  { time: "11:00", available: false },
  { time: "12:00", available: true },
  { time: "13:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: false },
  { time: "17:00", available: true },
];

function getSlotsForDay(day) {
  const isEven = day % 2 === 0;
  return isEven ? SLOTS_EVEN_DAY : SLOTS_ODD_DAY;
}

// ============================================================
// 2. СОСТОЯНИЕ
// ============================================================

const state = {
  currentMonth: TODAY.month,
  currentYear: TODAY.year,
  selectedDay: TODAY.day,
  selectedTime: null,
};

// ============================================================
// 3. ФУНКЦИИ
// ============================================================

const MONTHS_NOMINATIVE = [
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

const MONTHS_GENITIVE = [
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

const DAYS_OF_WEEK = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function compareDates(date1, date2) {
  const d1 = new Date(date1.year, date1.month, date1.day);
  const d2 = new Date(date2.year, date2.month, date2.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Не раньше сегодня открывашки.
function isDateSelectable(day, month, year) {
  return compareDates({ day, month, year }, TODAY) >= 0;
}

// Сетка календаря -месяц.
function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const startDayOfWeek = firstDay.getDay(); // 0 -воскресенье
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Понедельник

  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  // Дни прошлого месяца (хвост).
  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  // Дни текущего месяца.
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  // Заполняем еще дни чтобы было все ровно
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  return cells;
}

// ============================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// ============================================================

const calendarTitleEl = document.querySelector("#calendar-title");
const calendarGridEl = document.querySelector(".calendar-card__dates");
const timeSlotsEl = document.querySelector(".time-card__slots");
const bottomBarDateEl = document.querySelector(".selection-bar__date");

// Рендерит календарь на текущий месяц
function renderCalendar() {
  const year = state.currentYear;
  const month = state.currentMonth;

  calendarTitleEl.textContent = MONTHS_NOMINATIVE[month] + " " + year;

  const cells = buildCalendarDays(year, month);

  let html = "";
  cells.forEach(function (cell) {
    let classes = "calendar-date";

    if (cell.otherMonth) {
      classes += " calendar-date--outside";
      html +=
        '<span class="' +
        classes +
        '" aria-hidden="true">' +
        cell.day +
        "</span>";
      return;
    }

    const isSelected =
      cell.day === state.selectedDay &&
      month === state.currentMonth &&
      year === state.currentYear;
    const selectable = isDateSelectable(cell.day, month, year);

    if (!selectable) {
      classes += " calendar-date--past";
      html +=
        '<button class="' +
        classes +
        '" type="button" disabled aria-label="' +
        cell.day +
        " " +
        MONTHS_GENITIVE[month] +
        " " +
        year +
        'года, недоступно">' +
        cell.day +
        "</button>";
      return;
    }

    classes += " calendar-date--available";
    if (isSelected) classes += " calendar-date--selected";

    html +=
      '<button class="' +
      classes +
      '" type="button" data-day="' +
      cell.day +
      '" aria-label="' +
      cell.day +
      " " +
      MONTHS_GENITIVE[month] +
      " " +
      year +
      'года" aria-pressed="' +
      isSelected +
      '">' +
      cell.day +
      "</button>";
  });

  calendarGridEl.innerHTML = html;
  const dayButtons = calendarGridEl.querySelectorAll(
    '.calendar-date--available:not([disabled])'
  );
  dayButtons.forEach(function (btn) {
    btn.addEventListener("click", onDayClick);
  });
}

function renderTimeSlots() {
  const slots = getSlotsForDay(state.selectedDay);

  if (!slots || slots.length === 0) {
    timeSlotsEl.innerHTML =
      '<div style="text-align:center; padding:40px; color:#9d9d9d; font-size:16px;">В этот день нет доступного времени</div>';
    return;
  }

  let html = "";
  slots.forEach(function (slot) {
    let classes = "time-slot";
    if (!slot.available) classes += " time-slot--busy";
    if (slot.time === state.selectedTime && slot.available) {
      classes += " time-slot--selected";
    }

    html +=
      '<button class="' +
      classes +
      '" type="button" data-time="' +
      slot.time +
      '"' +
      (slot.available ? "" : " disabled") +
      '>' +
      slot.time +
      "</button>";
  });

  timeSlotsEl.innerHTML = html;

  const slotButtons = timeSlotsEl.querySelectorAll(
    ".time-slot:not([disabled])"
  );
  slotButtons.forEach(function (btn) {
    btn.addEventListener("click", onTimeSlotClick);
  });
}

function updateBottomBar() {
  const day = state.selectedDay;
  const month = state.currentMonth;
  const year = state.currentYear;

  const dateObj = new Date(year, month, day);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[month];

  const timePart = state.selectedTime
    ? state.selectedTime
    : "время не выбрано";

  bottomBarDateEl.textContent =
    dayName + ", " + day + " " + monthName + " " + year + " • " + timePart;
}

// ============================================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================================

function onDayClick(event) {
  const btn = event.currentTarget;
  const day = parseInt(btn.dataset.day, 10);

  state.selectedDay = day;
  // Сбрасываем время
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const btn = event.currentTarget;
  state.selectedTime = btn.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  const prevBtn = document.querySelector(".month-button:first-of-type");
  const nextBtn = document.querySelector(".month-button:last-of-type");

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      state.currentMonth -= 1;
      if (state.currentMonth < 0) {
        state.currentMonth = 11;
        state.currentYear -= 1;
      }
      renderCalendar();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      state.currentMonth += 1;
      if (state.currentMonth > 11) {
        state.currentMonth = 0;
        state.currentYear += 1;
      }
      renderCalendar();
    });
  }
}

// ============================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// ============================================================

function init() {
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});
