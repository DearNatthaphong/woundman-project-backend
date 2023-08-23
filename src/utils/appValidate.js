const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,}$/;

exports.validatePassword = (password) => passwordRegex.test(password);
