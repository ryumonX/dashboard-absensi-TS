import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },

  // Menu Student
  { key: 'student', title: 'Student', href: paths.dashboard.student, icon: 'users' },

  // Menu Absensi
  { key: 'absensi', title: 'Absensi', href: paths.dashboard.absensi, icon: 'calendar-check' },

  // Menu Grade
  { key: 'grade', title: 'Grade', href: paths.dashboard.grade, icon: 'graduation-cap' },

  { key: 'subject', title: 'Subject', href: paths.dashboard.subject, icon: 'graduation-cap' },

  { key: 'user', title: 'user', href: paths.dashboard.user, icon: 'users' },


  // Menu lainnya
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
