import { motion } from "framer-motion";
import { Database } from "lucide-react";

export function PlatformPreview() {
  return (
    <section className="py-24 relative overflow-hidden flex justify-center">
      <div className="mx-auto max-w-6xl w-full px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Visualize the Invisible</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A canvas that speaks the language of distributed systems.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden aspect-[16/9] max-h-[700px]"
        >
          {/* Fake Window Header */}
          <div className="h-12 border-b border-white/10 bg-[#161b22] flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="text-xs text-muted-foreground font-mono bg-black/30 px-3 py-1 rounded">
              production-topology.slb
            </div>
            <div className="flex gap-3 text-muted-foreground">
              <div className="w-4 h-4 rounded bg-white/10" />
              <div className="w-4 h-4 rounded bg-white/10" />
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative w-full h-[calc(100%-3rem)] bg-grid-white overflow-hidden">
            
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              <defs>
                <linearGradient id="flow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Client -> LB */}
              <path d="M 150 250 L 300 250" fill="none" stroke="#272a30" strokeWidth="2" strokeDasharray="4 4" />
              
              {/* LB -> Gateway */}
              <path d="M 400 250 L 550 250" fill="none" stroke="url(#flow)" strokeWidth="3" filter="url(#glow)" />
              <circle cx="475" cy="250" r="4" fill="#fff" className="animate-[ping_2s_linear_infinite]" />

              {/* Gateway -> Service A */}
              <path d="M 650 230 C 700 230, 750 150, 800 150" fill="none" stroke="#272a30" strokeWidth="2" />
              
              {/* Gateway -> Service B */}
              <path d="M 650 270 C 700 270, 750 350, 800 350" fill="none" stroke="#272a30" strokeWidth="2" />

              {/* Service A -> DB */}
              <path d="M 900 150 C 950 150, 950 230, 1000 230" fill="none" stroke="#272a30" strokeWidth="2" />
              
              {/* Service B -> Cache */}
              <path d="M 900 350 C 950 350, 950 350, 1000 350" fill="none" stroke="#272a30" strokeWidth="2" />
            </svg>

            {/* Nodes */}
            <div className="absolute inset-0 z-10 flex text-sm">
              
              {/* Client */}
              <div className="absolute top-[210px] left-[70px] w-20 h-20 border border-dashed border-white/20 rounded-full flex flex-col items-center justify-center text-muted-foreground bg-black/20 backdrop-blur-md">
                Client
                <div className="text-[10px] mt-1">10k req/s</div>
              </div>

              {/* Load Balancer */}
              <div className="absolute top-[220px] left-[300px] w-28 bg-[#161b22] border border-primary/40 rounded-lg p-3 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                <div className="text-primary font-semibold text-xs mb-1">ALB</div>
                <div className="text-[10px] text-muted-foreground flex justify-between"><span>CPU</span> <span className="text-white">42%</span></div>
              </div>

              {/* API Gateway */}
              <div className="absolute top-[210px] left-[550px] w-28 bg-[#161b22] border border-white/10 rounded-lg p-3">
                <div className="font-semibold text-xs mb-1">API Gateway</div>
                <div className="text-[10px] text-muted-foreground flex justify-between"><span>Latency</span> <span className="text-yellow-400">45ms</span></div>
              </div>

              {/* Microservice A */}
              <div className="absolute top-[110px] left-[800px] w-32 bg-[#161b22] border border-white/10 rounded-lg p-3">
                <div className="font-semibold text-xs mb-1">Auth Service</div>
                <div className="text-[10px] text-muted-foreground flex justify-between"><span>Replicas</span> <span className="text-white">3</span></div>
                <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[30%]" />
                </div>
              </div>

              {/* Microservice B */}
              <div className="absolute top-[310px] left-[800px] w-32 bg-[#161b22] border border-red-500/50 rounded-lg p-3 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <div className="text-red-400 font-semibold text-xs mb-1">Payment Svc</div>
                <div className="text-[10px] text-muted-foreground flex justify-between"><span>Error Rate</span> <span className="text-red-400">4.2%</span></div>
                <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[85%]" />
                </div>
              </div>

              {/* Database */}
              <div className="absolute top-[190px] left-[1000px] w-28 bg-[#161b22] border border-white/10 rounded-full p-4 flex flex-col items-center justify-center text-center aspect-square">
                <Database className="w-5 h-5 text-blue-400 mb-1" />
                <div className="font-semibold text-xs">PostgreSQL</div>
                <div className="text-[10px] text-muted-foreground">Primary</div>
              </div>

              {/* Cache */}
              <div className="absolute top-[320px] left-[1000px] w-28 bg-[#161b22] border border-white/10 rounded-md p-3">
                <div className="font-semibold text-xs mb-1 text-red-400">Redis</div>
                <div className="text-[10px] text-muted-foreground flex justify-between"><span>Hit Rate</span> <span className="text-white">92%</span></div>
              </div>

            </div>

            {/* Mock Property Panel */}
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#161b22]/90 backdrop-blur-md border-l border-white/10 p-4 z-20 flex flex-col">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Node Properties</div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-medium">Payment Svc</span>
                </div>
                <span className="text-xs text-muted-foreground">Node.js / Express</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">CPU Limit</span>
                    <span>2 Cores</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white/30 w-[40%]" /></div>
                </div>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Memory Limit</span>
                    <span>4 GB</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white/30 w-[60%]" /></div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <div className="text-xs font-medium mb-2">Failure Injection</div>
                  <div className="flex items-center justify-between bg-black/20 p-2 rounded text-xs border border-red-500/20 text-red-400">
                    <span>Latency Spike</span>
                    <span className="bg-red-500/20 px-1.5 py-0.5 rounded">Active</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 px-1">+500ms jitter</div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
