import { motion } from 'framer-motion';
import { Database, Network, Cpu, ShieldAlert, BarChart3, CloudLightning } from 'lucide-react';

const features = [
  {
    title: 'Visual Architecture',
    description: 'Design complex distributed systems with an intuitive drag-and-drop canvas. 40+ built-in components covering databases, queues, gateways, and more.',
    icon: Network,
  },
  {
    title: 'Live Simulation Engine',
    description: 'Run traffic through your architecture. Watch requests propagate, queues fill up, and latency spike when under heavy load.',
    icon: Cpu,
  },
  {
    title: 'Chaos Engineering',
    description: 'Inject faults into your system. Kill servers, add network latency, and trigger database crashes to test resilience.',
    icon: ShieldAlert,
  },
  {
    title: 'Real-time Metrics',
    description: 'Monitor CPU, memory, request rates, and error rates per component with live-updating Grafana-style charts.',
    icon: BarChart3,
  },
  {
    title: 'Cloud Native Library',
    description: 'Use realistic models for AWS, GCP, and open-source infrastructure components with pre-configured latency and capacity.',
    icon: CloudLightning,
  },
  {
    title: 'Stateful Persistence',
    description: 'Save your projects, duplicate templates, and share your designs with the team. Everything is stored securely in the cloud.',
    icon: Database,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-card/30 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to master scale</h2>
          <p className="text-muted-foreground text-lg">
            Stop guessing how your system will behave under load. Build it, test it, and break it in a safe environment.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
