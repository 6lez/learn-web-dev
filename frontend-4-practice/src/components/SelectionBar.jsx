import {
  DAYS_OF_WEEK,
  MONTHS_GENITIVE,
} from "../utils/date";

// Нижняя панель: показывает выбранную дату и время, кнопка «Продолжить».
function SelectionBar({
  selectedDay,
  currentMonth,
  currentYear,
  selectedTime,
}) {
  const dateObj = new Date(currentYear, currentMonth, selectedDay);
  const dayName = DAYS_OF_WEEK[dateObj.getDay()];
  const monthName = MONTHS_GENITIVE[currentMonth];

  const timePart = selectedTime ? selectedTime : "время не выбрано";

  return (
    <div className="selection-bar" aria-label="Выбранная запись">
      <div className="selection-bar__details">
        <p className="selection-bar__label">Выбрано</p>
        <p className="selection-bar__value">
          <time className="selection-bar__date">
            {dayName}, {selectedDay} {monthName} {currentYear} • {timePart}
          </time>
          <span className="selection-bar__master">(Мастер: Марина)</span>
        </p>
      </div>
      <button className="selection-bar__button" type="button">
        Продолжить
      </button>
    </div>
  );
}

export default SelectionBar;
