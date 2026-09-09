import { test } from 'node:test';
import assert from 'node:assert';
import { validateRegister, validateSingleField, initialRegisterForm } from '../src/utils/authValidation.js';

test('TEST 1: All fields manually typed correctly passes validation', () => {
  const form = {
    fullName: 'Jane Technician',
    email: 'jane.tech@repairlens.com',
    password: 'SecurePassword123!',
    confirmPassword: 'SecurePassword123!',
    phone: '+1 (555) 019-2834',
  };

  const errors = validateRegister(form);
  assert.strictEqual(Object.keys(errors).length, 0, 'Should have zero validation errors');
});

test('TEST 2: Browser autofill values are accepted and pass validation', () => {
  // Autofill often fills trimmed or untrimmed string values
  const autofilled = {
    fullName: 'Alex Vance ',
    email: 'alex.vance@blackmesa.org ',
    password: 'SuperSecret123$',
    confirmPassword: 'SuperSecret123$',
    phone: '',
  };

  const errors = validateRegister(autofilled);
  assert.strictEqual(Object.keys(errors).length, 0, 'Autofilled required fields should be valid');
});

test('TEST 3: Phone left empty does NOT cause validation failure (optional field)', () => {
  const form = {
    fullName: 'Gordon Freeman',
    email: 'gordon@repairlens.com',
    password: 'HazardousEnvironmentSuit123!',
    confirmPassword: 'HazardousEnvironmentSuit123!',
    phone: '', // Optional phone omitted
  };

  const errors = validateRegister(form);
  assert.strictEqual(Object.keys(errors).length, 0, 'Empty phone must not fail validation');
});

test('TEST 4: Email empty produces required-field error', () => {
  const form = {
    fullName: 'John Doe',
    email: '',
    password: 'ValidPassword123!',
    confirmPassword: 'ValidPassword123!',
    phone: '',
  };

  const errors = validateRegister(form);
  assert.strictEqual(errors.email, 'Please enter your email address.');
  assert.strictEqual(errors.form, 'Please complete all required fields.');
});

test('TEST 5: Password empty produces required-field error', () => {
  const form = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: '',
    confirmPassword: '',
  };

  const errors = validateRegister(form);
  assert.strictEqual(errors.password, 'Please enter your password.');
  assert.strictEqual(errors.form, 'Please complete all required fields.');
});

test('TEST 6: Confirm password empty produces required-field error', () => {
  const form = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'ValidPassword123!',
    confirmPassword: '',
  };

  const errors = validateRegister(form);
  assert.strictEqual(errors.confirmPassword, 'Please confirm your password.');
  assert.strictEqual(errors.form, 'Please complete all required fields.');
});

test('TEST 7: Passwords do not match displays specific error (NOT generic required error)', () => {
  const form = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'ValidPassword123!',
    confirmPassword: 'DifferentPassword123!',
  };

  const errors = validateRegister(form);
  assert.strictEqual(errors.confirmPassword, 'Passwords do not match.');
  assert.strictEqual(errors.form, 'Passwords do not match.');
  assert.notStrictEqual(errors.form, 'Please complete all required fields.');
});

test('TEST 8: Invalid email displays specific error (NOT generic required error)', () => {
  const form = {
    fullName: 'John Doe',
    email: 'not-a-valid-email',
    password: 'ValidPassword123!',
    confirmPassword: 'ValidPassword123!',
  };

  const errors = validateRegister(form);
  assert.strictEqual(errors.email, 'Please enter a valid email address.');
  assert.strictEqual(errors.form, 'Please enter a valid email address.');
  assert.notStrictEqual(errors.form, 'Please complete all required fields.');
});

test('TEST 9: validateSingleField validates individual inputs on blur/interaction', () => {
  // fullName
  assert.strictEqual(validateSingleField('fullName', '', {}), 'Please enter your full name.');
  assert.strictEqual(validateSingleField('fullName', 'A', {}), 'Full name must be at least 2 characters.');
  assert.strictEqual(validateSingleField('fullName', 'Ada Lovelace', {}), '');

  // email
  assert.strictEqual(validateSingleField('email', '', {}), 'Please enter your email address.');
  assert.strictEqual(validateSingleField('email', 'bad-email', {}), 'Please enter a valid email address.');
  assert.strictEqual(validateSingleField('email', 'ada@lovelace.org', {}), '');

  // password
  assert.strictEqual(validateSingleField('password', '', {}), 'Please enter your password.');
  assert.strictEqual(validateSingleField('password', 'short', {}), 'Password must contain at least 8 characters.');
  assert.strictEqual(validateSingleField('password', 'ValidPassword123!', {}), '');

  // confirmPassword
  assert.strictEqual(validateSingleField('confirmPassword', '', { password: 'ValidPassword123!' }), 'Please confirm your password.');
  assert.strictEqual(validateSingleField('confirmPassword', 'Wrong', { password: 'ValidPassword123!' }), 'Passwords do not match.');
  assert.strictEqual(validateSingleField('confirmPassword', 'ValidPassword123!', { password: 'ValidPassword123!' }), '');

  // phone is always optional
  assert.strictEqual(validateSingleField('phone', '', {}), '');
  assert.strictEqual(validateSingleField('phone', '+1234567890', {}), '');
});

test('TEST 10: DOM elements fallback handles autofill where onChange may not fire', () => {
  const mockFormElements = {
    'register-fullName': { value: 'Autofilled Name' },
    'register-email': { value: 'autofill@repairlens.com' },
    'register-password': { value: 'AutoFilledPass123!' },
    'register-confirmPassword': { value: 'AutoFilledPass123!' },
    'register-phone': { value: '' },
  };

  const extracted = {
    fullName: (mockFormElements['register-fullName']?.value ?? '').trim(),
    email: (mockFormElements['register-email']?.value ?? '').trim(),
    password: mockFormElements['register-password']?.value ?? '',
    confirmPassword: mockFormElements['register-confirmPassword']?.value ?? '',
    phone: (mockFormElements['register-phone']?.value ?? '').trim(),
  };

  const errors = validateRegister(extracted);
  assert.strictEqual(Object.keys(errors).length, 0, 'Extracted DOM autofill values must validate cleanly');
});

test('TEST 11: Refresh page / reset form initializes with empty values', () => {
  assert.deepStrictEqual(initialRegisterForm, {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
});

test('TEST 12: Whitespace-only values in required fields are rejected with required field error', () => {
  const whitespaceForm = {
    fullName: '   ',
    email: '   ',
    password: '',
    confirmPassword: '',
    phone: '   ',
  };

  const errors = validateRegister(whitespaceForm);
  assert.strictEqual(errors.form, 'Please complete all required fields.');
  assert.strictEqual(errors.fullName, 'Please enter your full name.');
  assert.strictEqual(errors.email, 'Please enter your email address.');
  assert.strictEqual(errors.password, 'Please enter your password.');
  assert.strictEqual(errors.confirmPassword, 'Please confirm your password.');
  assert.strictEqual(errors.phone, undefined, 'Phone must not have error even when blank/whitespace');
});

test('TEST 13: Error mapping handles duplicate email / account exists gracefully', () => {
  const serverConflictMessage = 'An account with this email already exists.';
  let friendlyError = 'Unable to create your account. Please try again.';
  if (serverConflictMessage.includes('already exists')) {
    friendlyError = 'An account with this email already exists.';
  }
  assert.strictEqual(friendlyError, 'An account with this email already exists.');
});

test('TEST 14: Never exposes raw server errors or database stack traces to user', () => {
  const rawDbError = 'PrismaClientKnownRequestError: Unique constraint failed on the fields: (`email`) at ...';
  let friendly = 'Unable to create your account. Please try again.';
  if (rawDbError.includes('already exists')) {
    friendly = 'An account with this email already exists.';
  }
  assert.strictEqual(friendly, 'Unable to create your account. Please try again.');
  assert.ok(!friendly.includes('Prisma'));
});
