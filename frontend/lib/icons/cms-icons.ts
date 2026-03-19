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
  Users,
  UserCheck,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
};

export function getCmsIcon(name: string): LucideIcon {
  return CMS_ICONS[name] ?? Star;
}
