import React, { useState } from 'react';
import { Send, User, MessageSquare, Phone, DollarSign } from 'lucide-react';
import FloatingElements from './FloatingElements';
import ThankYouModal from './ThankYouModal';
import { supabase } from '../lib/supabase';

const LandingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    instagram: '',
    expectations: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase
        .from('submissions')
        .insert([
          {
            name: formData.name,
            contact: formData.contact,
            instagram: formData.instagram,
            expectations: formData.expectations,
            status: 'pending'
          }
        ]);

      if (submitError) throw submitError;

      setTimeout(() => {
        setShowModal(true);
        setFormData({ name: '', contact: '', instagram: '', expectations: '' });
        setIsSubmitting(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Хатогӣ рух дод. Лутфан дубора кӯшиш кунед.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <FloatingElements />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/5"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-radial from-yellow-400/30 via-yellow-400/10 to-transparent rounded-full animate-pulse-glow"></div>
              <div className="absolute w-80 h-80 md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] border-2 border-yellow-400/20 rounded-full animate-spin-slow"></div>
              <div className="absolute w-72 h-72 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] border border-yellow-400/15 rounded-full animate-spin-reverse"></div>
              <div className="absolute w-4 h-4 bg-yellow-400/40 rounded-full animate-float-particle-1" style={{ top: '20%', left: '15%' }}></div>
              <div className="absolute w-3 h-3 bg-yellow-400/50 rounded-full animate-float-particle-2" style={{ top: '30%', right: '20%' }}></div>
              <div className="absolute w-5 h-5 bg-yellow-400/30 rounded-full animate-float-particle-3" style={{ bottom: '25%', left: '10%' }}></div>
              <div className="absolute w-2 h-2 bg-yellow-400/60 rounded-full animate-float-particle-4" style={{ bottom: '35%', right: '15%' }}></div>
              <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border border-yellow-400/25 rounded-full animate-expand-wave"></div>
              <div className="absolute w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border border-yellow-400/20 rounded-full animate-expand-wave-delayed"></div>
            </div>
            <div className="relative z-10 inline-block">
              <img
                src="/1.jpg"
                alt="Instabarakat"
                className="max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg h-auto object-contain mx-auto shadow-2xl shadow-yellow-400/20"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-fade-in">
            Instabarakat
          </h1>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12 text-gray-300 animate-fade-in-delay">
            Поток 2.0
          </h2>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-yellow-400/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-yellow-400/10">
            <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-8 text-center">
              ✨ Ассалому алейкум
            </h3>
            <div className="prose prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
              
              <p className="text-xl text-center text-yellow-400 font-semibold">
                ✏️ Барои дохил шудан маълумоти худро дар поен  нависед!⬇️ 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-gray-900/70 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-yellow-400/20">
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-8">
              {/* Name */}
              <div className="relative">
                <label className="block text-yellow-400 font-semibold mb-3 text-lg">Ном ва насаб:</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="Номи пурраи худро ворид кунед"
                  />
                </div>
              </div>

              {/* Contact */}
              <div className="relative">
                <label className="block text-yellow-400 font-semibold mb-3 text-lg">Номери телефон барои тамос:</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="+992xxxxxxxxx"
                  />
                </div>
              </div>

              {/* Income (uses 'instagram' field) */}
              <div className="relative">
                <label className="block text-yellow-400 font-semibold mb-3 text-lg">Даромади моҳонаи шумо чӣ қадар?</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400 w-5 h-5" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300"
                    placeholder="Масалан: 2000 сомонӣ"
                  />
                </div>
              </div>

              {/* Expectations */}
              <div className="relative">
                <label className="block text-yellow-400 font-semibold mb-3 text-lg">Аз курс чӣ интизор доред?</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-yellow-400 w-5 h-5" />
                  <textarea
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all duration-300 resize-none"
                    placeholder="Мақсадҳо ва интизориҳои худро нависед..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-6 px-8 rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Фиристондан
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <ThankYouModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default LandingPage;
