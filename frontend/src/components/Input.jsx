import React from "react";
import clsx from "clsx";

export const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className={clsx("mb-4 w-full", className)}>
      {label && <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide uppercase">{label}</label>}
      <input 
        ref={ref}
        className={clsx("input-minimal", error && "border-red-500 focus:border-red-500")}
        {...props} 
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
