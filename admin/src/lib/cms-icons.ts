import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  Globe,
  Heart,
  Leaf,
  Lightbulb,
  Rocket,
  Shield,
  ShieldCheck,
  Smile,
  Star,
  Target,
  ThumbsUp,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react'

export const CMS_ICONS: Record<string, LucideIcon> = {
  Target,
  Eye,
  Star,
  Rocket,
  ShieldCheck,
  Users,
  Leaf,
  UserCheck,
  Heart,
  Zap,
  Globe,
  Award,
  BookOpen,
  Lightbulb,
  TrendingUp,
  Shield,
  CheckCircle,
  Clock,
  Smile,
  ThumbsUp,
}

export const CMS_ICON_OPTIONS = Object.keys(CMS_ICONS).map((name) => ({
  value: name,
  label: name,
  Icon: CMS_ICONS[name],
}))

export function getCmsIcon(name: string): LucideIcon {
  return CMS_ICONS[name] ?? Star
}
