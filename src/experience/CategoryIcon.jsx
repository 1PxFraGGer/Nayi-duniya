import { ICONS, iconKeyFor } from './icons';

export default function CategoryIcon({ name, ...rest }) {
  const Icon = ICONS[iconKeyFor(name)];
  return <Icon {...rest} />;
}
