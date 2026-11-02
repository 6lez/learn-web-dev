// Подвал сайта: бренд, контакты, режим работы, авторские права.
function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__columns">
          <div className="footer-brand">
            <div className="footer-brand__logo" aria-label="SABY Барбершоп">
              <span className="footer-brand__accent">SABY</span>
              <span className="footer-brand__name">БАРБЕРШОП</span>
            </div>
            <p className="footer-brand__tagline">Мы тут стрижём!</p>
          </div>

          <section className="footer-info" aria-labelledby="contacts-title">
            <h2 className="footer-info__heading" id="contacts-title">
              Контакты
            </h2>
            <p className="footer-info__line">
              <svg
                className="footer-info__icon"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 18s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10Z" />
                <circle cx="10" cy="8" r="2" />
              </svg>
              <span className="footer-info__address">
                г. Екатеринбург, ул. Ленина, 51
              </span>
            </p>
            <p className="footer-info__line">
              <svg
                className="footer-info__icon"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M4.1 2.5h3l1.3 4-2 1.4a12 12 0 0 0 5.7 5.7l1.4-2 4 1.3v3c0 1-.8 1.8-1.8 1.8A13.7 13.7 0 0 1 2.3 4.3c0-1 .8-1.8 1.8-1.8Z" />
              </svg>
              <a
                className="footer-info__phone"
                href="tel:+74951234567"
              >
                +7 (495) 123-45-67
              </a>
            </p>
          </section>

          <section className="footer-hours" aria-labelledby="hours-title">
            <h2 className="footer-hours__heading" id="hours-title">
              Режим работы
            </h2>
            <p className="footer-hours__line">Пн–Пт: 9:00 – 21:00</p>
            <p className="footer-hours__line">Сб–Вс: 10:00 – 19:00</p>
          </section>
        </div>

        <div className="site-footer__bottom">
          <small className="site-footer__copyright">
            © 2026. Все права защищены.
          </small>
          <span className="site-footer__policy">
            Политика конфиденциальности
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
