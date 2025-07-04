import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const features = [
    {
      name: 'Ingredients',
      href: '/ingredients',
      description: 'Manage your ingredient library with smart categorization and nutritional insights.',
      icon: '🥕',
      color: 'from-green-400 to-emerald-500',
      stats: 'Track 500+ ingredients'
    },
    {
      name: 'Dishes',
      href: '/dishes',
      description: 'Create and organize your favorite recipes with detailed ingredient breakdowns.',
      icon: '🍽️',
      color: 'from-blue-400 to-cyan-500',
      stats: 'Unlimited recipes'
    },
    {
      name: 'Consumption',
      href: '/consumption',
      description: 'Log your meals and track nutrition patterns with intelligent analytics.',
      icon: '📊',
      color: 'from-purple-400 to-pink-500',
      stats: 'Daily insights'
    },
    {
      name: 'Recommendations',
      href: '/recommendations',
      description: 'Get AI-powered suggestions for varied nutrition based on your eating history.',
      icon: '✨',
      color: 'from-yellow-400 to-orange-500',
      stats: 'Smart suggestions'
    },
  ];

  const benefits = [
    'Avoid ingredient repetition',
    'Increase nutritional variety',
    'Smart meal planning',
    'Track eating patterns',
    'Personalized recommendations'
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-medium border border-primary-200">
            <span className="animate-bounce-gentle mr-2">✨</span>
            Smart Nutrition Tracking
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Diversify Your{' '}
            <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nutrition
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track ingredients, create dishes, and get intelligent recommendations to maintain 
            a varied and balanced diet. Never eat the same thing twice in a row!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/ingredients"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            Get Started
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/recommendations"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-primary-300 transform hover:-translate-y-1 transition-all duration-300"
          >
            View Recommendations
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose NutriTrack?</h2>
          <p className="text-gray-600">Built to help you achieve nutritional variety effortlessly</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => (
            <div key={benefit} className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 font-medium">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for Smart Nutrition
          </h2>
          <p className="text-gray-600 text-lg">
            Powerful tools to track, analyze, and optimize your dietary variety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {feature.stats}
                    </div>
                    <ArrowRightIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-300 ml-auto mt-1" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300">
                  <span className="text-sm">Explore {feature.name.toLowerCase()}</span>
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-500 via-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Nutrition?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of users who have improved their dietary variety and health with NutriTrack's intelligent recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              to="/ingredients"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              Start Tracking Now
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/recommendations"
              className="inline-flex items-center px-8 py-4 bg-white bg-opacity-10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white border-opacity-30 hover:bg-white hover:bg-opacity-20 transform hover:-translate-y-1 transition-all duration-300"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}