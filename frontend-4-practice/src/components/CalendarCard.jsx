import {
  buildCalendarDays,
  isDateSelectable,
  MONTHS_NOMINATIVE,
  MONTHS_GENITIVE,
} from "../utils/date";

// Календарь: заголовок с месяцем, стрелки навигации, дни недели, сетка дат.
function CalendarCard({
  currentMonth,
  currentYear,
  selectedDay,
  today,
  onDayClick,
  onPrevMonth,
  onNextMonth,
}) {
  // Сетка считается прямо в теле компонента — при смене пропсов
  // currentMonth/currentYear React перерендерит компонент,
  // buildCalendarDays вернёт новый массив, и сетка обновится.
  const weeks = buildCalendarDays(currentYear, currentMonth);

  return (
    <section className="calendar-card" aria-labelledby="calendar-title">
      <div className="calendar-card__top">
        <h2 className="calendar-card__title" id="calendar-title">
          {MONTHS_NOMINATIVE[currentMonth]} {currentYear}
        </h2>
        <div className="calendar-card__controls">
          <button
            className="month-button month-button--prev"
            type="button"
            aria-label="Предыдущий месяц"
            onClick={onPrevMonth}
          >
            <svg
              className="month-button__icon"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="m10 4-4 4 4 4" />
            </svg>
          </button>
          <button
            className="month-button month-button--next"
            type="button"
            aria-label="Следующий месяц"
            onClick={onNextMonth}
          >
            <svg
              className="month-button__icon"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="m6 4 4 4-4 4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="calendar-card__weekdays" aria-hidden="true">
        <span className="calendar-card__weekday">Пн</span>
        <span className="calendar-card__weekday">Вт</span>
        <span className="calendar-card__weekday">Ср</span>
        <span className="calendar-card__weekday">Чт</span>
        <span className="calendar-card__weekday">Пт</span>
        <span className="calendar-card__weekday">Сб</span>
        <span className="calendar-card__weekday">Вс</span>
      </div>

      <div className="calendar-card__dates" role="group" aria-label="Доступные даты">
        {weeks.map((cell, index) => {
          let classes = "calendar-date";

          if (cell.otherMonth) {
            classes += " calendar-date--outside";
            return (
              <span
                className={classes}
                key={index}
                aria-hidden="true"
              >
                {cell.day}
              </span>
            );
          }

          const isSelected = cell.day === selectedDay;
          const selectable = isDateSelectable(cell.day, currentMonth, currentYear, today);

          if (!selectable) {
            classes += " calendar-date--past";
            return (
              <button
                className={classes}
                type="button"
                disabled
                key={index}
                aria-label={
                  cell.day +
                  " " +
                  MONTHS_GENITIVE[currentMonth] +
                  " " +
                  currentYear +
                  " года, недоступно"
                }
              >
                {cell.day}
              </button>
            );
          }

          classes += " calendar-date--available";
          if (isSelected) classes += " calendar-date--selected";

          return (
            <button
              className={classes}
              type="button"
              key={index}
              data-day={cell.day}
              aria-label={
                cell.day +
                " " +
                MONTHS_GENITIVE[currentMonth] +
                " " +
                currentYear +
                " года"
              }
              aria-pressed={isSelected}
              onClick={() => onDayClick(cell.day)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarCard;
