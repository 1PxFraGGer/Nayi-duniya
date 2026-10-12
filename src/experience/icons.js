import { FiCamera, FiCalendar, FiCpu, FiDroplet, FiEdit3, FiGrid, FiHome, FiImage, FiShield, FiThermometer, FiTool, FiTruck, FiWind, FiZap, FiScissors, FiMonitor } from 'react-icons/fi';

// Icons are chosen from the category name, so new backend categories still get a sensible glyph.
const ICONS = { camera: FiCamera, shield: FiShield, droplet: FiDroplet, zap: FiZap, thermo: FiThermometer, cpu: FiCpu, monitor: FiMonitor, wind: FiWind, edit: FiEdit3, image: FiImage, calendar: FiCalendar, scissors: FiScissors, truck: FiTruck, tool: FiTool, home: FiHome, grid: FiGrid };
const rules = [
  [/cctv|camera|surveillance/i, 'camera'],
  [/secur|lock|guard/i, 'shield'],
  [/plumb|water|pipe|tap|leak|sanit/i, 'droplet'],
  [/electr|wiring|light|inverter/i, 'zap'],
  [/\bac\b|air.?con|cooling|heat/i, 'thermo'],
  [/appliance|refriger|washing|microwave/i, 'cpu'],
  [/tv|computer|laptop|network|wifi|it\b/i, 'monitor'],
  [/clean|pest|laundry|sanitis|polish|wash/i, 'wind'],
  [/paint|decor|interior|wall|design/i, 'edit'],
  [/photo|video|film|shoot/i, 'image'],
  [/event|wedding|party|catering/i, 'calendar'],
  [/salon|beauty|hair|spa|makeup/i, 'scissors'],
  [/move|packer|shift|transport|vehicle|car/i, 'truck'],
  [/repair|install|maint|carpent|fix|furnit/i, 'tool'],
  [/home|house|garden|care/i, 'home'],
];
export const iconKeyFor = (name = '') => rules.find(([pattern]) => pattern.test(name))?.[1] || 'grid';
export { ICONS };
export const tintFor = index => `tint-${index % 5}`;
