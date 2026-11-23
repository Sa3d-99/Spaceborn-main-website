export default function Icon({ name, className }: { name: string; className?: string }) {
  return <i className={`fa-solid fa-${name}${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
