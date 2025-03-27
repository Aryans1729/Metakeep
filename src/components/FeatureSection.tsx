import React from "react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 border border-gray-800 transition-all duration-300 hover:border-gray-700 hover:translate-y-[-2px]">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features: FeatureProps[];
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  subtitle,
  features,
}) => {
  return (
    <div className="py-16">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>}
          {subtitle && <p className="text-xl text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Feature 
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;