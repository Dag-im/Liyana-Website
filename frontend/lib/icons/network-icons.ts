import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  Coins,
  Cpu,
  Factory,
  FlaskConical,
  Globe,
  GraduationCap,
  HeartPulse,
  Landmark,
  Layers,
  Microscope,
  Network,
  Pill,
  ShieldPlus,
  Stethoscope,
  Target,
  Truck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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

export function getNetworkIcon(name: string): LucideIcon {
  return NETWORK_ICONS[name] ?? Building2;
}
