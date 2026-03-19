export { getCmsIcon, CMS_ICONS } from './cms-icons';
export { getNetworkIcon, NETWORK_ICONS } from './network-icons';
export { getServiceIcon, SERVICE_ICONS } from './service-icons';

import { Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CMS_ICONS } from './cms-icons';
import { NETWORK_ICONS } from './network-icons';
import { SERVICE_ICONS } from './service-icons';

export function getIcon(name: string): LucideIcon {
  return SERVICE_ICONS[name] ?? CMS_ICONS[name] ?? NETWORK_ICONS[name] ?? Star;
}
