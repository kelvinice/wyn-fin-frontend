import { Link } from "react-router";
import { motion } from "framer-motion";
import type { Route } from "./+types/home";
import { FancyCard } from "~/components/common/cards/fancy-card";
import { Logo } from "~/components/common/logo";
import { useIsAuthenticated } from "~/components/auth/components/auth-provider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WinFin - Modern Financial Management" },
    { name: "description", content: "Take control of your finances with WinFin's powerful budgeting, tracking, and reporting tools." },
  ];
}

export default function Home() {
  const isAuthenticated = useIsAuthenticated();
  
  // Features section data
  const features = [
    {
      icon: "💰",
      title: "Budget Management",
      description: "Create and manage budgets to keep your spending on track with intuitive tools."
    },
    {
      icon: "📊",
      title: "Financial Insights",
      description: "Get visual reports and analytics to understand your financial habits better."
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with industry-leading security."
    },
    {
      icon: "📱",
      title: "Cross-Platform",
      description: "Access your finances anywhere with our responsive web application."
    }
  ];
  
  return (
    <>
      <section className="relative bg-gradient-to-br from-primary to-primary-focus text-primary-content overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary-focus/50 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 py-20 pt-28 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Take Control of Your Finances
              </h1>
              <p className="text-xl mb-8 opacity-90">
                WinFin helps you track, manage, and optimize your financial life with powerful yet intuitive tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-lg btn-accent">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/auth/register" className="btn btn-lg btn-accent">
                      Get Started Free
                    </Link>
                    <Link to="/auth/login" className="btn btn-lg btn-outline border-white/30 hover:bg-white/10">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-[350px] h-[350px] relative">
                <FancyCard className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="p-6">
                      <Logo className="w-32 h-32 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-content">WinFin Dashboard</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Preview version 1.0</p>
                    <div className="mt-6 grid grid-cols-2 gap-3 p-4">
                      <div className="h-3 bg-primary/20 rounded w-full"></div>
                      <div className="h-3 bg-accent/20 rounded w-full"></div>
                      <div className="h-3 bg-secondary/20 rounded w-full"></div>
                      <div className="h-3 bg-info/20 rounded w-full"></div>
                    </div>
                  </div>
                </FancyCard>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="absolute bottom-0 w-full h-16 bg-base-100" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
      </section>

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Financial Tools</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              WinFin provides everything you need to manage your money effectively and build a secure financial future.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FancyCard className="p-6 h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500">{feature.description}</p>
                </FancyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FancyCard className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="italic text-lg mb-6">
                  "WinFin completely changed how I manage my finances. The insights and budgeting tools helped me save for my first home purchase!"
                </p>
                <p className="font-medium">Kelvin</p>
                <p className="text-sm text-gray-500">Software Developer</p>
              </div>
            </FancyCard>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-secondary to-secondary-focus text-secondary-content">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Finances?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have improved their financial well-being with WinFin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-lg btn-accent">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/auth/register" className="btn btn-lg btn-accent">
                    Start Your Free Account
                  </Link>
                  <Link to="/auth/login" className="btn btn-lg btn-outline border-white/30 hover:bg-white/10">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
