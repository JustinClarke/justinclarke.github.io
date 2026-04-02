/**
 * Global application constants.
 */

export const OTHER_LANGUAGES = [
  "Hola", "Bonjour", "Hallo", "Ciao", "Olá", "Привет", "你好", "こんにちは", "안녕하세요", "مرحباً", "नमस्ते",
  "Merhaba", "Xin chào", "Cześć", "Hej", "Halo", "สวัสดี", "Γειά σου", "שלום", "Namaste",
  "Szia", "Ahoj", "Selam", "Sawubona", "Hujambo", "God dag", "Dia duit", "Bula"
];

export const TERMINAL_LOGS = [
  { tag: '[BOOT]', text: 'GRUB_LOADER_v2.04_SUCCESS', isStatus: false },
  { tag: '[KERN]', text: 'MOUNTING_ROOT_FS_READ_ONLY', isStatus: false },
  { tag: '[INIT]', text: 'STARTING_SYSTEM_DAEMONS', isStatus: false },
  { tag: '[DRV]', text: 'NVIDIA_RTX_3080_INITIALIZED', isStatus: false },
  { tag: '[USER]', text: 'AUTHENTICATED_SESSION_JUSTIN', isStatus: true },
];

export const PIPELINE_COLORS = ['#00c8b4', '#5eead4', '#2dd4bf'] as const;

export const PRELOADER_TIMELINE = {
  SLOW_PHASE_DURATION: 0.9,
  FAST_PHASE_DURATION: 0.6,
  STILLNESS_DURATION: 0.5,
  TOTAL_DURATION: 2.0,
  EXIT_DURATION: 1.2,
};
