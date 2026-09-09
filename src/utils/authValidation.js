export const initialRegisterForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

export function validateRegister(values = {}) {
  const nextErrors = {};
  const fullName = String(values.fullName || '').trim();
  const email = String(values.email || '').trim();
  const password = String(values.password || '');
  const confirmPassword = String(values.confirmPassword || '');
  // Phone is strictly optional

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isMissingRequired = !fullName || !email || !password || !confirmPassword;

  if (!fullName) {
    nextErrors.fullName = 'Please enter your full name.';
  } else if (fullName.length < 2) {
    nextErrors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!email) {
    nextErrors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(email)) {
    nextErrors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    nextErrors.password = 'Please enter your password.';
  } else if (password.length < 8) {
    nextErrors.password = 'Password must contain at least 8 characters.';
  }

  if (!confirmPassword) {
    nextErrors.confirmPassword = 'Please confirm your password.';
  } else if (confirmPassword !== password) {
    nextErrors.confirmPassword = 'Passwords do not match.';
  }

  // Precedence for top-level banner error:
  if (isMissingRequired) {
    nextErrors.form = 'Please complete all required fields.';
  } else if (!emailRegex.test(email)) {
    nextErrors.form = 'Please enter a valid email address.';
  } else if (password.length < 8) {
    nextErrors.form = 'Password must contain at least 8 characters.';
  } else if (confirmPassword !== password) {
    nextErrors.form = 'Passwords do not match.';
  }

  return nextErrors;
}

export function validateSingleField(name, value, allValues = {}) {
  const strVal = String(value || '');
  const trimmed = strVal.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  switch (name) {
    case 'fullName':
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Full name must be at least 2 characters.';
      return '';
    case 'email':
      if (!trimmed) return 'Please enter your email address.';
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
      return '';
    case 'password':
      if (!strVal) return 'Please enter your password.';
      if (strVal.length < 8) return 'Password must contain at least 8 characters.';
      return '';
    case 'confirmPassword':
      if (!strVal) return 'Please confirm your password.';
      if (strVal !== allValues.password) return 'Passwords do not match.';
      return '';
    case 'phone':
      return ''; // Optional, no validation error
    default:
      return '';
  }
}
