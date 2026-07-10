import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "SysLab changed how we approach architectural reviews. Instead of arguing over whiteboard diagrams, we build the model, hit run, and let the simulation settle the debate.",
    author: "Sarah Chen",
    role: "Principal Engineer, FintechOS",
    initials: "SC"
  },
  {
    quote: "The failure injection engine caught a cascading timeout issue in our payment gateway design before we wrote a single line of code. Saved us weeks of painful debugging in production.",
    author: "Marcus Voss",
    role: "Staff SRE, NexusScale",
    initials: "MV"
  },
  {
    quote: "It feels like having a senior staff engineer looking over your shoulder. The latency modeling is shockingly accurate compared to our real-world datadog dashboards.",
    author: "David Alvera",
    role: "VP of Engineering, DataFlow",
    initials: "DA"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-background relative">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by Systems Engineers</h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-card border border-white/5 relative"
            >
              <div className="text-4xl text-primary/20 absolute top-6 left-6 font-serif">"</div>
              <p className="text-muted-foreground leading-relaxed relative z-10 mb-8 pt-4">
                {testimonial.quote}
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/5 pt-4 mt-auto">
                <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
