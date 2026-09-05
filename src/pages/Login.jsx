import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import AuthInput from '../components/auth/AuthInput';
import PasswordInput from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  email: '',
  password: '',
};

function validateLogin(values) {
  const nextErrors = {};

  if (!values.email.trim()) {
    nextErrors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = 'Please enter a valid email address.';
  }

  if (!values.password) {
    nextErrors.password = 'Please enter your password.';
  }

  return nextErrors;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn, isAuthenticated, status } = useAuth();
  const [formValues, setFormValues] = useState(initialForm);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const authStatusText = useMemo(() => {
    if (status === 'login_error') return 'Unable to sign in.';
    if (isLoggingIn) return 'Signing in...';
    return 'Sign in to your RepairLens diagnostic workspace.';
  }, [isLoggingIn, status]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateLogin(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const result = await login({
      email: formValues.email,
      password: formValues.password,
    });

    if (result.ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrors({
        form: result.error || 'Unable to sign in. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-md items-center justify-center">
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
            <h1 className="text-2xl font-semibold tracking-[-0.04em] text-white">Welcome back</h1>
            <p className="text-sm leading-6 text-slate-400">{authStatusText}</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <AuthInput
              id="login-email"
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
              id="login-password"
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            {errors.form ? (
              <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300" role="alert">
                {errors.form}
              </p>
            ) : null}

            <div className="flex items-center justify-end">
              <button type="button" className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-200">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#6b7cff] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#5d6ee8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isLoggingIn ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2a303a]" />
            <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">Access</span>
            <div className="h-px flex-1 bg-[#2a303a]" />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <span>Don’t have an account?</span>
            <Link to="/register" className="font-medium text-slate-200 transition-colors hover:text-white">
              Create account
            </Link>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Frontend-only auth placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
