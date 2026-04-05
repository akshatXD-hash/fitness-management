import clsx from "clsx";

export const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseClasses = variant === "outline" ? "btn-outline" : "btn-primary";
  
  return (
    <button className={clsx(baseClasses, className)} {...props}>
      {children}
    </button>
  );
};
