interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
}

export const Logo = ({ size = 'md', className }: LogoProps) => {
  const dimensions = {
    sm: 50,
    md: 120,
    lg: 150,
  };

  const width = typeof size === "number" ? size : dimensions[size];
  const height = width

  return (
    <svg
          width={width}
          height={height}
          viewBox="60 60 470 470"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-labelledby="logoTitle logoDesc"
                role="img"
                aria-label="Fundraider Logo"
        >
          <image
            href="/fundraider_logo.webp"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
    )
}
