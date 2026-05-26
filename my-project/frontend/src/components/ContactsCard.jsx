export default function ContactsCard({ address, hotline }) {
  if (!address && !hotline) return null;

  return (
    <div className="card mb-8 animate-in">
      <h3>Контакты</h3>
      {address && (
        <p className="mb-2">
          <strong>Адрес:</strong> {address}
        </p>
      )}
      {hotline && (
        <p className="mb-0">
          <strong>Горячая линия:</strong>{" "}
          <a href={`tel:${hotline.replace(/\s/g, "")}`} className="link-phone">
            {hotline}
          </a>
        </p>
      )}
      <p className="text-muted mt-3 mb-0">
        Вопросы по бронированию — звоните, ответим оперативно.
      </p>
    </div>
  );
}
