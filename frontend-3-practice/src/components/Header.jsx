// Шапка сайта: логотип SABY Барбершоп и индикатор этапов записи.
function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-brand" aria-label="SABY Барбершоп">
          <span className="site-brand__accent">SABY</span>
          <span className="site-brand__name">БАРБЕРШОП</span>
        </div>

        <nav className="booking-steps" aria-label="Этапы записи">
          <ol className="booking-steps__list">
            <li className="booking-steps__step booking-steps__step--done">
              <span className="booking-steps__bar" aria-hidden="true" />
              <span className="visually-hidden">Выбор мастера — пройден</span>
            </li>
            <li className="booking-steps__step booking-steps__step--done">
              <span className="booking-steps__bar" aria-hidden="true" />
              <span className="visually-hidden">Выбор услуг — пройден</span>
            </li>
            <li
              className="booking-steps__step booking-steps__step--current"
              aria-current="step"
            >
              <span className="booking-steps__bar" aria-hidden="true" />
              <span className="visually-hidden">Дата и время — текущий этап</span>
            </li>
            <li className="booking-steps__step">
              <span className="booking-steps__bar" aria-hidden="true" />
              <span className="visually-hidden">Контактные данные</span>
            </li>
            <li className="booking-steps__step">
              <span className="booking-steps__bar" aria-hidden="true" />
              <span className="visually-hidden">Подтверждение записи</span>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  );
}

export default Header;
