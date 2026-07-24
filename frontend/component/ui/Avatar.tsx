interface AvatarProps {
  src?: string;
  name: string;
  size?: number;
}

export default function Avatar({
  src,
  name,
  size = 50,
}: AvatarProps) {
  return (
    <img
      src={
        src ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
      }
      alt={name}
      width={size}
      height={size}
      className="rounded-full border object-cover"
    />
  );
}