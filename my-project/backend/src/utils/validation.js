const LOGIN_RE = /^[a-zA-Z0-9]{6,}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegistration({ login, password, fullName, phone, email }) {
  const errors = [];

  if (!login || !LOGIN_RE.test(login)) {
    errors.push("Логин: только латиница и цифры, минимум 6 символов");
  }
  if (!password || password.length < 8) {
    errors.push("Пароль: не менее 8 символов");
  }
  if (!fullName || !String(fullName).trim()) {
    errors.push("Укажите ФИО");
  }
  if (!phone || !String(phone).trim()) {
    errors.push("Укажите контактный телефон");
  }
  if (!email || !EMAIL_RE.test(String(email).trim())) {
    errors.push("Укажите корректный e-mail");
  }

  return errors;
}

module.exports = { validateRegistration, LOGIN_RE, EMAIL_RE };
