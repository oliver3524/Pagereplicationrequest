import { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Phone, 
  MessageSquare, 
  Mail, 
  Edit3, 
  ChevronDown, 
  Check, 
  Settings2,
  AlertCircle,
  FileText,
  Variable
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ScenarioType = 
  | 'Intro booked — confirm + card on file'
  | 'New lead — no response yet'
  | 'Left voicemail — call back'
  | 'Cancellation risk — save attempt'
  | 'Billing issue — payment failed'
  | 'Membership freeze/downgrade request'
  | 'Winback former member';

type ToneType = 'Professional' | 'Friendly' | 'Direct';
type ChannelType = 'Call Script' | 'Text Message' | 'Email';

interface ScriptBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadInfo: {
    name: string;
    phone: string;
    type: 'Lead' | 'Member';
    taskType: string;
    due: string;
    goal: string;
    background: string[];
  };
  initialScenario?: ScenarioType;
}

export function ScriptBuilderModal({ isOpen, onClose, leadInfo, initialScenario }: ScriptBuilderModalProps) {
  const [activeTab, setActiveTab] = useState<ChannelType>('Call Script');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(initialScenario || 'Intro booked — confirm + card on file');
  const [selectedTone, setSelectedTone] = useState<ToneType>('Friendly');
  const [isScenarioOpen, setIsScenarioOpen] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  
  const [variables, setVariables] = useState({
    staffName: 'Adriana',
    studioName: 'Figma Fitness',
    classTime: 'Tomorrow at 8:15 AM',
    cancelHours: '24',
    offer: 'First Month 50% Off',
    nextStepLink: 'figmafitness.com/book'
  });

  const [editableScripts, setEditableScripts] = useState({
    call: {
      opening: '',
      keyAsk: '',
      hesitate: '',
      close: ''
    },
    sms: {
      versionA: '',
      versionB: ''
    },
    email: {
      subject: '',
      body: ''
    }
  });

  // Simple script generator based on scenario, tone, and variables
  useEffect(() => {
    const generateScripts = () => {
      const { staffName, studioName, classTime, cancelHours, offer, nextStepLink } = variables;
      const leadName = leadInfo.name;

      let scripts = { ...editableScripts };

      if (selectedScenario === 'Intro booked — confirm + card on file') {
        scripts.call = {
          opening: `Hi ${leadName}! This is ${staffName} from ${studioName}. How are you doing today?`,
          keyAsk: `I'm calling to confirm your intro class scheduled for ${classTime}. We're so excited to have you! To finalize your spot, we just need a card on file for our ${cancelHours}-hour cancellation policy.`,
          hesitate: `I totally understand wanting to wait until you're here. This card actually just holds your reservation and isn't charged unless there's a late cancel. It makes check-in much faster so you can focus on the workout!`,
          close: `Does that work if we take that card now to get you all set up?`
        };
        scripts.sms = {
          versionA: `Hi ${leadName}! Confirmation for your intro at ${studioName} for ${classTime}. Reply YES to confirm!`,
          versionB: `Hey ${leadName}! It's ${staffName} from ${studioName}. Excited for your class ${classTime}! Can you confirm you're coming? Also, please use this link to add a card for our policy: ${nextStepLink}`
        };
        scripts.email = {
          subject: `Confirming your visit to ${studioName}!`,
          body: `Hi ${leadName},\n\nWe are looking forward to seeing you at ${studioName} for your intro class on ${classTime}!\n\nPlease reply to this email to confirm your attendance. Also, we require a card on file to hold your reservation. You can add it securely here: ${nextStepLink}\n\nSee you soon!\n\nBest,\n${staffName}`
        };
      } else if (selectedScenario === 'Cancellation risk — save attempt') {
        scripts.call = {
          opening: `Hi ${leadName}, this is ${staffName} from ${studioName}. I noticed you were inquiring about your membership.`,
          keyAsk: `We'd love to keep you as part of the community! I'd like to offer you our ${offer} to help you stay on track with your fitness goals.`,
          hesitate: `I hear you on the budget concerns. That's why this ${offer} is so great—it keeps your momentum going without the full cost while you transition.`,
          close: `Would you be open to trying that for next month and seeing how it goes?`
        };
        scripts.sms = {
          versionA: `Hi ${leadName}, we'd hate to see you go! Check your email for a special offer to stay with us at ${studioName}.`,
          versionB: `Hey ${leadName}, it's ${staffName} from ${studioName}. I saw you're thinking of canceling. Before you do, I wanted to offer you ${offer} to help keep you moving! Want to chat?`
        };
        scripts.email = {
          subject: `A special offer for you, ${leadName}`,
          body: `Hi ${leadName},\n\nWe saw you were looking into canceling your membership at ${studioName}. We've loved having you here and want to help you stay on track.\n\nI've authorized a special ${offer} just for you to help out. Would you like to stay with us at this new rate?\n\nBest,\n${staffName}`
        };
      } else {
        // Default / fallback for other scenarios
        scripts.call = {
          opening: `Hi ${leadName}, it's ${staffName} from ${studioName}.`,
          keyAsk: `I'm reaching out regarding your interest in our classes.`,
          hesitate: `We have some great options for new members right now.`,
          close: `Do you have a moment to talk about your goals?`
        };
        scripts.sms = {
          versionA: `Hi ${leadName}! It's ${staffName} from ${studioName}. Do you have a moment to chat?`,
          versionB: `Hi ${leadName}, reaching out from ${studioName} to follow up on your inquiry. Let me know if you have any questions!`
        };
        scripts.email = {
          subject: `Following up from ${studioName}`,
          body: `Hi ${leadName},\n\nHope you're having a great day. Reaching out to see if you had any questions about ${studioName}.\n\nBest,\n${staffName}`
        };
      }

      // Apply Tone adjustments (simplified)
      if (selectedTone === 'Direct') {
        Object.keys(scripts.call).forEach(key => {
          scripts.call[key as keyof typeof scripts.call] = scripts.call[key as keyof typeof scripts.call].replace("How are you doing today?", "").trim();
        });
      }

      setEditableScripts(scripts);
    };

    generateScripts();
  }, [selectedScenario, selectedTone, variables, leadInfo]);

  if (!isOpen) return null;

  const scenarios: ScenarioType[] = [
    'Intro booked — confirm + card on file',
    'New lead — no response yet',
    'Left voicemail — call back',
    'Cancellation risk — save attempt',
    'Billing issue — payment failed',
    'Membership freeze/downgrade request',
    'Winback former member'
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[720px] max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EAECEF] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#111]">AI Script Builder</h2>
              <p className="text-xs text-[#667085]">Generated from this lead's context. Edit before using.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-[#667085]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Top Context Block */}
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 border border-[#EAECEF] rounded-xl relative group">
                <button className="absolute top-4 right-4 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="w-4 h-4 text-[#667085]" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {leadInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111]">{leadInfo.type}: {leadInfo.name} • {leadInfo.phone}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-tight">
                        {leadInfo.taskType}
                      </span>
                      <span className="text-[10px] text-[#667085] uppercase font-medium">Due: {leadInfo.due}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#EAECEF]">
                  <div>
                    <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">Goal</span>
                    <p className="text-sm text-[#111] font-medium">{leadInfo.goal}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1">Background</span>
                    <ul className="space-y-1">
                      {leadInfo.background.map((b, i) => (
                        <li key={i} className="text-xs text-[#667085] flex gap-1.5">
                          <span className="mt-1 w-1 h-1 rounded-full bg-[#667085] shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#667085]">
                  <AlertCircle className="w-3 h-3" />
                  Only uses info shown above. If something is missing, edit context.
                </div>
              </div>

              {/* Selectors */}
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1 block">Scenario</span>
                  <button 
                    onClick={() => setIsScenarioOpen(!isScenarioOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 border border-[#EAECEF] rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="truncate">{selectedScenario}</span>
                    <ChevronDown className={`w-4 h-4 text-[#667085] transition-transform ${isScenarioOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isScenarioOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EAECEF] rounded-lg shadow-xl z-20 py-1">
                      {scenarios.map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            setSelectedScenario(s);
                            setIsScenarioOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className={selectedScenario === s ? 'text-blue-600 font-medium' : 'text-[#111]'}>{s}</span>
                          {selectedScenario === s && <Check className="w-4 h-4 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-40">
                  <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1 block">Tone</span>
                  <div className="flex p-1 bg-gray-100 rounded-lg">
                    {(['Professional', 'Friendly', 'Direct'] as ToneType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => setSelectedTone(t)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${selectedTone === t ? 'bg-white text-[#111] shadow-sm' : 'text-[#667085] hover:text-[#111]'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Channel Tabs */}
              <div className="border-b border-[#EAECEF]">
                <div className="flex gap-8">
                  {(['Call Script', 'Text Message', 'Email'] as ChannelType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === t ? 'text-blue-600' : 'text-[#667085] hover:text-[#111]'}`}
                    >
                      <div className="flex items-center gap-2">
                        {t === 'Call Script' && <Phone className="w-4 h-4" />}
                        {t === 'Text Message' && <MessageSquare className="w-4 h-4" />}
                        {t === 'Email' && <Mail className="w-4 h-4" />}
                        {t}
                      </div>
                      {activeTab === t && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Script Content */}
              <div className="min-h-[320px]">
                {activeTab === 'Call Script' && (
                  <div className="space-y-4">
                    {Object.entries(editableScripts.call).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold text-[#111] uppercase tracking-widest">
                            {key === 'opening' ? 'Opening' : key === 'keyAsk' ? 'Key Ask' : key === 'hesitate' ? 'If they hesitate' : 'Close'}
                          </span>
                          <button 
                            onClick={() => handleCopy(val)}
                            className="p-1 hover:bg-gray-100 rounded text-[#667085]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={val}
                          onChange={(e) => setEditableScripts({
                            ...editableScripts,
                            call: { ...editableScripts.call, [key]: e.target.value }
                          })}
                          className="w-full p-3 bg-white border border-[#EAECEF] rounded-xl text-sm text-[#111] resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[80px]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'Text Message' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#111] uppercase tracking-widest">Version A (Short)</span>
                        <button 
                          onClick={() => handleCopy(editableScripts.sms.versionA)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy SMS
                        </button>
                      </div>
                      <textarea
                        value={editableScripts.sms.versionA}
                        onChange={(e) => setEditableScripts({
                          ...editableScripts,
                          sms: { ...editableScripts.sms, versionA: e.target.value }
                        })}
                        className="w-full p-3 bg-white border border-[#EAECEF] rounded-xl text-sm text-[#111] resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[100px]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#111] uppercase tracking-widest">Version B (Friendly + Detail)</span>
                        <button 
                          onClick={() => handleCopy(editableScripts.sms.versionB)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy SMS
                        </button>
                      </div>
                      <textarea
                        value={editableScripts.sms.versionB}
                        onChange={(e) => setEditableScripts({
                          ...editableScripts,
                          sms: { ...editableScripts.sms, versionB: e.target.value }
                        })}
                        className="w-full p-3 bg-white border border-[#EAECEF] rounded-xl text-sm text-[#111] resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[120px]"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'Email' && (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider mb-1 block">Subject Line</span>
                      <input
                        type="text"
                        value={editableScripts.email.subject}
                        onChange={(e) => setEditableScripts({
                          ...editableScripts,
                          email: { ...editableScripts.email, subject: e.target.value }
                        })}
                        className="w-full px-4 py-2 bg-white border border-[#EAECEF] rounded-lg text-sm text-[#111] focus:ring-1 focus:ring-blue-500 focus:outline-none font-medium"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#111] uppercase tracking-widest">Email Body</span>
                        <button 
                          onClick={() => handleCopy(editableScripts.email.body)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy Email
                        </button>
                      </div>
                      <textarea
                        value={editableScripts.email.body}
                        onChange={(e) => setEditableScripts({
                          ...editableScripts,
                          email: { ...editableScripts.email, body: e.target.value }
                        })}
                        className="w-full p-4 bg-white border border-[#EAECEF] rounded-xl text-sm text-[#111] resize-none focus:ring-1 focus:ring-blue-500 focus:outline-none min-h-[200px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#EAECEF] bg-gray-50 flex items-center justify-between">
            <div className="relative">
              <button 
                onClick={() => setShowVariables(!showVariables)}
                className="flex items-center gap-2 px-3 py-2 border border-[#EAECEF] bg-white rounded-lg text-xs font-semibold text-[#667085] hover:text-[#111] transition-colors"
              >
                <Variable className="w-4 h-4" />
                Variables
              </button>
              {showVariables && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-[#EAECEF] rounded-xl shadow-2xl z-30 p-4">
                  <h4 className="text-[10px] font-bold text-[#667085] uppercase tracking-widest mb-3">Detected Variables</h4>
                  <div className="space-y-3">
                    {Object.entries(variables).map(([key, val]) => (
                      <div key={key}>
                        <label className="text-[10px] text-[#667085] font-medium block mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) => setVariables({ ...variables, [key]: e.target.value })}
                          className="w-full px-2 py-1.5 bg-gray-50 border border-[#EAECEF] rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[#667085] hover:text-[#111]">
                Close
              </button>
              <button className="px-4 py-2 border border-[#EAECEF] bg-white rounded-xl text-sm font-bold text-[#111] hover:bg-gray-50">
                Copy All
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200">
                Insert into task notes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
