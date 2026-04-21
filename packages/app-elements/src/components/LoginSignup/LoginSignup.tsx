import { useState, useEffect, type FC } from 'react';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button';
import { Heading } from '../Heading';
import './LoginSignup.scss';

// ============================================
// Types
// ============================================
export type LoginSignupMode = 'Login' | 'Signup';
export type LoginSignupLayout = 'Left' | 'Center';

export interface LoginSignupProps {
  mode?: LoginSignupMode;
  layout?: LoginSignupLayout;

  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  showInputIcons?: boolean;
  selected?: boolean;
  shrinked?: boolean;
  skeleton?: boolean;
  skeletonAnimation?: 'pulse' | 'shimmer';
}

// ============================================
// LoginSignup Component
// ============================================
export const LoginSignup: FC<LoginSignupProps> = ({
  mode = 'Login',
  layout = 'Left',
  title,
  subtitle,
  buttonLabel,
  showInputIcons = true,
  selected = false,
  shrinked = false,
  skeleton = false,
  skeletonAnimation = 'pulse',
}) => {
  const [activeMode, setActiveMode] = useState<LoginSignupMode>(mode);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => { setActiveMode(mode); setShowForgot(false); }, [mode]);

  const isLogin = activeMode === 'Login';
  const isCenter = layout === 'Center';

  const resolvedTitle = title || (isLogin ? 'Welcome back' : 'Create account');
  const resolvedSubtitle = subtitle || (isLogin ? 'Sign in to your account' : 'Sign up to get started');
  const resolvedButtonLabel = buttonLabel || (isLogin ? 'Sign In' : 'Create Account');

  const animClass = skeletonAnimation === 'shimmer' ? 'animate-shimmer' : 'animate-pulse';

  // =====================
  // Skeleton
  // =====================
  if (skeleton) {
    const rootClasses = [
      'jf-login',
      isCenter && 'jf-login--center',
      shrinked && 'jf-login--shrinked',
    ].filter(Boolean).join(' ');

    return (
      <div className={rootClasses}>
        <div className="jf-login__main">
          <Heading size="Small" alignment={isCenter ? 'Center' : 'Left'} skeleton skeletonAnimation={skeletonAnimation} />
          <div className="jf-login__fields">
            {!isLogin && (
              <div className="jf-login__row">
                <div className="jf-login__field">
                  <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '30%' }} />
                  <div className={`jf-skeleton__bone ${animClass}`} style={{ height: 44, borderRadius: 8 }} />
                </div>
                <div className="jf-login__field">
                  <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '30%' }} />
                  <div className={`jf-skeleton__bone ${animClass}`} style={{ height: 44, borderRadius: 8 }} />
                </div>
              </div>
            )}
            <div className="jf-login__field">
              <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '20%' }} />
              <div className={`jf-skeleton__bone ${animClass}`} style={{ height: 44, borderRadius: 8 }} />
            </div>
            <div className="jf-login__field">
              <div className={`jf-skeleton__line jf-skeleton__line--sm ${animClass}`} style={{ width: '25%' }} />
              <div className={`jf-skeleton__bone ${animClass}`} style={{ height: 44, borderRadius: 8 }} />
            </div>
          </div>
          <div className={`jf-skeleton__bone ${animClass}`} style={{ height: 48, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  // =====================
  // Main Render
  // =====================
  const rootClasses = [
    'jf-login',
    isCenter && 'jf-login--center',
    selected && 'jf-login--selected',
    shrinked && 'jf-login--shrinked',
  ].filter(Boolean).join(' ');

  // =====================
  // Forgot Password View
  // =====================
  if (showForgot) {
    return (
      <div className={rootClasses}>
        <div className="jf-login__main">
          <Heading size="Small" alignment={isCenter ? 'Center' : 'Left'} heading="Forgot password?" subheading="Enter your email and we'll send you a reset link." />

          <div className="jf-login__fields">
            <div className="jf-login__field">
              <label className="jf-login__label">Email</label>
              <div className="jf-login__input-wrap">
                {showInputIcons && <Icon name="Mail" size={18} className="jf-login__input-icon" />}
                <input type="email" className={`jf-login__input${showInputIcons ? ' jf-login__input--icon' : ''}`} placeholder="you@example.com" />
              </div>
            </div>
          </div>

          <Button
            variant="Default"
            label="Send Reset Link"
            leftIcon="none"
            rightIcon="none"
            fullWidth
          />

          <p className="jf-login__footer">
            {'Remember? '}
            <button
              className="jf-login__footer-link"
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowForgot(false); }}
            >
              Back to Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  // =====================
  // Login / Signup View
  // =====================
  return (
    <div className={rootClasses}>
      <div className="jf-login__main">
        {/* Header */}
        <Heading size="Small" alignment={isCenter ? 'Center' : 'Left'} heading={resolvedTitle} subheading={resolvedSubtitle} />

        {/* Form Fields */}
        <div className="jf-login__fields">
          {/* Name Fields (Signup Only) */}
          {!isLogin && (
            <div className="jf-login__row">
              <div className="jf-login__field">
                <label className="jf-login__label">First Name</label>
                <input type="text" className="jf-login__input" placeholder="John" />
              </div>
              <div className="jf-login__field">
                <label className="jf-login__label">Last Name</label>
                <input type="text" className="jf-login__input" placeholder="Doe" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="jf-login__field">
            <label className="jf-login__label">Email</label>
            <div className="jf-login__input-wrap">
              {showInputIcons && <Icon name="Mail" size={18} className="jf-login__input-icon" />}
              <input type="email" className={`jf-login__input${showInputIcons ? ' jf-login__input--icon' : ''}`} placeholder="you@example.com" />
            </div>
          </div>

          {/* Password */}
          <div className="jf-login__field">
            <div className="jf-login__label-row">
              <label className="jf-login__label">Password</label>
              {isLogin && <button className="jf-login__forgot" type="button" onClick={(e) => { e.stopPropagation(); setShowForgot(true); }}>Forgot password?</button>}
            </div>
            <div className="jf-login__input-wrap">
              {showInputIcons && <Icon name="Lock" size={18} className="jf-login__input-icon" />}
              <input type={showPassword ? 'text' : 'password'} className={`jf-login__input${showInputIcons ? ' jf-login__input--icon' : ''}`} placeholder="••••••••" />
              <button className="jf-login__input-toggle" type="button" onClick={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'Eye' : 'EyeOff'} size={18} />
              </button>
            </div>
          </div>

          {/* Confirm Password (Signup Only) */}
          {!isLogin && (
            <div className="jf-login__field">
              <label className="jf-login__label">Confirm Password</label>
              <div className="jf-login__input-wrap">
                {showInputIcons && <Icon name="Lock" size={18} className="jf-login__input-icon" />}
                <input type={showConfirmPassword ? 'text' : 'password'} className={`jf-login__input${showInputIcons ? ' jf-login__input--icon' : ''}`} placeholder="••••••••" />
                <button className="jf-login__input-toggle" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon name={showConfirmPassword ? 'Eye' : 'EyeOff'} size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          variant="Default"
          label={resolvedButtonLabel}
          leftIcon="none"
          rightIcon="none"
          fullWidth
        />

        {/* Footer */}
        <p className="jf-login__footer">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="jf-login__footer-link"
            type="button"
            onClick={(e) => { e.stopPropagation(); setActiveMode(isLogin ? 'Signup' : 'Login'); }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
