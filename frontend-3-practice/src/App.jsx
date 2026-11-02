import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CalendarCard from "./components/CalendarCard";
import TimeCard from "./components/TimeCard";
import SelectionBar from "./components/SelectionBar";

import { TODAY } from "./utils/date";
import { getSlotsForDay } from "./data/slots";

import "./index.css";

function App() {
  // today — дата «сейчас». Дни раньше неё нельзя выбирать.
  const today = TODAY;

  // Состояние календаря.
  const [currentMonth, setCurrentMonth] = useState(today.month);
  const [currentYear, setCurrentYear] = useState(today.year);

  // Состояние выбора.
  const [selectedDay, setSelectedDay] = useState(today.day);
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты на выбранный день. Изначально — слоты на сегодня.
  const [slots, setSlots] = useState(getSlotsForDay(today.day));

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Клик по дню: выбираем день, сбрасываем время, подгружаем новые слоты.
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
    setSlots(getSlotsForDay(day));
  }

  // Клик по слоту времени.
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Стрелка «‹» — месяц назад (с переходом через границу года).
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  // Стрелка «›» — месяц вперёд (с переходом через границу года).
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  return (
    <div className="booking-page">
      <Header />

      <main className="booking-main">
        <div className="booking-main__inner">
          <div className="page-heading">
            <button
              className="page-heading__back"
              type="button"
              aria-label="Назад к выбору услуг"
            >
              <svg
                className="page-heading__back-icon"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path d="M20 8 8 20l12 12" />
                <path d="M9 20h21c7 0 11 4 11 10s-4 10-11 10H9" />
              </svg>
            </button>
            <h1 className="page-heading__title">
              Выберите дату и время записи
            </h1>
          </div>

          <div className="booking-panels">
            <CalendarCard
              currentMonth={currentMonth}
              currentYear={currentYear}
              selectedDay={selectedDay}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeCard
              selectedDay={selectedDay}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <SelectionBar
            selectedDay={selectedDay}
            currentMonth={currentMonth}
            currentYear={currentYear}
            selectedTime={selectedTime}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
