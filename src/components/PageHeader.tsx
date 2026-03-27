import { ReactNode } from "react";

interface PageHeaderProps {
  label: string;
  title: ReactNode;
  subtitle?: string;
}

const PageHeader = ({ label, title, subtitle }: PageHeaderProps) => (
  <div className="pt-32 pb-16 relative overflow-hidden">
    <div className="blur-orb w-[400px] h-[400px] -top-40 -right-40" />
    <div className="container mx-auto px-6 relative z-10">
      <p className="pink-label mb-4">{label}</p>
      <h1 className="section-heading max-w-3xl">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-4 max-w-xl">{subtitle}</p>
      )}
    </div>
  </div>
);

export default PageHeader;
