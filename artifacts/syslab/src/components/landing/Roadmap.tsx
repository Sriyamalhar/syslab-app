import { motion } from "framer-motion";
import { Smartphone, Sparkles, Users, Cloud, GitBranch } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Q3 2025",
    title: "AI-Powered Suggestions",
    icon: Sparkles,
    description: "Automated architectural anti-pattern detection and optimization recommendations.",
    status: "In Progress"
  },
  {
    quarter: "Q4 2025",
    title: "Team Collaboration",
    icon: Users,
    description: "Real-time multiplayer canvas, role-based access control, and design comments.",
    status: "Planned"
  },
  {
    quarter: "Q4 2025",
    title: "CI/CD Integration",
    icon: GitBranch,
    description: "Run simulations automatically on pull requests to prevent performance regressions.",
    status: "Planned"
  },
  {
    quarter: "Q1 2026",
    title: "Cloud Export",
    icon: Cloud,
    description: "Export verified designs directly to Terraform or AWS CloudFormation templates.",
    status: "Future"
  },
  {
    quarter: "Q1 2026",
    title: "Mobile App Companion",
    icon: Smartphone,
    description: "Monitor long-running simulations and review architectures on the go.",
    status: "Future"
  }
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-24 bg-card/20 border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Roadmap</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              We are moving fast. Here is what's coming next for the SysLab platform.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-background border border-white/10 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="h-10 w-10 rounded-lg bg-card border border-white/5 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border 
                  ${item.status === 'In Progress' ? 'bg-primary/10 border-primary/20 text-primary' : 
                    item.status === 'Planned' ? 'bg-white/5 border-white/10 text-muted-foreground' : 
                    'bg-transparent border-white/5 text-muted-foreground/50'}`}>
                  {item.status}
                </span>
              </div>
              
              <div className="text-xs text-primary font-mono mb-2">{item.quarter}</div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground flex-grow">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
