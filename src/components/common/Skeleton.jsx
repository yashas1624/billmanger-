/**
 * Skeleton Loader
 */
export const Skeleton = ({ className = '', height = '16px', width = '100%', radius = 'md' }) => {
  const radiusClasses = { sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' };
  return (
    <div
      className={`animate-pulse bg-gray200 ${radiusClasses[radius]} ${className}`}
      style={{ height, width }}
    />
  );
};
