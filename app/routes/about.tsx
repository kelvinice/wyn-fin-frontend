import { Link } from "react-router";
import { motion } from "framer-motion";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { Logo } from "~/components/common/logo";
import { PublicLayout } from "~/components/layout/public-layout";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us | WinFin" },
    { name: "description", content: "Learn about WinFin's mission and team" },
  ];
}

export default function AboutPage() {
  const team = [
    {
      name: "Fin",
      role: "Founder & Programmer",
      bio: "With over 6 years of experience in technology, founded WinFin with a mission to make personal finance management accessible to everyone. He holds is passionate about helping people achieve financial freedom.",
      emoji: "👨‍💻"
    },
    {
      name: "Win",
      role: "Founder & Creative Director",
      bio: "Win brings her background in UI/UX design and behavioral economics to create intuitive financial tools that people love to use. She believes financial wellness is a journey, and the right tools can make all the difference.",
      emoji: "👩‍🎨"
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-focus text-primary-content py-16 pt-32">
        <div className="container mx-auto px-6 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Logo className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About WinFin</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Transforming personal finance management through innovative technology and thoughtful design.
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mission Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg mb-8">
              At WinFin, we believe that financial wellness should be accessible to everyone. Our mission is to empower individuals with the tools and insights they need to make confident financial decisions and build a secure future.
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-primary rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Meet Our Team</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              The passionate individuals behind WinFin who are dedicated to revolutionizing financial management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <FancyCard className="p-6 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-5xl">{member.emoji}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary mb-4">{member.role}</p>
                    <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                  </div>
                </FancyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <FancyCard className="p-8">
                <p className="mb-4">
                  WinFin began in 2025 when Fin and Win Lorem ipsum dolor sit, amet consectetur adipisicing elit. Saepe, necessitatibus dolorem. Nostrum nam omnis odio repudiandae quo quis, totam mollitia maxime quidem perspiciatis non neque distinctio sit voluptatem, nesciunt quibusdam!
                </p>
                
              </FancyCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              The core principles that guide everything we do at WinFin
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Accessibility", desc: "Financial tools should be easy to understand and use for everyone.", icon: "🌍" },
              { title: "Transparency", desc: "We believe in being honest about how we work and how we use your data.", icon: "🔎" },
              { title: "Empowerment", desc: "Our goal is to give you the knowledge and tools to make confident financial decisions.", icon: "💪" }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary-focus text-primary-content">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Join Us on Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              Ready to take control of your financial future with a team that cares about your success?
            </p>
            <Link to="/auth/register" className="btn btn-lg btn-accent">
              Start Your Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-base-300 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} WinFin. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}