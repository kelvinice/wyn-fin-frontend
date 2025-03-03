import { motion } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { BellIcon, ShieldCheckIcon, UserCircleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

type TabType = 'general' | 'account' | 'security' | 'notifications';

interface SettingsNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function SettingsNav({ activeTab, setActiveTab }: SettingsNavProps) {
  const tabs = [
    { id: 'general', label: 'General', icon: <WrenchScrewdriverIcon className="w-5 h-5" /> },
    { id: 'account', label: 'Account', icon: <UserCircleIcon className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-5 h-5" /> },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FancyCard className="p-4">
        <div className="flex flex-col space-y-1">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id ? 'bg-primary text-primary-content' : 'hover:bg-base-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </FancyCard>
    </motion.div>
  );
}