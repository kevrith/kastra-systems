import React from 'react';

//   Reusable Card Component
//   Provides a consistent card design throughout the application

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '', 
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  shadow = 'md',
  hover = false,
  onClick,
  padding = true
}) => {
  // Shadow variants
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  // Hover effect
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-300 cursor-pointer' : '';

  return (
    <div 
      className={`bg-white rounded-lg ${shadowClasses[shadow]} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className={`border-b border-gray-200 ${padding ? 'p-6' : ''} ${headerClassName}`}>
          {title && (
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`${padding ? 'p-6' : ''} ${bodyClassName}`}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-gray-200 ${padding ? 'p-6' : ''} ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

// InfoCard - Card with icon and color accent
 
export const InfoCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description,
  color = 'blue',
  trend,
  className = '' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className={className} hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};

// ListCard - Card for displaying list items

export const ListCard = ({ 
  title, 
  items = [], 
  emptyMessage = 'No items',
  renderItem,
  className = '' 
}) => {
  return (
    <Card title={title} className={className} padding={false}>
      <div className="divide-y divide-gray-200">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition">
              {renderItem ? renderItem(item, index) : item}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

// ActionCard - Card with action buttons
 
export const ActionCard = ({ 
  title, 
  description, 
  children,
  actions = [],
  icon: Icon,
  className = '' 
}) => {
  return (
    <Card className={className}>
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className="flex-shrink-0">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        )}
        <div className="flex-1">
          {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
          {description && <p className="text-gray-600 mt-1">{description}</p>}
          {children && <div className="mt-4">{children}</div>}
          {actions.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`px-4 py-2 rounded-lg transition ${
                    action.primary
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// ImageCard - Card with image

export const ImageCard = ({ 
  image, 
  title, 
  description, 
  badge,
  onClick,
  className = '' 
}) => {
  return (
    <Card className={className} padding={false} hover onClick={onClick}>
      {image && (
        <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          {badge && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-sm font-medium shadow">
              {badge}
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
        {description && <p className="text-gray-600 mt-2">{description}</p>}
      </div>
    </Card>
  );
};

//  GridCard - Card in a grid layout

export const GridCard = ({ 
  icon: Icon,
  title, 
  value, 
  subtitle,
  color = 'blue',
  className = '' 
}) => {
  const borderColors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
  };

  const iconColors = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <Card 
      className={`border-l-4 ${borderColors[color]} ${className}`}
      hover
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${iconColors[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};


// CompactCard - Smaller card for dashboard widgets

export const CompactCard = ({ 
  title, 
  children, 
  action,
  className = '' 
}) => {
  return (
    <Card className={className} shadow="sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        {action && (
          <button 
            onClick={action.onClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {action.label}
          </button>
        )}
      </div>
      {children}
    </Card>
  );
};

export default Card;