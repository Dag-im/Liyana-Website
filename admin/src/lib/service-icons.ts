import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Ambulance,
  BadgePlus,
  Building2,
  Factory,
  FlaskConical,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Hospital,
  Microscope,
  Pill,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  TestTubeDiagonal,
  Truck,
  UserRoundSearch,
  Users,
} from 'lucide-react'

export const SERVICE_ICONS: Record<string, LucideIcon> = {
  Hospital,
  Stethoscope,
  HeartPulse,
  Microscope,
  FlaskConical,
  Pill,
  Factory,
  GraduationCap,
  Building2,
  Activity,
  Ambulance,
  BadgePlus,
  HandHeart,
  ShieldCheck,
  Sparkles,
  Syringe,
  TestTubeDiagonal,
  Truck,
  UserRoundSearch,
  Users,
}

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICONS).map((name) => ({
  value: name,
  label: name,
  Icon: SERVICE_ICONS[name],
}))

export function getServiceIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? Hospital
}
