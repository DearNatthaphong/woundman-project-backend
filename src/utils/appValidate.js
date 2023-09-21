const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

const idLineRegex = /^[a-z0-9._-]+$/;

exports.validatePassword = (password) => passwordRegex.test(password);

exports.validateIdLine = (idLine) => idLineRegex.test(idLine);
