import React from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CustomCTA from "../home/CustomCTA";
import Mission from "./Mission";
// import OurTeam from "./OurTeam";
import HowWeWork from "./HowWeWork";
import IntellisyncSolutions from "./IntellisyncSolutions";
import SEO from '../../components/SEO';
import { getOrganizationSchema, getBreadcrumbSchema } from '../../utils/structuredData';


const About: React.FC = () => {
  // Create structured data
  const organizationSchema = getOrganizationSchema();
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' }
  ]);
  
  // Combine schemas
  const structuredData = [organizationSchema, breadcrumbSchema];
  
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Intellisync Solutions, our mission, our team, and how we work to deliver innovative AI and technology solutions."
        canonicalUrl="/about"
        keywords="about Intellisync, AI company, technology team, AI solutions provider, custom AI development"
        structuredData={structuredData}
      />
      <Header />
      <Mission />
      {/* <OurTeam /> */}
      <HowWeWork />
      <IntellisyncSolutions />
      <CustomCTA />
      <Footer />
    </>
  );
};

export default About;
