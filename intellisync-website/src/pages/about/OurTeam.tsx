import { motion } from "framer-motion";

const TEAM = [
  {
    name: "Chris June",
    role: "Founder & Lead AI Architect",
    img: "/assets/images/Chris.jpg",
  },
  {
    name: "Aimee June",
    role: "Co-Founder & COO",
    img: "/assets/images/Aimee.jpg",
  },
  {
    name: "Abbey June",
    role: "Design, Testing & QC",
    img: "", // Will be updated later
  },
];

export default function OurTeam() {
  return (
    <section className="w-full bg-gradient-to-br from-[#232946] via-[#1a1a2e] to-[#090d1f] py-20 px-4 md:px-0">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-extrabold bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent mb-10 drop-shadow-lg"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          Meet Our Team
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
          {TEAM.map((member, idx) => (
            <motion.div
              key={member.name}
              className="flex flex-col items-center bg-black/30 rounded-2xl p-6 shadow-lg backdrop-blur-md border border-accent2 hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + idx * 0.1, ease: 'easeOut' }}
            >
              <motion.img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-accent1 shadow-md hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.08 }}
              />
              <span className="font-header text-xl font-bold text-white mb-1">{member.name}</span>
              <span className="text-accent1 font-body text-base">{member.role}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
