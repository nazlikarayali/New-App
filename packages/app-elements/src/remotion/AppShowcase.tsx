import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  interpolateColors,
} from 'remotion';

// ─── Theme helpers ───────────────────────────────────────────────────────────

interface ThemeVars {
  brandColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  radius: number;
  font: string;
}

function useTheme(frame: number, _fps: number): ThemeVars {
  // Phase 2 theme transitions
  const brandColor = interpolateColors(
    frame,
    [380, 420],
    ['#7C3AED', '#2563EB'],
  );

  const bgColor = interpolateColors(frame, [530, 570], ['#F9FAFB', '#111827']);
  const cardBg = interpolateColors(frame, [530, 570], ['#FFFFFF', '#1F2937']);
  const textColor = interpolateColors(
    frame,
    [530, 570],
    ['#111827', '#F9FAFB'],
  );
  const subtextColor = interpolateColors(
    frame,
    [530, 570],
    ['#6B7280', '#9CA3AF'],
  );
  const borderColor = interpolateColors(
    frame,
    [530, 570],
    ['#E5E7EB', '#374151'],
  );

  const radiusBase = interpolate(frame, [480, 520], [8, 20], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fontProgress = interpolate(frame, [430, 432], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const font = fontProgress < 0.5 ? 'Inter, system-ui, sans-serif' : 'Fredoka, sans-serif';

  return {
    brandColor,
    bgColor,
    cardBg,
    textColor,
    subtextColor,
    borderColor,
    radius: radiusBase,
    font,
  };
}

// ─── Animated element wrapper ────────────────────────────────────────────────

type Direction = 'right' | 'left' | 'bottom';

const AnimatedElement: React.FC<{
  enterFrame: number;
  direction: Direction;
  children: React.ReactNode;
}> = ({ enterFrame, direction, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 18, stiffness: 80, mass: 0.8 },
  });

  const clamped = Math.max(0, Math.min(1, progress));

  const offsetX =
    direction === 'right' ? 120 : direction === 'left' ? -120 : 0;
  const offsetY = direction === 'bottom' ? 80 : 0;

  const translateX = interpolate(clamped, [0, 1], [offsetX, 0]);
  const translateY = interpolate(clamped, [0, 1], [offsetY, 0]);
  const opacity = interpolate(clamped, [0, 1], [0, 1]);

  if (frame < enterFrame) return null;

  return (
    <div
      style={{
        transform: `translate(${translateX}px, ${translateY}px)`,
        opacity,
        marginBottom: 28,
      }}
    >
      {children}
    </div>
  );
};

// ─── Mock components ─────────────────────────────────────────────────────────

const MockHeading: React.FC<{
  title: string;
  subtitle?: string;
  theme: ThemeVars;
}> = ({ title, subtitle, theme }) => (
  <div style={{ marginBottom: 8 }}>
    <h2
      style={{
        fontFamily: theme.font,
        fontSize: 26,
        fontWeight: 700,
        color: theme.textColor,
        margin: '0 0 4px 0',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontFamily: theme.font,
          fontSize: 14,
          color: theme.subtextColor,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const MockButton: React.FC<{
  label: string;
  primary?: boolean;
  theme: ThemeVars;
}> = ({ label, primary, theme }) => (
  <button
    style={{
      fontFamily: theme.font,
      fontSize: 14,
      fontWeight: 600,
      padding: '10px 24px',
      borderRadius: theme.radius,
      border: primary ? 'none' : `2px solid ${theme.brandColor}`,
      background: primary ? theme.brandColor : 'transparent',
      color: primary ? '#fff' : theme.brandColor,
      cursor: 'pointer',
      marginRight: 12,
    }}
  >
    {label}
  </button>
);

const MockCard: React.FC<{
  title: string;
  desc: string;
  icon: string;
  theme: ThemeVars;
}> = ({ title, desc, icon, theme }) => (
  <div
    style={{
      background: theme.cardBg,
      borderRadius: theme.radius,
      border: `1px solid ${theme.borderColor}`,
      padding: 20,
      flex: 1,
      minWidth: 180,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: theme.radius * 0.6,
        background: `${theme.brandColor}18`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginBottom: 12,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 16,
        fontWeight: 600,
        color: theme.textColor,
        marginBottom: 4,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 13,
        color: theme.subtextColor,
        lineHeight: 1.4,
      }}
    >
      {desc}
    </div>
  </div>
);

const MockProductGrid: React.FC<{ theme: ThemeVars }> = ({ theme }) => {
  const products = [
    { name: 'Wireless Headphones', price: '$89.99', color: '#818CF8' },
    { name: 'Smart Watch', price: '$199.99', color: '#34D399' },
    { name: 'Camera Lens', price: '$349.99', color: '#F472B6' },
    { name: 'Bluetooth Speaker', price: '$59.99', color: '#FBBF24' },
  ];

  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}
    >
      {products.map((p) => (
        <div
          key={p.name}
          style={{
            background: theme.cardBg,
            borderRadius: theme.radius,
            border: `1px solid ${theme.borderColor}`,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              height: 100,
              background: `linear-gradient(135deg, ${p.color}44, ${p.color}22)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: p.color,
                opacity: 0.6,
              }}
            />
          </div>
          <div style={{ padding: 12 }}>
            <div
              style={{
                fontFamily: theme.font,
                fontSize: 13,
                fontWeight: 600,
                color: theme.textColor,
                marginBottom: 4,
              }}
            >
              {p.name}
            </div>
            <div
              style={{
                fontFamily: theme.font,
                fontSize: 14,
                fontWeight: 700,
                color: theme.brandColor,
              }}
            >
              {p.price}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MockList: React.FC<{ theme: ThemeVars }> = ({ theme }) => {
  const items = [
    { label: 'New dashboard redesign launched', date: 'Mar 18, 2026' },
    { label: 'API v3 now available for developers', date: 'Mar 15, 2026' },
    { label: 'Security patch applied to all servers', date: 'Mar 12, 2026' },
    { label: 'Mobile app update rolled out', date: 'Mar 10, 2026' },
  ];

  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: theme.radius,
        border: `1px solid ${theme.borderColor}`,
        overflow: 'hidden',
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderBottom:
              i < items.length - 1 ? `1px solid ${theme.borderColor}` : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: theme.brandColor,
              }}
            />
            <span
              style={{
                fontFamily: theme.font,
                fontSize: 14,
                color: theme.textColor,
              }}
            >
              {item.label}
            </span>
          </div>
          <span
            style={{
              fontFamily: theme.font,
              fontSize: 12,
              color: theme.subtextColor,
            }}
          >
            {item.date}
          </span>
        </div>
      ))}
    </div>
  );
};

const MockResourceCards: React.FC<{ theme: ThemeVars }> = ({ theme }) => {
  const resources = [
    { icon: '📝', label: 'Form', desc: 'Collect data' },
    { icon: '✍️', label: 'Sign Document', desc: 'E-signatures' },
    { icon: '📊', label: 'Table', desc: 'Organize data' },
    { icon: '📄', label: 'Document', desc: 'Create docs' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
      {resources.map((r) => (
        <div
          key={r.label}
          style={{
            background: theme.cardBg,
            borderRadius: theme.radius,
            border: `1px solid ${theme.borderColor}`,
            padding: 20,
            textAlign: 'center' as const,
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>{r.icon}</div>
          <div
            style={{
              fontFamily: theme.font,
              fontSize: 15,
              fontWeight: 600,
              color: theme.textColor,
              marginBottom: 2,
            }}
          >
            {r.label}
          </div>
          <div
            style={{
              fontFamily: theme.font,
              fontSize: 12,
              color: theme.subtextColor,
            }}
          >
            {r.desc}
          </div>
        </div>
      ))}
    </div>
  );
};

const MockForm: React.FC<{ theme: ThemeVars }> = ({ theme }) => {
  const fields = ['Full Name', 'Email Address', 'Phone Number'];

  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: theme.radius,
        border: `1px solid ${theme.borderColor}`,
        padding: 28,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {fields.map((f) => (
        <div key={f} style={{ marginBottom: 16 }}>
          <label
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              fontWeight: 600,
              color: theme.textColor,
              display: 'block',
              marginBottom: 6,
            }}
          >
            {f}
          </label>
          <div
            style={{
              height: 40,
              borderRadius: theme.radius,
              border: `1px solid ${theme.borderColor}`,
              background: theme.bgColor,
            }}
          />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <MockButton label="Submit" primary theme={theme} />
        <MockButton label="Cancel" theme={theme} />
      </div>
    </div>
  );
};

const MockTestimonial: React.FC<{ theme: ThemeVars }> = ({ theme }) => (
  <div
    style={{
      background: theme.cardBg,
      borderRadius: theme.radius,
      border: `1px solid ${theme.borderColor}`,
      padding: 28,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
  >
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 18,
        color: theme.textColor,
        lineHeight: 1.6,
        fontStyle: 'italic',
        marginBottom: 16,
      }}
    >
      "This platform transformed how we build apps. The component library is
      incredibly flexible and the theming system is a dream to work with."
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.brandColor}, ${theme.brandColor}88)`,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 14,
            fontWeight: 600,
            color: theme.textColor,
          }}
        >
          Sarah Chen
        </div>
        <div
          style={{
            fontFamily: theme.font,
            fontSize: 12,
            color: theme.subtextColor,
          }}
        >
          Product Manager at TechCorp
        </div>
      </div>
    </div>
  </div>
);

const MockDonation: React.FC<{ theme: ThemeVars }> = ({ theme }) => (
  <div
    style={{
      background: theme.cardBg,
      borderRadius: theme.radius,
      border: `1px solid ${theme.borderColor}`,
      padding: 28,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}
  >
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 20,
        fontWeight: 700,
        color: theme.textColor,
        marginBottom: 4,
      }}
    >
      Support Our Mission
    </div>
    <div
      style={{
        fontFamily: theme.font,
        fontSize: 13,
        color: theme.subtextColor,
        marginBottom: 16,
      }}
    >
      Help us reach our goal of $10,000
    </div>
    {/* Progress bar */}
    <div
      style={{
        height: 10,
        borderRadius: 99,
        background: `${theme.brandColor}22`,
        marginBottom: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '68%',
          height: '100%',
          borderRadius: 99,
          background: theme.brandColor,
        }}
      />
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: theme.font,
        fontSize: 12,
        color: theme.subtextColor,
        marginBottom: 20,
      }}
    >
      <span>
        <strong style={{ color: theme.brandColor }}>$6,800</strong> raised
      </span>
      <span>$10,000 goal</span>
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
      {['$10', '$25', '$50', '$100'].map((amt) => (
        <div
          key={amt}
          style={{
            flex: 1,
            textAlign: 'center' as const,
            padding: '10px 0',
            borderRadius: theme.radius,
            border: `2px solid ${theme.brandColor}`,
            fontFamily: theme.font,
            fontSize: 14,
            fontWeight: 600,
            color: theme.brandColor,
          }}
        >
          {amt}
        </div>
      ))}
    </div>
  </div>
);

const MockSocial: React.FC<{ theme: ThemeVars }> = ({ theme }) => {
  const socials = [
    { icon: 'f', label: 'Facebook', color: '#1877F2' },
    { icon: '𝕏', label: 'Twitter', color: '#000' },
    { icon: 'in', label: 'LinkedIn', color: '#0A66C2' },
    { icon: '▶', label: 'YouTube', color: '#FF0000' },
    { icon: '📷', label: 'Instagram', color: '#E4405F' },
  ];

  return (
    <div
      style={{
        background: theme.cardBg,
        borderRadius: theme.radius,
        border: `1px solid ${theme.borderColor}`,
        padding: 24,
        textAlign: 'center' as const,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 18,
          fontWeight: 700,
          color: theme.textColor,
          marginBottom: 4,
        }}
      >
        Follow Us
      </div>
      <div
        style={{
          fontFamily: theme.font,
          fontSize: 13,
          color: theme.subtextColor,
          marginBottom: 20,
        }}
      >
        Stay connected on social media
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 14,
        }}
      >
        {socials.map((s) => (
          <div
            key={s.label}
            style={{
              width: 44,
              height: 44,
              borderRadius: theme.radius * 0.6,
              background: `${s.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: theme.font,
              fontSize: 16,
              fontWeight: 700,
              color: s.color,
            }}
          >
            {s.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Phase 2 indicator labels ────────────────────────────────────────────────

const PhaseLabel: React.FC<{
  frame: number;
  startFrame: number;
  endFrame: number;
  label: string;
  theme: ThemeVars;
}> = ({ frame, startFrame, endFrame, label, theme }) => {
  const fps = 30;
  const enter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const exit = spring({
    frame: frame - (endFrame - 10),
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  if (frame < startFrame || frame > endFrame + 15) return null;

  const progress = Math.max(0, Math.min(1, enter));
  const exitProgress = Math.max(0, Math.min(1, exit));
  const opacity = progress * (1 - exitProgress);
  const translateY = interpolate(progress, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        right: 32,
        background: theme.brandColor,
        color: '#fff',
        fontFamily: theme.font,
        fontSize: 14,
        fontWeight: 600,
        padding: '8px 20px',
        borderRadius: theme.radius,
        opacity,
        transform: `translateY(${translateY}px)`,
        zIndex: 100,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      {label}
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────

export const AppShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme(frame, fps);

  // Element enter frames (staggered over 0-360)
  const enters = {
    hero: 15,
    products: 55,
    cards: 110,
    list: 165,
    resources: 210,
    form: 255,
    testimonial: 295,
    donation: 330,
    social: 350,
  };

  // Calculate auto-scroll offset
  const totalContentHeight = 2200;
  const viewportHeight = 1000;
  const maxScroll = totalContentHeight - viewportHeight + 60;

  const scrollY = interpolate(frame, [50, 360], [0, maxScroll], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const finalScroll = frame < 50 ? 0 : Math.min(scrollY, maxScroll);

  return (
    <div
      style={{
        width: 1280,
        height: 1000,
        background: theme.bgColor,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: theme.font,
      }}
    >
      {/* Phase 2 labels */}
      <PhaseLabel frame={frame} startFrame={380} endFrame={420} label="🎨 Color → Blue" theme={theme} />
      <PhaseLabel frame={frame} startFrame={430} endFrame={470} label="🔤 Font → Fredoka" theme={theme} />
      <PhaseLabel frame={frame} startFrame={480} endFrame={520} label="⬜ Radius → XLarge" theme={theme} />
      <PhaseLabel frame={frame} startFrame={530} endFrame={575} label="🌙 Dark Mode" theme={theme} />

      {/* Scrollable content area */}
      <div
        style={{
          transform: `translateY(${-finalScroll}px)`,
          padding: '40px 60px',
        }}
      >
        {/* 1. Hero heading + buttons */}
        <AnimatedElement enterFrame={enters.hero} direction="right">
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.brandColor}12, ${theme.brandColor}06)`,
              borderRadius: theme.radius,
              padding: '48px 40px',
              marginBottom: 0,
            }}
          >
            <h1
              style={{
                fontFamily: theme.font,
                fontSize: 40,
                fontWeight: 800,
                color: theme.textColor,
                margin: '0 0 8px 0',
              }}
            >
              Welcome to Our Store
            </h1>
            <p
              style={{
                fontFamily: theme.font,
                fontSize: 16,
                color: theme.subtextColor,
                margin: '0 0 24px 0',
                maxWidth: 500,
              }}
            >
              Discover amazing products curated just for you.
            </p>
            <div style={{ display: 'flex' }}>
              <MockButton label="Get Started" primary theme={theme} />
              <MockButton label="Learn More" theme={theme} />
            </div>
          </div>
        </AnimatedElement>

        {/* 2. Featured Products */}
        <AnimatedElement enterFrame={enters.products} direction="left">
          <MockHeading
            title="Featured Products"
            subtitle="Our most popular items this season"
            theme={theme}
          />
          <MockProductGrid theme={theme} />
        </AnimatedElement>

        {/* 3. Cards section */}
        <AnimatedElement enterFrame={enters.cards} direction="right">
          <MockHeading
            title="Why Choose Us"
            subtitle="Everything you need in one place"
            theme={theme}
          />
          <div style={{ display: 'flex', gap: 16 }}>
            <MockCard
              icon="⚡"
              title="Lightning Fast"
              desc="Optimized performance for the best experience"
              theme={theme}
            />
            <MockCard
              icon="🔒"
              title="Secure"
              desc="Enterprise-grade security for your data"
              theme={theme}
            />
            <MockCard
              icon="🎯"
              title="Reliable"
              desc="99.9% uptime guarantee on all services"
              theme={theme}
            />
          </div>
        </AnimatedElement>

        {/* 4. Recent Updates list */}
        <AnimatedElement enterFrame={enters.list} direction="bottom">
          <MockHeading
            title="Recent Updates"
            subtitle="What's new in our platform"
            theme={theme}
          />
          <MockList theme={theme} />
        </AnimatedElement>

        {/* 5. Resources */}
        <AnimatedElement enterFrame={enters.resources} direction="left">
          <MockHeading
            title="Resources"
            subtitle="Tools to help you get things done"
            theme={theme}
          />
          <MockResourceCards theme={theme} />
        </AnimatedElement>

        {/* 6. Registration form */}
        <AnimatedElement enterFrame={enters.form} direction="right">
          <MockHeading title="Registration" subtitle="Create your account" theme={theme} />
          <MockForm theme={theme} />
        </AnimatedElement>

        {/* 7. Testimonial */}
        <AnimatedElement enterFrame={enters.testimonial} direction="bottom">
          <MockHeading title="What People Say" theme={theme} />
          <MockTestimonial theme={theme} />
        </AnimatedElement>

        {/* 8. Donation box */}
        <AnimatedElement enterFrame={enters.donation} direction="left">
          <MockDonation theme={theme} />
        </AnimatedElement>

        {/* 9. Social follow */}
        <AnimatedElement enterFrame={enters.social} direction="bottom">
          <MockSocial theme={theme} />
        </AnimatedElement>
      </div>
    </div>
  );
};
