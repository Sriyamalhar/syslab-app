import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Box, Activity, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center rounded-full border border-border bg-background/50 px-3 py-1 text-sm text-muted-foreground backdrop-blur-sm mb-8">
            <Zap className="mr-2 h-4 w-4 text-primary" />
            SysLab v1.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
            Build. Break. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Scale.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
            The professional distributed systems playground. Design complex architectures, run high-concurrency simulations, and inject chaos to see how your system holds up.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base h-12 px-8">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-base h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Abstract animated diagram */}
        <motion.div 
          className="mt-20 mx-auto w-full max-w-4xl h-[300px] rounded-xl border border-border bg-card/50 backdrop-blur-sm relative overflow-hidden flex items-center justify-center shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <svg className="w-full h-full opacity-60" viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 100 150 L 300 150 M 300 150 L 500 80 M 300 150 L 500 220 M 500 80 L 700 150 M 500 220 L 700 150" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-muted-foreground/30" />
            
            {/* Animated paths */}
            <motion.path 
              d="M 100 150 L 300 150 L 500 80 L 700 150" 
              stroke="hsl(var(--primary))" 
              strokeWidth="2" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.path 
              d="M 300 150 L 500 220 L 700 150" 
              stroke="hsl(var(--destructive))" 
              strokeWidth="2" 
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
            />
            
            {/* Nodes */}
            <circle cx="100" cy="150" r="24" className="fill-background stroke-border" strokeWidth="2" />
            <circle cx="300" cy="150" r="32" className="fill-background stroke-primary" strokeWidth="2" />
            <circle cx="500" cy="80" r="24" className="fill-background stroke-border" strokeWidth="2" />
            <circle cx="500" cy="220" r="24" className="fill-background stroke-border" strokeWidth="2" />
            <circle cx="700" cy="150" r="32" className="fill-background stroke-primary" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
