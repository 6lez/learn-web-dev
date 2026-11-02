import { useState } from "react";
import { getSlotsForDay } from "../data/slots";

// Блок «Доступное время»: сетка кнопок-слотов на выбранный день.
function TimeCard({ selectedDay, selectedTime, onTimeClick }) {
  const [slots, setSlots] = useState(getSlotsForDay(selectedDay));

  // Перезагружаем слоты при смене дня.
  if (slots.length === 0) {
    setSlots(getSlotsForDay(selectedDay));
  }

  return (
    <section className="time-card" aria-labelledby="time-title">
      <h2 className="time-card__title" id="time-title">
        Доступное время
      </h2>
      <div
        className="time-card__slots"
        role="group"
        aria-label="Время записи"
      >
        {slots.map((slot) => {
          let classes = "time-slot";
          if (!slot.available) classes += " time-slot--busy";
          if (slot.time === selectedTime && slot.available) {
            classes += " time-slot--selected";
          }

          return (
            <button
              className={classes}
              type="button"
              data-time={slot.time}
              disabled={!slot.available}
              key={slot.time}
              onClick={() => {
                if (slot.available) {
                  onTimeClick(slot.time);
                }
              }}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default TimeCard;
