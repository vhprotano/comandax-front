/**
 * Configuração de Temas da Aplicação ComandaX
 * Define cores, tipografia e espaçamento
 */

export const THEME_CONFIG = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#145231',
    },
    accent: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Poppins', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Temas predefinidos para diferentes estabelecimentos
 */
export const RESTAURANT_THEMES = {
  modern: {
    name: 'Moderno',
    primary: '#2563eb',
    secondary: '#16a34a',
    accent: '#ea580c',
  },
  elegant: {
    name: 'Elegante',
    primary: '#7c3aed',
    secondary: '#db2777',
    accent: '#f59e0b',
  },
  casual: {
    name: 'Casual',
    primary: '#0891b2',
    secondary: '#ec4899',
    accent: '#f97316',
  },
  minimal: {
    name: 'Minimalista',
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#9ca3af',
  },
};

/**
 * Configurações de animação
 */
export const ANIMATION_CONFIG = {
  cardEnter: {
    duration: 0.5,
    delay: 0.1,
    easing: 'power2.out',
  },
  pageTransition: {
    duration: 0.3,
    easing: 'power2.out',
  },
  buttonHover: {
    duration: 0.2,
    easing: 'power2.out',
  },
  notification: {
    duration: 0.5,
    easing: 'back.out',
  },
};

/**
 * Ícones e emojis para diferentes elementos
 */
export const ICONS = {
  roles: {
    MANAGER: '👔',
    WAITER: '👨‍💼',
    KITCHEN: '👨‍🍳',
  },
  actions: {
    add: '➕',
    edit: '✏️',
    delete: '🗑️',
    send: '📤',
    close: '✔️',
    receipt: '🧾',
    logout: '🚪',
  },
  status: {
    open: '🔓',
    sent: '📤',
    ready: '✅',
    closed: '✔️',
    pending: '⏳',
  },
  items: {
    table: '🪑',
    product: '🍽️',
    category: '📂',
    employee: '👥',
    order: '📋',
    history: '📜',
  },
};

