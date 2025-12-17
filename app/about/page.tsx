"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Award, Heart, ShieldCheck, Star } from "lucide-react";

import Navbar from "../components/Navbar";

const defaultAboutData = {
  title: "من نحن",
  subtitle: "نوفا - وجهتك للتسوق الذكي",
  description:
    "نحن متجر إلكتروني رائد يقدم أفضل المنتجات بأسعار تنافسية. نؤمن بأن التسوق يجب أن يكون تجربة ممتعة وسهلة للجميع.",
  mission:
    "مهمتنا هي توفير منتجات عالية الجودة بأسعار معقولة مع خدمة عملاء استثنائية.",
  vision: "رؤيتنا أن نصبح المتجر الإلكتروني الأول في المنطقة العربية.",
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
    { icon: "trust", title: "الثقة", description: "نبني علاقات طويلة الأمد" },
  ],
};

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [aboutData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("aboutPageData");
      return savedData ? JSON.parse(savedData) : defaultAboutData;
    }
    return defaultAboutData;
  });

  useEffect(() => {
    if (heroRef.current) {
      // Entrance animations
      const heroChildren = Array.from(heroRef.current.children);
      gsap.from(heroChildren, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.2)",
      });

      // Continuous animations
      gsap.to(heroRef.current, {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "quality":
        return <Award className="h-8 w-8" />;
      case "price":
        return <Star className="h-8 w-8" />;
      case "service":
        return <Heart className="h-8 w-8" />;
      case "trust":
        return <ShieldCheck className="h-8 w-8" />;
      default:
        return <Award className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-24 pb-12">
        {/* Hero Section */}
        <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden mb-20">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-500/10 dark:via-purple-500/10 dark:to-pink-500/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />

          <div
            ref={heroRef}
            className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              {aboutData.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground">
              {aboutData.subtitle}
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {aboutData.description}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-3xl border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
                مهمتنا
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {aboutData.mission}
              </p>
            </div>
            <div className="p-8 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-3xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">
                رؤيتنا
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {aboutData.vision}
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
              قيمنا
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {aboutData.values.map(
                (
                  value: { icon: string; title: string; description: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="text-center p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:shadow-xl hover:shadow-purple-500/20 transition-all hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                      {getIcon(value.icon)}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center p-12 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl text-white">
            <h2 className="text-3xl font-bold mb-4">هل لديك أسئلة؟</h2>
            <p className="text-lg mb-6 opacity-90">
              نحن هنا لمساعدتك! تواصل معنا في أي وقت
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105">
              تواصل معنا
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
