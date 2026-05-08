import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Video, 
  Image as ImageIcon, 
  Mic, 
  Search, 
  Settings, 
  Bell, 
  Activity, 
  Layers, 
  Cpu,
  ChevronRight,
  Upload,
  Play,
  RotateCcw,
  Sparkles,
  Scissors,
  Music,
  CheckCircle2,
  Clock,
  Box,
  Layers3,
  Dna,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import { MediaProject, MediaStatus } from "@/src/types";
import { analyzeMedia } from "@/src/services/geminiService";
import Markdown from "react-markdown";
import { ThreeBackground } from "@/src/components/ThreeBackground";

export default function App() {
  const [projects, setProjects] = useState<MediaProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<MediaProject | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"plan" | "3d" | "audio" | "bg" | "logo">("plan");
  const [selectedBg, setSelectedBg] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload to backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      const type = file.type.startsWith("video") ? "video" : file.type.startsWith("image") ? "photo" : "audio";
      
      const newProject: MediaProject = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: type as any,
        status: "analyzing",
        originalUrl: data.file.path,
        timestamp: new Date().toLocaleTimeString(),
      };

      setProjects([newProject, ...projects]);
      setSelectedProject(newProject);
      setIsUploading(false);

      // Trigger AI Analysis
      const plan = await analyzeMedia({ name: file.name, type: type });
      setProjects(prev => prev.map(p => p.id === newProject.id ? { ...p, plan, status: "editing" } : p));
      
      // Simulate "AI Editing" process
      setTimeout(() => {
        setProjects(prev => prev.map(p => p.id === newProject.id ? { ...p, status: "completed" } : p));
      }, 3000);

    } catch (err) {
      console.error("Upload failed", err);
      setIsUploading(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-orange-500/30 overflow-hidden relative">
      <ThreeBackground />
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-[#0F0F11]">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">AI STUDIO</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Advance Editor</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavItem icon={<Activity className="w-4 h-4" />} label="Dashboard" active />
          <NavItem icon={<Layers className="w-4 h-4" />} label="Projects" />
          <NavItem icon={<Video className="w-4 h-4" />} label="Video Assets" />
          <NavItem icon={<ImageIcon className="w-4 h-4" />} label="Photo Assets" />
          <NavItem icon={<Mic className="w-4 h-4" />} label="Audio Library" />
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-xs font-semibold mb-2">Storage Usage</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-orange-500" />
            </div>
            <p className="text-[10px] text-slate-500 mt-2">12.4 GB of 50 GB used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 border-bottom border-white/5 flex items-center justify-between px-8 bg-[#0A0A0B]/80 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search projects, assets..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/5 rounded-full relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0A0A0B]" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-full">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-semibold">Ramesh</p>
                <p className="text-[10px] text-slate-500">Pro Client</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Workspace</h2>
              <p className="text-slate-500">Manage your AI-powered creative workflows</p>
            </div>
            
            <label className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-orange-500/20 active:scale-95">
              <Plus className="w-5 h-5" />
              New Studio Project
              <input type="file" className="hidden" onChange={handleUpload} accept="video/*,image/*,audio/*" />
            </label>
          </div>

          {projects.length === 0 ? (
            <EmptyState onUpload={handleUpload} />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Projects List */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Projects</h3>
                  <button className="text-xs text-orange-500 font-semibold hover:underline">View All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      isSelected={selectedProject?.id === project.id}
                      onClick={() => setSelectedProject(project)}
                    />
                  ))}
                </div>
              </div>

              {/* Inspector/Intelligence Panel */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Core Intelligence</h3>
                <AnimatePresence mode="wait">
                  {selectedProject ? (
                    <IntelligencePanel 
                      key={selectedProject.id} 
                      project={selectedProject} 
                      activeTab={activeTab} 
                      setActiveTab={setActiveTab}
                      selectedBg={selectedBg}
                      setSelectedBg={setSelectedBg}
                    />
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 text-center h-[500px] flex flex-col items-center justify-center">
                      <Sparkles className="w-12 h-12 text-slate-700 mb-4" />
                      <p className="text-slate-500 text-sm">Select a project to view AI insights and automated edits</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm",
      active ? "bg-orange-500/10 text-orange-500 font-semibold" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
    )}>
      {icon}
      {label}
    </button>
  );
}

function EmptyState({ onUpload }: { onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
        <Upload className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-xl font-bold mb-2">No projects yet</h3>
      <p className="text-slate-500 max-w-sm mb-8 italic">"Start by uploading a video, photo, or audio file. Let Core Intelligence take care of the rest."</p>
      <label className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-sm cursor-pointer hover:bg-slate-200 transition-all flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Create your first project
        <input type="file" className="hidden" onChange={onUpload} accept="video/*,image/*,audio/*" />
      </label>
    </div>
  );
}

function ProjectCard({ project, onClick, isSelected }: { project: MediaProject, onClick: () => void, isSelected: boolean }) {
  const Icon = project.type === "video" ? Video : project.type === "photo" ? ImageIcon : Mic;
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / 10);
    setRotateY(-(x - centerX) / 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Simulated dynamic filters based on status
  const filterStyles = project.status === "completed" 
    ? project.type === "photo" ? "brightness-110 contrast-125 saturate-110" : "sepia-[0.3] contrast-110"
    : "grayscale-[0.4]";

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 relative z-10",
        isSelected ? "bg-orange-500/10 border-orange-500 shadow-[0_20px_50px_rgba(249,115,22,0.1)]" : "bg-[#141416]/80 backdrop-blur-sm border-white/5 hover:border-white/20"
      )}
    >
      <div className="relative aspect-video rounded-xl bg-black overflow-hidden mb-4 border border-white/5 shadow-inner">
        {project.type === "video" ? (
          <video src={project.originalUrl} className={cn("w-full h-full object-cover transition-all duration-700", filterStyles)} muted loop />
        ) : project.type === "photo" ? (
          <img src={project.originalUrl} className={cn("w-full h-full object-cover transition-all duration-700", filterStyles)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <Mic className="w-12 h-12 text-slate-700" />
            {project.status === "completed" && <Activity className="absolute inset-0 w-full h-full text-orange-500/10" />}
          </div>
        )}
        
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
          {project.type}
        </div>

        {project.status === "analyzing" && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
             <div className="w-12 h-12 relative flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin" />
                <Cpu className="w-5 h-5 text-orange-500" />
             </div>
             <p className="text-[10px] font-bold mt-4 animate-pulse uppercase tracking-[0.2em] text-orange-500">Processing</p>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <h4 className="font-bold text-sm truncate group-hover:text-orange-500 transition-colors">{project.name}</h4>
          <div className="flex items-center gap-2 mt-1">
             <Clock className="w-3 h-3 text-slate-500" />
             <p className="text-[10px] text-slate-500 font-medium">{project.timestamp}</p>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: MediaStatus }) {
  const configs: Record<MediaStatus, { label: string, color: string, icon?: React.ReactNode }> = {
    idle: { label: "Queued", color: "bg-slate-500" },
    uploading: { label: "Uploading", color: "bg-blue-500" },
    analyzing: { label: "Analyzing", color: "bg-purple-500" },
    editing: { label: "Editing", color: "bg-orange-500" },
    completed: { label: "Optimized", color: "bg-green-500", icon: <CheckCircle2 className="w-3 h-3" /> },
  };

  const config = configs[status];
  
  return (
    <div className={cn("px-2 py-1 rounded flex items-center gap-1.5", config.color, "bg-opacity-10")}>
      <div className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
      <span className={cn("text-[8px] font-black uppercase tracking-wider", config.color.replace('bg-', 'text-'))}>
        {config.label}
      </span>
      {config.icon && <div className={config.color.replace('bg-', 'text-')}>{config.icon}</div>}
    </div>
  );
}

function IntelligencePanel({ 
  project, 
  activeTab, 
  setActiveTab,
  selectedBg,
  setSelectedBg
}: { 
  project: MediaProject, 
  activeTab: "plan" | "3d" | "audio" | "bg" | "logo",
  setActiveTab: (tab: "plan" | "3d" | "audio" | "bg" | "logo") => void,
  selectedBg: string | null,
  setSelectedBg: (bg: string | null) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, rotateY: 20 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -20, rotateY: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="bg-[#141416]/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden h-[calc(100vh-280px)] flex flex-col relative"
    >
      {/* 3D Scanning Line */}
      {project.status === "analyzing" && (
        <motion.div 
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent z-20 shadow-[0_0_15px_rgba(249,115,22,0.8)]"
        />
      )}

      {/* Tabs Header */}
      <div className="flex border-b border-white/5 bg-white/[0.02]">
        <TabButton 
          active={activeTab === "plan"} 
          onClick={() => setActiveTab("plan")} 
          icon={<Sparkles className="w-3 h-3" />} 
          label="Plan" 
        />
        <TabButton 
          active={activeTab === "bg"} 
          onClick={() => setActiveTab("bg")} 
          icon={<Layers3 className="w-3 h-3" />} 
          label="BGs" 
        />
        <TabButton 
          active={activeTab === "logo"} 
          onClick={() => setActiveTab("logo")} 
          icon={<Palette className="w-3 h-3" />} 
          label="Logo" 
        />
        <TabButton 
          active={activeTab === "3d"} 
          onClick={() => setActiveTab("3d")} 
          icon={<Box className="w-3 h-3" />} 
          label="3D" 
        />
        <TabButton 
          active={activeTab === "audio"} 
          onClick={() => setActiveTab("audio")} 
          icon={<Music className="w-3 h-3" />} 
          label="Audio" 
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {project.status === "analyzing" ? (
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-white/5 rounded w-full animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "plan" && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="prose prose-invert prose-sm max-w-none prose-p:text-slate-400 prose-headings:text-slate-200"
              >
                <Markdown>{project.plan || "No plan generated yet."}</Markdown>
                
                {project.type === "video" && project.status === "completed" && (
                  <div className="mt-8">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Editing Timeline</h5>
                    <div className="h-12 w-full bg-white/5 rounded-lg border border-white/10 flex overflow-hidden">
                      <div className="h-full bg-orange-500/20 border-r border-white/10 w-1/4 flex items-center justify-center text-[10px] text-orange-500 font-bold">INTRO</div>
                      <div className="h-full bg-white/5 border-r border-white/10 w-1/2 flex items-center justify-center text-[10px] text-slate-500 font-medium italic">MAIN CLIP</div>
                      <div className="h-full bg-orange-500/20 w-1/4 flex items-center justify-center text-[10px] text-orange-500 font-bold">OUTRO</div>
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                     <Scissors className="w-3 h-3" />
                     Applied Micro-Edits
                   </h5>
                   <ul className="space-y-2">
                     <EditStep icon={<Sparkles className="w-3 h-3 text-cyan-500" />} label="Cinematic Filter" />
                     <EditStep icon={<Music className="w-3 h-3 text-pink-500" />} label="Audio sync" />
                     <EditStep icon={<Mic className="w-3 h-3 text-indigo-500" />} label="AI Voiceover" />
                   </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "bg" && (
              <motion.div
                key="bg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vision Wallpapers</h5>
                  <label className="text-[10px] font-bold text-orange-500 flex items-center gap-1 cursor-pointer hover:underline">
                    <Upload className="w-3 h-3" />
                    Custom
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <BgCard 
                    label="Cyberpunk" 
                    active={selectedBg === "cyber"} 
                    onClick={() => setSelectedBg("cyber")} 
                    color="bg-purple-500/20"
                  />
                  <BgCard 
                    label="Aurora" 
                    active={selectedBg === "aurora"} 
                    onClick={() => setSelectedBg("aurora")} 
                    color="bg-emerald-500/20"
                  />
                  <BgCard 
                    label="Deep Space" 
                    active={selectedBg === "space"} 
                    onClick={() => setSelectedBg("space")} 
                    color="bg-blue-500/20"
                  />
                  <BgCard 
                    label="Minimal Loft" 
                    active={selectedBg === "loft"} 
                    onClick={() => setSelectedBg("loft")} 
                    color="bg-orange-500/20"
                  />
                </div>

                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex gap-3">
                  <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-[11px] font-medium text-orange-200/70 leading-relaxed italic">
                    "Video Wallpaper change detected. AI suggests the <b>Aurora</b> gradient to match the cinematic mood."
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "logo" && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Logo Animation Studio</h5>
                  <button className="text-[10px] font-bold text-orange-500 flex items-center gap-1 hover:underline">
                    <Sparkles className="w-3 h-3" />
                    AI Regenerate
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Animation Preset</span>
                      <span className="text-[10px] text-orange-500 font-mono">TRENDING</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2 bg-orange-500/10 border border-orange-500/40 rounded-lg text-[10px] font-bold text-orange-500">Particle Rise</button>
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-colors">Glitch Reveal</button>
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-colors">Soft Fade</button>
                      <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-white/10 transition-colors">Liquid Draw</button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Brand Identity Palette</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500 shadow-lg shadow-orange-500/20" />
                      <div className="w-8 h-8 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20" />
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/10" />
                      <div className="w-8 h-8 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4 flex gap-3">
                  <Palette className="w-5 h-5 text-orange-500 shrink-0" />
                  <p className="text-[11px] font-medium text-orange-200/70 leading-relaxed italic">
                    "AI suggests <b>Particle Rise</b> animation for this logo to match your upscale cinematic background."
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "3d" && (
              <motion.div
                key="3d"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">3D Asset Library</h5>
                  <label className="text-[10px] font-bold text-orange-500 flex items-center gap-1 cursor-pointer hover:underline">
                    <Upload className="w-3 h-3" />
                    Upload .GLB
                    <input type="file" className="hidden" accept=".glb,.gltf" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <AssetCard label="Cyber Character" sub="Animated" icon={<Dna className="w-5 h-5 text-indigo-500" />} />
                  <AssetCard label="Floating Particles" sub="Ambient" icon={<Sparkles className="w-5 h-5 text-cyan-500" />} />
                  <AssetCard label="Neon UI Panel" sub="Static" icon={<Layers3 className="w-5 h-5 text-pink-500" />} />
                  <AssetCard label="Abstract Totem" sub="Loop" icon={<Box className="w-5 h-5 text-orange-500" />} />
                </div>

                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-4">
                  <p className="text-[11px] font-medium text-orange-200/70 leading-relaxed italic">
                    "AI suggests adding <b>Cyber Character</b> at 00:12 for a professional motion-graphics feel."
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === "audio" && (
              <motion.div
                key="audio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Audio Intelligence</h5>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold">Auto-Ducking</span>
                      <div className="w-8 h-4 bg-orange-500 rounded-full flex items-center px-1">
                        <div className="w-2 h-2 bg-white rounded-full ml-auto" />
                      </div>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-orange-500" />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">Music volume lowers by 60% during speech</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="p-6 bg-white/[0.02] border-t border-white/5">
        <button 
          disabled={project.status !== "completed"}
          className={cn(
            "w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
            project.status === "completed" 
              ? "bg-white text-black hover:bg-slate-200 active:scale-95" 
              : "bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed"
          )}
        >
          {project.status === "completed" ? (
             <>
               <Play className="w-5 h-5 fill-current" />
               View Final Cut
             </>
          ) : (
            <>
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
              Intelligence in progress...
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

function EditStep({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <li className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
      {icon}
      <span className="text-[11px] font-medium text-slate-300">{label}</span>
      <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
    </li>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 py-4 text-[9px] font-bold uppercase tracking-widest transition-all border-b-2",
        active ? "text-orange-500 border-orange-500 bg-orange-500/5" : "text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/5"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function BgCard({ label, active, onClick, color }: { label: string, active: boolean, onClick: () => void, color: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center h-20 rounded-2xl border-2 transition-all active:scale-95",
        active ? "border-orange-500 bg-orange-500/10" : "border-white/5 bg-white/5 hover:border-white/20"
      )}
    >
      <div className={cn("w-full h-full absolute inset-0 opacity-20 blur-xl", color)} />
      <span className={cn("text-[10px] font-bold z-10", active ? "text-orange-500" : "text-slate-400")}>{label}</span>
      {active && <CheckCircle2 className="absolute top-2 right-2 w-3 h-3 text-orange-500" />}
    </button>
  );
}

function AssetCard({ label, sub, icon }: { label: string, sub: string, icon: React.ReactNode }) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group active:scale-95">
      <div className="p-2 bg-white/5 rounded-lg mb-2 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-bold">{label}</p>
      <p className="text-[8px] text-slate-500">{sub}</p>
    </button>
  );
}
