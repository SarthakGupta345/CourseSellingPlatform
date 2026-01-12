"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, DollarSign, Users } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Create & Sell Courses",
    description:
      "Anyone can create courses and start selling instantly. No approvals, no friction.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: DollarSign,
    title: "Earn on Your Terms",
    description:
      "Set your own pricing, launch offers, and get paid directly into your account.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Reach Learners Globally",
    description:
      "Publish once and reach students worldwide with built-in discovery.",
    color: "from-orange-500 to-pink-500",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const FeaturesBox = () => {
  return (
    <section className="relative w-full px-6 md:px-20 py-24 bg-neutral-50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mb-16 relative z-10"
      >
        <p className="text-sm font-semibold text-indigo-600 mb-2">
          LearnForge for Creators
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
          Anyone can teach. <br /> Anyone can earn.
        </h2>
        <p className="mt-5 text-neutral-600 text-lg">
          Build, launch, and monetize your knowledge — without gatekeepers.
        </p>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl relative z-10"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              whileHover={{
                y: -10,
                scale: 1.03,
              }}
              className="group bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
              >
                <Icon className="w-7 h-7 text-white group-hover:rotate-6 transition-transform" />
              </div>

              {/* Text */}
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover line */}
              <div className="mt-6 h-[2px] w-0 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300" />
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeaturesBox;
