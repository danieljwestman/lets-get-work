
export interface ToolCategory {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  tools: Array<{ name: string; color: string }>;
  highlight: string;
}

export const toolCategories: ToolCategory[] = [
  {
    title: "Customer Success & Support",
    subtitle: "Professional platforms for amazing support",
    icon: "target",
    gradient: "from-blue-50 via-indigo-50 to-purple-50",
    tools: [
      { name: "🚀 HubSpot", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
      { name: "🎫 Zendesk", color: "bg-red-100 text-red-700 hover:bg-red-200" },
      { name: "💬 Intercom", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
      { name: "💬 Live Chat", color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { name: "🎧 Helpdesk", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
      { name: "📈 Mixpanel (L)", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
      { name: "💡 Freshdesk", color: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200" },
      { name: "📋 Jira Service", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" }
    ],
    highlight: "Professional experience with leading support platforms!"
  },
  {
    title: "Design & Technical Skills",
    subtitle: "Design perfectionist with tech skills",
    icon: "brain",
    gradient: "from-purple-50 via-pink-50 to-rose-50",
    tools: [
      { name: "⚛️ React (L)", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
      { name: "🎨 Lovable", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
      { name: "🎭 Figma (L)", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
      { name: "🐰 Directus", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
      { name: "⚡ Supabase", color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { name: "🔌 API dev", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" },
      { name: "💻 Custom Code", color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" },
      { name: "🔄 n8n (L)", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" }
    ],
    highlight: "Hands-on experience building user-friendly interfaces!"
  },
  {
    title: "Communication & Productivity",
    subtitle: "AI-powered efficiency and collaboration",
    icon: "message-circle",
    gradient: "from-green-50 via-emerald-50 to-teal-50",
    tools: [
      { name: "💭 ChatGPT", color: "bg-green-100 text-green-700 hover:bg-green-200" },
      { name: "🤖 AI Tools", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
      { name: "📧 Google Suite", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
      { name: "💬 Slack", color: "bg-teal-100 text-teal-700 hover:bg-teal-200" },
      { name: "📝 Notion", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
      { name: "🎨 Adobe Suite", color: "bg-red-100 text-red-700 hover:bg-red-200" },
      { name: "🍎 Apple tech", color: "bg-gray-100 text-gray-700 hover:bg-gray-200" },
      { name: "🐙 Github", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" }
    ],
    highlight: "AI-enhanced productivity for exceptional user experiences!"
  }
];
