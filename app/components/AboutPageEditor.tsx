"use client";

import { useState } from "react";
import { Save } from "lucide-react";

interface AboutPageEditorProps {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const defaultFormData = {
  title: "من نحن",
  subtitle: "نوفا - وجهتك للتسوق الذكي",
  description:
    "نحن متجر إلكتروني رائد يقدم أفضل المنتجات بأسعار تنافسية. نؤمن بأن التسوق يجب أن يكون تجربة ممتعة وسهلة للجميع.",
  mission:
    "مهمتنا هي توفير منتجات عالية الجودة بأسعار معقولة مع خدمة عملاء استثنائية.",
  vision: "رؤيتنا أن نصبح المتجر الإلكتروني الأول في المنطقة العربية.",
};

export default function AboutPageEditor({
  showSuccess,
  showError,
}: AboutPageEditorProps) {
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aboutPageData");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          return {
            title: data.title || defaultFormData.title,
            subtitle: data.subtitle || defaultFormData.subtitle,
            description: data.description || defaultFormData.description,
            mission: data.mission || defaultFormData.mission,
            vision: data.vision || defaultFormData.vision,
          };
        } catch {
          return defaultFormData;
        }
      }
    }
    return defaultFormData;
  });

  const handleSave = () => {
    try {
      // Save to localStorage
      const fullData = {
        ...formData,
        values: [
          {
            icon: "quality",
            title: "الجودة",
            description: "نختار منتجاتنا بعناية فائقة",
          },
          {
            icon: "price",
            title: "الأسعار الذكية",
            description: "أفضل الأسعار في السوق",
          },
          {
            icon: "service",
            title: "خدمة العملاء",
            description: "دعم على مدار الساعة",
          },
          {
            icon: "trust",
            title: "الثقة",
            description: "نبني علاقات طويلة الأمد",
          },
        ],
        stats: [
          { label: "عميل سعيد", value: "10,000+" },
          { label: "منتج متميز", value: "500+" },
          { label: "سنوات من الخبرة", value: "5+" },
          { label: "تقييم العملاء", value: "4.9/5" },
        ],
      };

      localStorage.setItem("aboutPageData", JSON.stringify(fullData));
      showSuccess("تم حفظ التغييرات بنجاح!");
    } catch {
      showError("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          العنوان الرئيسي
        </label>
        <input
          type="text"
          placeholder="أدخل العنوان الرئيسي"
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          العنوان الفرعي
        </label>
        <input
          type="text"
          placeholder="أدخل العنوان الفرعي"
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.subtitle}
          onChange={(e) =>
            setFormData({ ...formData, subtitle: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          الوصف
        </label>
        <textarea
          rows={4}
          placeholder="أدخل الوصف"
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          مهمتنا
        </label>
        <textarea
          rows={3}
          placeholder="أدخل مهمتنا"
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.mission}
          onChange={(e) =>
            setFormData({ ...formData, mission: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">
          رؤيتنا
        </label>
        <textarea
          rows={3}
          placeholder="أدخل رؤيتنا"
          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-white/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={formData.vision}
          onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
      >
        <Save className="h-5 w-5" />
        حفظ التغييرات
      </button>
    </div>
  );
}
