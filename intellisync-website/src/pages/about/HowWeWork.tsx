import { motion } from "framer-motion";
import { Brain, Settings, Server } from "lucide-react";

const PROCESS = [
  {
    icon: Brain,
    title: "AI Systems",
    desc: "We design and build comprehensive AI systems—integrating custom models, data pipelines, and deployment infrastructure—to deliver intelligent solutions that scale with your goals.",
    img: "/assets/images/AIsystems.png",
  },
  {
    icon: Settings,
    title: "Tool & Function Calls",
    desc: "We integrate advanced tool and function calls, empowering our AI to solve real-world challenges dynamically and responsively.",
    img: "/assets/images/ToolFunctionCall.png",
  },
  {
    icon: Server,
    title: "Custom MCP Servers",
    desc: "We engineer custom MCP servers, enabling AI models to interact with the digital world and execute tasks seamlessly.",
    img: "/assets/images/MCPserver.png",
  },
];

export default function HowWeWork() {
  return (
    <section className="w-full bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] py-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent mb-10 drop-shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Our Tech Stack
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          {PROCESS.map((step, idx) => (
            <motion.div
              key={step.title}
              className="flex flex-col items-center bg-black/30 rounded-2xl p-8 shadow-xl backdrop-blur-md border border-accent2 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + idx * 0.1, ease: 'easeOut' }}
            >
              <step.icon className="w-12 h-12 mb-4 text-accent1" />
              <span className="font-header text-xl font-bold text-white mb-2">{step.title}</span>
              <span className="text-accent1 font-body text-base mb-4">{step.desc}</span>
              <motion.img
                src={step.img}
                alt={step.title}
                className="w-full h-48 object-contain rounded-xl shadow-md mt-2"
                whileHover={{ scale: 1.05 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
