"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, Receipt, Users, Shield, CheckCircle, ArrowRight, Menu, X, FileText, Clock, Zap } from 'lucide-react';

export default function ExpenseOutHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Receipt className="w-8 h-8" />,
      title: "Receipt Management",
      description: "Digitize and organize all expense receipts in one centralized platform with OCR technology."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Manager Approval",
      description: "Streamlined approval workflows for managers to review and approve expense claims efficiently."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Admin Control",
      description: "Complete administrative oversight with policy enforcement and compliance tracking."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Expense Reports",
      description: "Generate comprehensive reports for accounting and reimbursement processing."
    }
  ];

  const benefits = [
    "Automated receipt capture and data extraction",
    "Multi-level approval workflows",
    "Policy compliance checks",
    "Real-time expense tracking",
    "Integration with accounting systems",
    "Audit trail and reporting"
  ];

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-lg border-b border-gray-800' : 'bg-transparent'} mt-5`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">ExpenseOut</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#how" className="text-gray-400 hover:text-white transition">How It Works</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
              <button className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition font-medium">
                Request Demo
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-b border-gray-800">
            <div className="px-4 pt-2 pb-4 space-y-3">
              <a href="#features" className="block text-gray-400 hover:text-white transition py-2">Features</a>
              <a href="#how" className="block text-gray-400 hover:text-white transition py-2">How It Works</a>
              <a href="#pricing" className="block text-gray-400 hover:text-white transition py-2">Pricing</a>
              <button className="w-full bg-white text-black px-6 py-2 rounded-lg mt-2 font-medium">
                Request Demo
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Enterprise Expense
              <br />
              <span className="text-gray-400">Management Simplified</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-3xl mx-auto">
              Streamline your company&apos;s expense receipt management with powerful tools for employees, managers, and administrators. Automate approvals, enforce policies, and gain complete visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2">
                Request Demo
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition">
                View Pricing
              </button>
            </div>
          </div>

          {/* Hero Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="relative bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-semibold text-lg">Pending Approvals</h3>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Manager View</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-center justify-between mb-3">
                    <Receipt className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Pending</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">Travel Expense</div>
                  <div className="text-2xl font-bold text-white mb-2">$485.00</div>
                  <div className="text-gray-500 text-xs">John Smith • 2 days ago</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-center justify-between mb-3">
                    <Receipt className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">Pending</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">Client Dinner</div>
                  <div className="text-2xl font-bold text-white mb-2">$320.50</div>
                  <div className="text-gray-500 text-xs">Sarah Johnson • 1 day ago</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-center justify-between mb-3">
                    <Receipt className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Approved</span>
                  </div>
                  <div className="text-gray-400 text-sm mb-1">Office Supplies</div>
                  <div className="text-2xl font-bold text-white mb-2">$127.80</div>
                  <div className="text-gray-500 text-xs">Mike Davis • 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Three simple steps to manage your company&apos;s expenses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Employee Submits</h3>
              <p className="text-gray-500">Employees capture receipts and submit expense claims with a few clicks</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Manager Reviews</h3>
              <p className="text-gray-500">Managers review, approve, or reject claims with full context and receipt images</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Admin Processes</h3>
              <p className="text-gray-500">Admins process reimbursements and export to accounting systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Everything your team needs to manage expenses efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition transform hover:scale-105"
              >
                <div className="bg-gray-800 w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Built for Modern Teams
              </h2>
              <p className="text-gray-400 mb-8">
                ExpenseOut provides role-based access for employees, managers, and administrators, ensuring everyone has the right tools and permissions.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Save 75% Time</div>
                    <div className="text-gray-500 text-sm">On expense processing</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-4 border-b border-gray-800">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Instant Approvals</div>
                    <div className="text-gray-500 text-sm">Mobile-friendly workflows</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">100% Compliant</div>
                    <div className="text-gray-500 text-sm">Policy enforcement built-in</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
            <h2 className="text-4xl font-bold text-black mb-4">
              Ready to Streamline Your Expense Management?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join hundreds of companies managing expenses smarter with ExpenseOut
            </p>
            <button className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition transform hover:scale-105">
              Schedule a Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">ExpenseOut</span>
          </div>
          <p className="text-gray-500 mb-4">Enterprise expense management made simple</p>
          <p className="text-gray-600 text-sm">© 2025 ExpenseOut. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}