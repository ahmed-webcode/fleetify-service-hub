
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, BarChart3, Fuel, Wrench, Shield, Map } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300",
        scrollY > 50 ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}>
        <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary w-8 h-8 rounded flex items-center justify-center">
              <Car className="text-white h-5 w-5" />
            </div>
            <span className="font-semibold text-xl">FleetHub</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">Benefits</a>
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Get Started
            </Button>
          </div>
          
          <Button 
            size="sm" 
            className="md:hidden"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </Button>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-16 md:py-32 px-4 bg-gradient-to-b from-background to-blue-50 dark:from-background dark:to-blue-950/10">
          <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 animate-fade-in">
                <div className="space-y-6">
                  <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
                    AAU Fleet Management System
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    Smart Fleet Management Solutions
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Streamline your fleet operations with our comprehensive management system, 
                    designed specifically for Addis Ababa University.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      size="lg"
                      className="gap-2"
                      onClick={() => navigate("/dashboard")}
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate("/vehicles")}
                    >
                      View Fleet
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="relative order-1 md:order-2 flex justify-center">
                <div className="relative w-full max-w-md aspect-[4/3] bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-noise opacity-[0.15]"></div>
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2/3 bg-white/30 backdrop-blur-xl rounded-xl border border-white/20 shadow-soft translate-y-[10%] p-6">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                    <div className="h-2 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-white/60 rounded-lg border border-white/30"></div>
                      <div className="h-16 bg-white/60 rounded-lg border border-white/30"></div>
                      <div className="h-16 bg-white/60 rounded-lg border border-white/30"></div>
                      <div className="h-16 bg-white/60 rounded-lg border border-white/30"></div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 right-1/4 w-32 h-32 bg-primary/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Fleet Management</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our system streamlines every aspect of fleet management for Addis Ababa University,
                from vehicle tracking to maintenance scheduling.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Car className="h-6 w-6" />,
                  title: "Fleet Service",
                  description: "Easily manage vehicle requests, approvals, and optimize fleet utilization."
                },
                {
                  icon: <Fuel className="h-6 w-6" />,
                  title: "Fuel Management",
                  description: "Track fuel consumption, manage refueling requests, and analyze efficiency."
                },
                {
                  icon: <Wrench className="h-6 w-6" />,
                  title: "Maintenance Tracking",
                  description: "Schedule preventive maintenance and manage repair requests efficiently."
                },
                {
                  icon: <Map className="h-6 w-6" />,
                  title: "GPS Integration",
                  description: "Real-time vehicle tracking, route optimization, and location history."
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Advanced Analytics",
                  description: "Comprehensive reporting and insights to optimize your fleet operations."
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Secure Workflows",
                  description: "Structured approval processes and secure data management."
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-card rounded-xl border border-border p-6 hover-lift"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="benefits" className="py-20 px-4 bg-secondary">
          <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Why Choose Our Fleet Management System?</h2>
                <div className="space-y-6">
                  {[
                    {
                      title: "Streamlined Operations",
                      description: "Reduce administrative burden and improve operational efficiency."
                    },
                    {
                      title: "Cost Reduction",
                      description: "Identify cost-saving opportunities through data analysis and optimization."
                    },
                    {
                      title: "Enhanced Visibility",
                      description: "Gain complete visibility into your fleet's performance and status."
                    },
                    {
                      title: "Data-Driven Decisions",
                      description: "Make informed decisions backed by comprehensive analytics and reports."
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{benefit.title}</h3>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <Button 
                    onClick={() => navigate("/dashboard")}
                    className="gap-2"
                  >
                    Explore Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-card rounded-xl overflow-hidden border border-border shadow-soft">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Car className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Fleet Management Dashboard</h3>
                      <p className="text-muted-foreground">Interactive visualizations and analytics for your fleet</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -z-10 -bottom-6 -left-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="bg-primary w-8 h-8 rounded flex items-center justify-center">
                <Car className="text-white h-5 w-5" />
              </div>
              <span className="font-semibold">FleetHub</span>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-muted-foreground">Designed for Addis Ababa University</p>
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Fleet Management System</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
