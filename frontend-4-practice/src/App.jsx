import { useState, useEffect } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CalendarCard from "./components/CalendarCard";
import TimeCard from "./components/TimeCard";
import SelectionBar from "./components/SelectionBar";

import { fetchToday, fetchSlots } from "./api";
import { MONTHS_NOMINATIVE } from "./utils/date";

import "./index.css";

// App — корневой компонент страницы выбора даты и времени.
// Все данные теперь приходят с сервера через /api/* эндпоинты:
//
//   GET /api/booking/today   — «сегодня» по мнению сервера
//   GET /api/slots?...       — слоты на указанную дату
//
// Состояние разделяется на две части:
//
//   1. Загрузка today (инициализация календаря при открытии)
//   2. Загрузка слотов (при первой загрузке и при смене дня)
//
// Каждая загрузка имеет три состояния: loading → error | data.
function App() {
  // ==========================================================================
  // Состояние загрузки «сегодня» с сервера
  // ==========================================================================

  // today — дата «сегодня» по мнению сервера. null, пока не загрузилось.
  const [today, setToday] = useState(null);

  // loadingToday — идёт ли загрузка today. Пока true — показываем заглушку
  // на всю страницу, потому что без today календарь бессмысленный.
  const [loadingToday, setLoadingToday] = useState(true);

  // errorToday — ошибка загрузки today.
  const [errorToday, setErrorToday] = useState(null);

  // ==========================================================================
  // Состояние страницы (то, что выбрал пользователь)
  // ==========================================================================

  // currentMonth / currentYear — какой месяц показан в календаре.
  // Изначально null. Реальные значения поставим, когда придёт today.
  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  // selectedDay — выбранный день месяца.
  const [selectedDay, setSelectedDay] = useState(null);

  // selectedTime — выбранное время ("12:00" или null).
  const [selectedTime, setSelectedTime] = useState(null);

  // ==========================================================================
  // Состояние слотов
  // ==========================================================================

  // slots — массив слотов на выбранный день.
  const [slots, setSlots] = useState([]);

  // loadingSlots — идёт ли загрузка слотов.
  const [loadingSlots, setLoadingSlots] = useState(true);

  // errorSlots — ошибка загрузки слотов.
  const [errorSlots, setErrorSlots] = useState(null);

  // ==========================================================================
  // Загрузка today при открытии страницы
  // ==========================================================================
  useEffect(() => {
    async function load() {
      try {
        setLoadingToday(true);
        setErrorToday(null);
        const data = await fetchToday();
        setToday(data);

        // Ставим начальный месяц, год и день из today.
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay(data.day);
      } catch (err) {
        setErrorToday(err.message);
      } finally {
        setLoadingToday(false);
      }
    }

    load();
  }, []);

  // ==========================================================================
  // Загрузка слотов при смене дня (и при первой загрузке today)
  // ==========================================================================
  //
  // useEffect следит за selectedDay, currentMonth и currentYear.
  // Пока selectedDay = null (today ещё не пришёл) — ничего не делаем.
  // Как только появятся все параметры — запрашиваем слоты.
  //
  // При клике на другой день selectedDay меняется → useEffect срабатывает
  // заново → слоты перезагружаются.
  useEffect(() => {
    // Если ещё нет дня — ждём.
    if (!selectedDay || currentMonth === null || currentYear === null) {
      return;
    }

    async function load() {
      try {
        setLoadingSlots(true);
        setErrorSlots(null);
        const response = await fetchSlots({
          day: selectedDay,
          month: currentMonth,
          year: currentYear,
        });
        setSlots(response.slots);
      } catch (err) {
        setErrorSlots(err.message);
      } finally {
        setLoadingSlots(false);
      }
    }

    load();
  }, [selectedDay, currentMonth, currentYear]);

  // ==========================================================================
  // Обработчики
  // ==========================================================================

  // Клик по дню. Меняем выбранный день, сбрасываем время.
  // Слоты подгрузятся автоматически — за это отвечает useEffect выше.
  function handleDayClick(day) {
    setSelectedDay(day);
    setSelectedTime(null);
  }

  // Клик по слоту — сохраняем время.
  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  // Стрелка «‹» — месяц назад.
  function handlePrevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  // Стрелка «›» — месяц вперёд.
  function handleNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  // ==========================================================================
  // Рендер
  // ==========================================================================

  // Пока грузится today — показываем заглушку на всю страницу.
  // Без today мы не знаем, какой месяц показывать.
  if (loadingToday) {
    return (
      <div className="booking-page">
        <Header />
        <main className="booking-main">
          <div className="booking-main__inner">
            <div className="page-heading">
              <h1 className="page-heading__title">
                Выберите дату и время записи
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                color: "#9d9d9d",
                fontSize: "16px",
              }}
            >
              Загрузка…
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ошибка загрузки today — сообщение об ошибке, не бесконечная загрузка.
  if (errorToday) {
    return (
      <div className="booking-page">
        <Header />
        <main className="booking-main">
          <div className="booking-main__inner">
            <div className="page-heading">
              <h1 className="page-heading__title">
                Выберите дату и время записи
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                color: "#c00",
                fontSize: "16px",
              }}
            >
              Ошибка загрузки: {errorToday}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // today загрузился, состояние инициализировано — можно рендерить
  // полноценный экран.
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
              today={today}
              onDayClick={handleDayClick}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <TimeCard
              slots={slots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
              loading={loadingSlots}
              error={errorSlots}
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
