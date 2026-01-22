export default function Logo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  }

  return (
    <div className={`flex items-center gap-2 md:gap-3 ${className}`}>
      {/* Icon/Emoji */}
      <div className="flex-shrink-0">
        <span className="text-3xl md:text-4xl">🥟</span>
      </div>
      
      {/* Text */}
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 leading-tight ${sizeClasses[size]}`}>
          Pastelada
        </span>
        <span className="text-xs md:text-sm text-gray-600 font-medium">
          GOJ Imac
        </span>
      </div>
    </div>
  )
}
