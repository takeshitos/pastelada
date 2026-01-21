export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: boolean;
}

export default function Container({ 
  children, 
  size = 'lg', 
  className = '',
  padding = true 
}: ContainerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-2xl';
      case 'md':
        return 'max-w-4xl';
      case 'lg':
        return 'max-w-7xl';
      case 'xl':
        return 'max-w-screen-xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-7xl';
    }
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <div className={`mx-auto ${getSizeClasses()} ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
}

// Responsive grid container
export interface GridContainerProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function GridContainer({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className = '' 
}: GridContainerProps) {
  const getGridClasses = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    classes.push(`gap-${gap}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {children}
    </div>
  );
}

// Responsive flex container
export interface FlexContainerProps {
  children: React.ReactNode;
  direction?: 'row' | 'col';
  responsive?: {
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: number;
  className?: string;
}

export function FlexContainer({ 
  children, 
  direction = 'row',
  responsive,
  justify = 'start',
  align = 'start',
  gap = 4,
  className = '' 
}: FlexContainerProps) {
  const getFlexClasses = () => {
    const classes = ['flex'];
    
    // Direction
    classes.push(`flex-${direction}`);
    if (responsive?.sm) classes.push(`sm:flex-${responsive.sm}`);
    if (responsive?.md) classes.push(`md:flex-${responsive.md}`);
    if (responsive?.lg) classes.push(`lg:flex-${responsive.lg}`);
    
    // Justify
    const justifyMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };
    classes.push(justifyMap[justify]);
    
    // Align
    const alignMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    };
    classes.push(alignMap[align]);
    
    // Gap
    classes.push(`gap-${gap}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getFlexClasses()} ${className}`}>
      {children}
    </div>
  );
}