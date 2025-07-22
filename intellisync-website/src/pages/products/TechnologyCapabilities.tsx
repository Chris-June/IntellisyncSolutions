import { motion } from "framer-motion";
import { Brain, Settings, Server } from "lucide-react";

const TECH_CAPABILITIES = [
  {
    icon: Brain,
    title: "Custom AI Model Fine-Tuning",
    desc: "We fine-tune existing models using your unique data—enhancing performance without reinventing the wheel.",
  },
  {
    icon: Settings,
    title: "Advanced Tool & Function Calls",
    desc: "Empower your AI with dynamic tool and function call capabilities for real-world utility.",
  },
  {
    icon: Server,
    title: "Custom MCP Servers",
    desc: "Enable AI to interact with external systems, APIs, and the digital world securely and reliably.",
  },
];

export default function TechnologyCapabilities() {
  return (
    <section className="w-full bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#090d1f] py-20 px-4 md:px-0">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl pb-4md:text-5xl font-extrabold bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent mb-10 drop-shadow-lg"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            Technology That Empowers
          </motion.h2>
        </div>
        
        {/* Top image showcase --- might remove*/}
        {/* <motion.div
          className="relative w-full mb-24 overflow-hidden rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="aspect-w-21 aspect-h-9 w-full">
            <img 
              src="/assets/images/Empowers.png" 
              alt="Advanced Technology Capabilities" 
              className="object-cover rounded-2xl w-full h-full"
            />
          </div>
        </motion.div> */}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {TECH_CAPABILITIES.map((cap, idx) => (
            <motion.div
              key={cap.title}
              className="flex flex-col items-center bg-black/30 rounded-2xl p-8 shadow-lg backdrop-blur-md border border-accent2"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + idx * 0.1, ease: 'easeOut' }}
            >
              <cap.icon className="w-12 h-12 mb-4 text-accent1" />
              <span className="font-header text-xl font-bold text-white mb-2">{cap.title}</span>
              <span className="text-accent1 font-body text-base">{cap.desc}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Side-by-side image and text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="aspect-w-4 aspect-h-5 w-full">
              <img 
                src="/assets/images/Capabilities.png" 
                alt="AI Technology Detail" 
                className="object-cover rounded-2xl w-full h-full"
              />
            </div>
          </motion.div>
          
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Pushing the Boundaries of What's Possible</h3>
            <p className="text-accent1 text-lg mb-6">
              Our technology stack combines state-of-the-art Open Source, Closed Source and Fine-Tuned AI models with robust infrastructure to deliver solutions that scale with your needs and adapt to changing requirements.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta flex items-center justify-center mt-1">
                  <span className="text-black font-bold">1</span>
                </div>
                <p className="text-white">Local AI model set-up designed to protect your most sensitive data</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta flex items-center justify-center mt-1">
                  <span className="text-black font-bold">2</span>
                </div>
                <p className="text-white">Secure & Scalable on-premises infrastructure without the Privacy Concerns</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cta flex items-center justify-center mt-1">
                  <span className="text-black font-bold">3</span>
                </div>
                <p className="text-white">Continuous improvement through feedback loops and model refinement</p>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
