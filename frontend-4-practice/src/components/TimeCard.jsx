// Блок «Доступное время»: сетка кнопок-слотов на выбранный день.
// Получает список слотов, флаг загрузки, ошибку и колбэк onTimeClick.
// Ничего не хранит сам — только отрисовывает то, что передано.
function TimeCard({ slots, selectedTime, onTimeClick, loading, error }) {
  return (
    <section className="time-card" aria-labelledby="time-title">
      <h2 className="time-card__title" id="time-title">
        Доступное время
      </h2>

      {/* Загрузка слотов — показываем заглушку. */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#9d9d9d",
            fontSize: "16px",
          }}
        >
          Загрузка слотов…
        </div>
      )}

      {/* Ошибка загрузки слотов — показываем сообщение. */}
      {!loading && error && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#c00",
            fontSize: "16px",
          }}
        >
          Ошибка загрузки слотов: {error}
        </div>
      )}

      {/* Слоты — если данные загружены и ошибки нет. */}
      {!loading && !error && (
        <div
          className="time-card__slots"
          role="group"
          aria-label="Время записи"
        >
          {!slots || slots.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#9d9d9d",
                fontSize: "16px",
              }}
            >
              В этот день нет доступного времени
            </div>
          ) : (
            slots.map((slot) => {
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
            })
          )}
        </div>
      )}
    </section>
  );
}

export default TimeCard;
