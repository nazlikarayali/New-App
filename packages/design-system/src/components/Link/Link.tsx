import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import './Link.scss';

export type LinkSize = 'sm' | 'lg';
export type LinkColorScheme = 'primary' | 'constructive' | 'destructive';

interface CommonProps {
  size?: LinkSize;
  colorScheme?: LinkColorScheme;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

type AnchorProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
    href: string;
    disabled?: boolean;
  };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
    href?: undefined;
  };

export type LinkProps = AnchorProps | ButtonProps;

function buildClass({
  size,
  colorScheme,
  disabled,
  className,
}: {
  size: LinkSize;
  colorScheme: LinkColorScheme;
  disabled?: boolean;
  className?: string;
}) {
  return [
    'jf-link',
    `jf-link--${size}`,
    `jf-link--${colorScheme}`,
    disabled && 'jf-link--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkProps>(
  (props, ref) => {
    const {
      size = 'lg',
      colorScheme = 'primary',
      leftIcon,
      rightIcon,
      children,
      className,
      ...rest
    } = props;

    const content = (
      <>
        {leftIcon && <span className="jf-link__icon">{leftIcon}</span>}
        <span className="jf-link__label">{children}</span>
        {rightIcon && <span className="jf-link__icon">{rightIcon}</span>}
      </>
    );

    if ('href' in rest && rest.href !== undefined) {
      const { disabled, href, ...anchorRest } = rest as AnchorProps;
      const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = anchorRest;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={buildClass({ size, colorScheme, disabled, className })}
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : undefined}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }

    const { disabled, type, ...buttonRest } = rest as ButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? 'button'}
        className={buildClass({ size, colorScheme, disabled, className })}
        disabled={disabled}
        {...buttonRest}
      >
        {content}
      </button>
    );
  }
);

Link.displayName = 'Link';
