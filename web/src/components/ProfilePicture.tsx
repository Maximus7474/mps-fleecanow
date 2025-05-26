interface ProfilePictureProps {
  src: string;
  className?: string;
  alt?: string;
  fallback?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  src,
  className,
  alt,
  fallback = 'https://cdn-icons-png.flaticon.com/512/10701/10701484.png',
}) => {
  const handleError = ({ currentTarget }: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // avoid looping
    currentTarget.onerror = null;
    currentTarget.src = fallback;
  };

  return <img className={className} src={src} alt={alt} onError={handleError} />;
};

export default ProfilePicture;
