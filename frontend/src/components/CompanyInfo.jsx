import { COMPANY as C } from '../data/content.js';

const licenseText = `Лицензия № ${C.license.number} от ${C.license.date}, выдана ${C.license.issuer}, на осуществление медицинской деятельности ${C.license.works}.`;

/** variant="footer" — компактный блок для подвала; "full" — таблица реквизитов для страниц. */
export default function CompanyInfo({ variant = 'full' }) {
  if (variant === 'footer') {
    return (
      <address className="company-info company-footer">
        <strong>{C.fullName}</strong>
        <span>Юридический адрес: {C.legalAddress}</span>
        <span>ОГРН {C.ogrn} · ИНН {C.inn}</span>
        <span>Генеральный директор: {C.director}</span>
        <span>
          Тел.: <a href={`tel:${C.phoneHref}`}>{C.phone}</a> · E-mail: <a href={`mailto:${C.email}`}>{C.email}</a>
        </span>
        <span>{licenseText}</span>
      </address>
    );
  }

  return (
    <section className="company-info company-full card card-body" aria-labelledby="company-title">
      <h2 id="company-title" className="company-title">Сведения об организации</h2>
      <dl>
        <dt>Полное наименование</dt>
        <dd>{C.fullName}</dd>
        <dt>Юридический адрес</dt>
        <dd>{C.legalAddress}</dd>
        <dt>ОГРН</dt>
        <dd>{C.ogrn}</dd>
        <dt>ИНН / КПП</dt>
        <dd>{C.inn} / {C.kpp}</dd>
        <dt>Контакты</dt>
        <dd>
          <a href={`tel:${C.phoneHref}`}>{C.phone}</a><br />
          <a href={`mailto:${C.email}`}>{C.email}</a>
        </dd>
        <dt>Генеральный директор</dt>
        <dd>{C.director}</dd>
        <dt>Лицензия</dt>
        <dd>{licenseText}</dd>
      </dl>
    </section>
  );
}
