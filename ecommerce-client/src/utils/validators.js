function isEmailValid(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function isPasswordStrong(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
}

function isRequired(value) {
    return value && value.trim() !== '';
}

function isPhoneNumberValid(phone) {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(String(phone));
}

export { isEmailValid, isPasswordStrong, isRequired, isPhoneNumberValid };