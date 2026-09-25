import React from "react";
import WhyChooseUsGrid, { WhyChooseUsGridProps } from "./WhyChooseUsGrid";

export interface WhyChooseUsProps extends WhyChooseUsGridProps {}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = (props) => {
  return <WhyChooseUsGrid {...props} />;
};

export default WhyChooseUs;
export { WhyChooseUsGrid };
