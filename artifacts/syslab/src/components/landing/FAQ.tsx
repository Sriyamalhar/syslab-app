import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What exactly is SysLab?",
    answer: "SysLab is a visual system design and simulation platform. It allows software engineers and architects to draw distributed system topologies and then run data-driven simulations through them to identify bottlenecks, validate scaling assumptions, and test failure scenarios before writing code."
  },
  {
    question: "Who is this built for?",
    answer: "It is designed for Senior/Staff Software Engineers, Site Reliability Engineers (SREs), Systems Architects, and engineering teams scaling complex distributed systems. It's also an excellent tool for candidates preparing for advanced system design interviews."
  },
  {
    question: "Do I need backend knowledge to use it?",
    answer: "Yes. While the interface is visual, SysLab assumes you understand concepts like load balancing algorithms, database sharding, caching strategies, network latency, and message queues. It is a professional tool, not an educational primer."
  },
  {
    question: "Is SysLab free?",
    answer: "We offer a free Developer tier that allows up to 3 projects and basic simulations. Pro and Team tiers offer advanced simulation configurations, unlimited nodes, and team collaboration features."
  },
  {
    question: "Can designs be exported to code?",
    answer: "Not currently, but Infrastructure-as-Code (Terraform, CloudFormation) export is on our roadmap for Q1 2026. Currently, you can export detailed simulation reports and architectural diagrams as PDFs or high-res images."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-white/10 bg-card/50 rounded-lg px-6 data-[state=open]:bg-card">
                <AccordionTrigger className="text-left font-medium hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
