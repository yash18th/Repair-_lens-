import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Wrench } from 'lucide-react';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
};

export function validateRegister(values) {
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

export default function Register() {
  const navigate = useNavigate();
  const { register, isRegistering, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      try {
        const redirect = JSON.parse(window.sessionStorage.getItem('repairlens.redirectAfterAuth') || 'null');
        if (redirect?.path) {
          window.sessionStorage.removeItem('repairlens.redirectAfterAuth');
          navigate(redirect.path, { replace: true });
          return;
        }
      } catch (error) {
        console.warn('Unable to read redirectAfterAuth:', error);
      }

      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => {
      const nextValues = { ...prev, [name]: value };
      if (touched[name] || hasSubmitted) {
        const fieldError = validateSingleField(name, value, nextValues);
        setErrors((prevErrors) => {
          const updated = { ...prevErrors };
          if (fieldError) {
            updated[name] = fieldError;
          } else {
            delete updated[name];
          }
          if (updated.form && !fieldError) {
            delete updated.form;
          }
          return updated;
        });
      }
      return nextValues;
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateSingleField(name, value, formValues);
    setErrors((prev) => {
      const updated = { ...prev };
      if (fieldError) {
        updated[name] = fieldError;
      } else {
        delete updated[name];
      }
      return updated;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent duplicate submissions on rapid clicks
    if (isSubmitting || isRegistering) {
      return;
    }

    setHasSubmitted(true);

    // Safeguard against browser autofill or password managers that didn't fire synthetic onChange:
    // Read the current live values directly from DOM elements
    const elements = event.currentTarget?.elements || {};
    const currentValues = {
      fullName: (elements['register-fullName']?.value ?? elements.fullName?.value ?? formValues.fullName ?? '').trim(),
      email: (elements['register-email']?.value ?? elements.email?.value ?? formValues.email ?? '').trim(),
      password: elements['register-password']?.value ?? elements.password?.value ?? formValues.password ?? '',
      confirmPassword: elements['register-confirmPassword']?.value ?? elements.confirmPassword?.value ?? formValues.confirmPassword ?? '',
      phone: (elements['register-phone']?.value ?? elements.phone?.value ?? formValues.phone ?? '').trim(),
    };

    // Ensure local state is synced
    setFormValues(currentValues);

    const nextErrors = validateRegister(currentValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        fullName: currentValues.fullName,
        email: currentValues.email,
        password: currentValues.password,
        confirmPassword: currentValues.confirmPassword,
        phone: currentValues.phone,
      });

      if (result.ok) {
        try {
          const redirect = JSON.parse(window.sessionStorage.getItem('repairlens.redirectAfterAuth') || 'null');
          if (redirect?.path) {
            window.sessionStorage.removeItem('repairlens.redirectAfterAuth');
            navigate(redirect.path, { replace: true });
            return;
          }
        } catch (error) {
          console.warn('Unable to read redirectAfterAuth:', error);
        }

        navigate('/dashboard', { replace: true });
      } else {
        const rawError = String(result.error || '');
        if (rawError.includes('already exists')) {
          setErrors({
            email: 'An account with this email already exists.',
            form: 'An account with this email already exists.',
          });
        } else if (rawError.includes('match')) {
          setErrors({
            confirmPassword: 'Passwords do not match.',
            form: 'Passwords do not match.',
          });
        } else if (rawError.includes('valid email')) {
          setErrors({
            email: 'Please enter a valid email address.',
            form: 'Please enter a valid email address.',
          });
        } else {
          setErrors({
            form: rawError || 'Unable to create your account. Please try again.',
          });
        }
      }
    } catch (err) {
      setErrors({
        form: 'Unable to create your account. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-[#F4F6F8] flex flex-col lg:flex-row">
      {/* Left Column: Technical Enterprise Brand Panel */}
      <div className="lg:w-1/2 bg-[#0B0F15] border-b lg:border-b-0 lg:border-r border-[#232B36] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden tech-grid">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#161C25] border border-[#232B36] flex items-center justify-center text-[#F4F6F8]">
              <Wrench className="w-3.5 h-3.5 text-[#7D91AA]" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="font-bold text-xs tracking-tight text-[#F4F6F8]">REPAIR</span>
                <span className="font-semibold text-[#7D91AA] text-[10px] tracking-[0.14em]">LENS</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-[#687382] font-mono">
                ENTERPRISE SYSTEM
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md pt-8">
            <div className="eyebrow">
              <span className="gold-dot"></span>
              <span>TECHNICIAN REGISTRATION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#F4F6F8]">
              Certified access to{' '}
              <span className="bg-gradient-to-r from-[#7D91AA] to-[#A7B0BC] bg-clip-text text-transparent">
                repair intelligence.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B0BC] leading-relaxed">
              Register your technician profile to record persistent diagnostic telemetry, access OCR part decoding, and export repair estimates.
            </p>
          </div>
        </div>

        {/* Technical Specification Box */}
        <div className="relative z-10 my-8 max-w-md rounded-xl border border-[#232B36] bg-[#0D1118] p-5 font-mono text-[10px] space-y-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between text-[#687382] border-b border-[#1A222C] pb-2 text-[9px]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#7D91AA]" />
              PLATFORM PROVISIONING
            </span>
            <span className="text-[#55A477]">● ACTIVE</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[#A7B0BC]">
            <div>
              <span className="text-[#687382] text-[9px] block">SECURITY LEVEL</span>
              <span className="font-semibold text-[#F4F6F8]">ENTERPRISE SECURE</span>
            </div>
            <div>
              <span className="text-[#687382] text-[9px] block">TELEMETRY RETENTION</span>
              <span className="font-semibold text-[#7D91AA]">DATABASE ARCHIVE</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#687382] pt-4 border-t border-[#1A222C]">
          <span>REPAIRLENS CORE ENGINE</span>
          <span className="text-[#7D91AA]">VERSION 1.0</span>
        </div>
      </div>

      {/* Right Column: Registration Form Container */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#080B10] overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold tracking-tight text-[#F4F6F8]">Create Technician Account</h2>
            <p className="text-xs text-[#A7B0BC] leading-relaxed">
              Register for verified hardware failure telemetry and report storage.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="register-fullName"
              label="Full Name"
              name="fullName"
              type="text"
              value={formValues.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="e.g. Yashvanth"
              autoComplete="name"
              required
            />

            <AuthInput
              id="register-email"
              label="Email Address"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@repairlens.com"
              autoComplete="email"
              required
            />

            <PasswordInput
              id="register-password"
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />

            <PasswordInput
              id="register-confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              required
            />

            <AuthInput
              id="register-phone"
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={formValues.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Optional contact number"
              autoComplete="tel"
            />

            {errors.form ? (
              <p className="rounded-lg border border-[#B36262]/40 bg-[#B36262]/10 px-3 py-2 text-xs font-mono text-[#B36262]" role="alert">
                {errors.form}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full py-2.5 px-4 rounded-lg bg-[#161C25] hover:bg-[#1D2430] border border-[#232B36] hover:border-[#7D91AA]/40 text-[#F4F6F8] font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>{isRegistering ? 'Provisioning Account...' : 'Create Account'}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2 text-[#7D91AA]" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-4 border-t border-[#1A222C] text-xs">
            <span className="text-[#687382]">Already have an account?</span>
            <Link to="/login" className="font-semibold text-[#F4F6F8] hover:text-[#7D91AA] transition-colors">
              Sign in
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#687382] pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#55A477]" />
            <span>ENCRYPTED LAB ACCESS PROTOCOL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
