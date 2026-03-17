import {
  Activity,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  Globe,
  GraduationCap,
  Microscope,
  Network,
  Pill,
  Target,
  Landmark,
  HeartPulse,
  FlaskConical,
  Truck,
  Stethoscope,
  ShieldPlus,
  BarChart3,
  Layers,
  Coins,
  type LucideIcon,
} from 'lucide-react';

export const NETWORK_ICONS: Record<string, LucideIcon> = {
  Activity,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  Globe,
  GraduationCap,
  Microscope,
  Network,
  Pill,
  Target,
  Landmark,
  HeartPulse,
  FlaskConical,
  Truck,
  Stethoscope,
  ShieldPlus,
  BarChart3,
  Layers,
  Coins,
};

export const NETWORK_ICON_OPTIONS = Object.keys(NETWORK_ICONS).map((name) => ({
  value: name,
  label: name,
  Icon: NETWORK_ICONS[name],
}));

export function getNetworkIcon(name: string): LucideIcon {
  return NETWORK_ICONS[name] ?? Building2;
}
