import clsx from "clsx";

export const Card = ({ children, className, title }) => {
  return (
    <div className={clsx("card-minimal", className)}>
      {title && <h3 className="text-xl font-bold mb-4 text-dark-slate tracking-tight">{title}</h3>}
      {children}
    </div>
  );
};
