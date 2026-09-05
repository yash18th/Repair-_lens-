import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
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

function validateRegister(values) {
  const nextErrors = {};

  if (!values.fullName.trim()) {
    nextErrors.fullName = 'Please enter your full name.';
  } else if (values.fullName.trim().length < 2) {
    nextErrors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!values.email.trim()) {
    nextErrors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    nextErrors.password = 'Please enter your password.';
  } else if (values.password.length < 8) {
    nextErrors.password = 'Password must contain at least 8 characters.';
  }

  if (!values.confirmPassword) {
    nextErrors.confirmPassword = 'Please confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    nextErrors.confirmPassword = 'Passwords do not match.';
  }

  return nextErrors;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, isRegistering, isAuthenticated } = useAuth();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});

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
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateRegister(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await register({
      fullName: formValues.fullName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
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
      setErrors({
        form: result.error || 'Unable to create your account right now.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] px-4 py-8 text-slate-100 sm:py-10">
      <div className="mx-auto flex max-w-lg items-center justify-center">
        <div className="w-full rounded-xl border border-[#2a303a] bg-[#151922] p-6 shadow-[0_10px_30px_rgba(8,11,17,0.18)] sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#2a303a] bg-[#111821] text-sm font-semibold text-slate-100">
              RL
            </div>
            <div>
              <div className="text-lg font-semibold tracking-[-0.03em] text-white">RepairLens</div>
            </div>
          </div>

          <div className="mb-6 space-y-2">
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">Create your account</h1>
            <p className="text-sm leading-6 text-slate-400">Access your RepairLens diagnostic workspace.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="register-full-name"
              label="Full Name"
              name="fullName"
              value={formValues.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
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
              placeholder="Enter a password"
              autoComplete="new-password"
              required
            />

            <PasswordInput
              id="register-confirm-password"
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
              <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300" role="alert">
                {errors.form}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isRegistering}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6b7cff] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5d6ee8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isRegistering ? 'Creating account...' : 'Create Account'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Already have an account?</span>
            <Link to="/login" className="font-medium text-slate-200 transition-colors hover:text-white">
              Sign in
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Secure diagnostic access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
