// Button component types
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// Custom Button Component with TypeScript
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: "bg-blue-400 text-white hover:bg-blue-500",
    outline:
      "border border-blue-500 bg-transparent text-blue-600 hover:bg-blue-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 text-gray-700",
    link: "text-blue-600 underline-offset-4 hover:underline",
  };

  // Size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-lg",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={`
          inline-flex items-center justify-center whitespace-nowrap 
          rounded-md font-medium 
          ring-offset-background transition-colors 
          focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
