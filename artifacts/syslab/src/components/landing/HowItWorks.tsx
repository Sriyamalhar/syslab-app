import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
    { num: '01', title: 'Design', desc: 'Drag and drop components to map out your infrastructure.' },
    { num: '02', title: 'Simulate', desc: 'Pump traffic through the system and watch the metrics.' },
    { num: '03', title: 'Break', desc: 'Introduce chaos to find bottlenecks and single points of failure.' }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 justify-between relative">
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-border z-0" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center flex-1"
            >
              <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center shadow-xl mb-6 relative">
                <div className="absolute inset-0 rounded-full border border-primary/20 pointer-events-none" />
                <span className="text-3xl font-bold text-primary">{step.num}</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
