import { useState } from 'react';
import { planTiers } from './pricingData';
import { motion } from 'framer-motion';
import { DollarSign, ChevronRight } from 'lucide-react';

const PlanTable = () => {
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const togglePlan = (index: number) => {
    setExpandedPlan(expandedPlan === index ? null : index);
  };

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white">
      <motion.div
        className="max-w-5xl mx-auto px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-6 md:mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-accent1" />
          <h2 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(76,91,255,0.45)]">
            Plan Tiers
          </h2>
        </motion.div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <motion.div
            className="bg-black/30 backdrop-blur-md rounded-3xl shadow-2xl border border-accent2/30 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <table className="min-w-full">
              <thead className="border-b border-accent2/40">
                <tr>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-left">Plan Tier</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-center">Monthly Fee</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-center">Support Tickets</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-center">Updates</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-center">Hours</th>
                  <th className="px-4 py-3 text-sm md:text-base font-semibold text-accent1 text-center">Extras</th>
                </tr>
              </thead>
              <tbody>
                {planTiers.map((plan, index) => (
                  <motion.tr
                    key={plan.name}
                    className="border-b border-accent2/20 last:border-b-0 hover:bg-accent2/10 transition"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <td className="px-4 py-3 font-bold text-cta whitespace-nowrap">{plan.name}</td>
                    <td className="px-4 py-3 text-center">
                      {plan.note && <div className="text-xs text-white/50 mb-1">{plan.note}</div>}
                      <span className="font-semibold text-white">
                        ${plan.price}{typeof plan.price === 'number' ? '/month' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/80 text-center">{plan.supportRequests}</td>
                    <td className="px-4 py-3 text-white/80 text-center">{plan.systemUpdates}</td>
                    <td className="px-4 py-3 text-white/80 text-center whitespace-nowrap">
                      {plan.includedHours} hr{plan.includedHours !== 1 ? 's' : ''}/month
                    </td>
                    <td className="px-4 py-3 text-white/80 text-center">{plan.extras}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {planTiers.map((plan, index) => (
            <motion.div
              key={plan.name}
              className="bg-black/30 backdrop-blur-md rounded-2xl shadow-xl border border-accent2/30 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                className="w-full px-4 py-3 flex items-center justify-between text-left"
                onClick={() => togglePlan(index)}
                aria-expanded={expandedPlan === index}
                aria-controls={`plan-details-${index}`}
              >
                <div>
                  <div className="font-bold text-cta text-lg">{plan.name}</div>
                  <div className="text-sm text-white/80">
                    ${plan.price}{typeof plan.price === 'number' ? '/month' : ''}
                    {plan.note && <span className="ml-2 text-xs text-white/50">({plan.note})</span>}
                  </div>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-accent1 transition-transform duration-200 ${
                    expandedPlan === index ? 'transform rotate-90' : ''
                  }`} 
                />
              </button>
              
              <div 
                id={`plan-details-${index}`}
                className={`px-4 pb-4 space-y-2 overflow-hidden transition-all duration-200 ${
                  expandedPlan === index ? 'max-h-96' : 'max-h-0 py-0'
                }`}
              >
                <div className="pt-2 border-t border-accent2/20">
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-white/70">Support Requests:</span>
                    <span className="text-sm font-medium">{plan.supportRequests}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-white/70">System Updates:</span>
                    <span className="text-sm font-medium">{plan.systemUpdates}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-white/70">Included Hours:</span>
                    <span className="text-sm font-medium">
                      {plan.includedHours} hr{plan.includedHours !== 1 ? 's' : ''}/month
                    </span>
                  </div>
                  {plan.extras && (
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-white/70">Extras:</span>
                      <span className="text-sm font-medium text-right">{plan.extras}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PlanTable;
