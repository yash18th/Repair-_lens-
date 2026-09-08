import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Activity, Cpu, Wrench } from 'lucide-react';
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

  const authStatusText = useMemo(() => {
    if (status === 'login_error') return 'Authentication failed. Verify credentials.';
    if (isLoggingIn) return 'Verifying operator credentials...';
    return 'Enter authorized operator credentials to access the diagnostic lab.';
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
        form: result.error || 'Unable to sign in. Please check your credentials.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090C] text-[#F5F7FA] flex flex-col lg:flex-row">
      {/* Left Column: Technical Enterprise Brand Panel */}
      <div className="lg:w-1/2 bg-[#090C10] border-b lg:border-b-0 lg:border-r border-[#202731] p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden tech-grid">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#141922] border border-[#202731] flex items-center justify-center text-[#F5F7FA] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              <Wrench className="w-3.5 h-3.5 text-[#8294AA]" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="font-bold text-xs tracking-tight text-[#F5F7FA]">REPAIR</span>
                <span className="font-semibold text-[#8294AA] text-[10px] tracking-[0.14em]">LENS</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.14em] text-[#667180] font-mono">
                ENTERPRISE SYSTEM
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-md pt-8">
            <div className="eyebrow">
              <span className="gold-dot"></span>
              <span>OPERATOR CONSOLE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#F5F7FA]">
              Precision diagnostics,{' '}
              <span className="bg-gradient-to-r from-[#8294AA] to-[#B8C5D3] bg-clip-text text-transparent">
                built for professionals.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A7B0BD] leading-relaxed">
              Optical defect mapping, multi-angle vision pipeline, and hardware failure telemetry for certified technicians and repair laboratories.
            </p>
          </div>
        </div>

        {/* Technical Schematic Telemetry Box */}
        <div className="relative z-10 my-8 max-w-md rounded-xl border border-[#202731] bg-[#0C1015] p-5 font-mono text-[10px] space-y-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]">
          <div className="flex items-center justify-between text-[#667180] border-b border-[#181E26] pb-2 text-[9px]">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#8294AA]" />
              SPECTRUM ENCLAVE
            </span>
            <span className="text-[#4F8A68]">● VERIFIED</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[#A7B0BD]">
            <div>
              <span className="text-[#667180] text-[9px] block">SPECTRAL RESOLUTION</span>
              <span className="font-semibold text-[#F5F7FA]">4K MULTI-ANGLE</span>
            </div>
            <div>
              <span className="text-[#667180] text-[9px] block">DIAGNOSTIC ENGINE</span>
              <span className="font-semibold text-[#8294AA]">RL-VISION v1.0</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[#667180] pt-4 border-t border-[#181E26]">
          <span>RL-OS // AUTHENTICATION CORE</span>
          <span className="text-[#8294AA]">SECURE SHA-256</span>
        </div>
      </div>

      {/* Right Column: Clean Form Container with Large Whitespace */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#07090C]">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-[#F5F7FA]">Sign In</h2>
            <p className="text-xs text-[#A7B0BD] leading-relaxed">{authStatusText}</p>
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
              <p className="rounded-lg border border-[#A65D5D]/40 bg-[#A65D5D]/10 px-3 py-2 text-xs font-mono text-[#fca5a5]" role="alert">
                {errors.form}
              </p>
            ) : null}

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-[#A7B0BD] transition-colors hover:text-[#F5F7FA]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="premium-button w-full"
            >
              <span>{isLoggingIn ? 'Verifying...' : 'Sign In'}</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2 text-[#8294AA]" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-4 border-t border-[#181E26] text-xs">
            <span className="text-[#667180]">Don't have an account?</span>
            <Link to="/register" className="font-semibold text-[#F5F7FA] hover:text-[#8294AA] transition-colors">
              Create account
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#667180] pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4F8A68]" />
            <span>ENCRYPTED LAB ACCESS PROTOCOL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
