import { ArrowUpRight, Building2, Wand2 } from 'lucide-react';

const PortalSwitcher = () => {
  const currentPortal = 'user';
  const ghostwriterPortalUrl = import.meta.env.PROD 
    ? 'https://admin.agentss.app' 
    : 'http://localhost:5173';
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={ghostwriterPortalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors shadow-lg"
      >
        <Wand2 className="w-4 h-4" />
        <span className="text-sm font-medium">Switch to Ghostwriter Portal</span>
        <ArrowUpRight className="w-3 h-3" />
      </a>
    </div>
  );
};

export default PortalSwitcher;