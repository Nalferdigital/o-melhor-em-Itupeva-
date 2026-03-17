
import React from 'react';
import { Check, ArrowRight, ArrowLeft, Zap, Star, Crown } from 'lucide-react';
import { motion } from 'motion/react';

interface PricingProps {
  onSelectPlan: (plan: string) => void;
  onBack: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, onBack }) => {
  const plans = [
    {
      name: 'Bronze',
      price: 'Grátis',
      description: 'Ideal para quem está começando e quer ser encontrado.',
      icon: <Zap className="text-orange-500" />,
      features: [
        'Listagem básica no guia',
        'Endereço e Telefone',
        'Link para WhatsApp',
        'Aparece em buscas por categoria',
      ],
      buttonText: 'Começar Grátis',
      highlight: false
    },
    {
      name: 'Prata',
      price: 'R$ 49,90',
      period: '/mês',
      description: 'Destaque sua empresa e ganhe mais visibilidade.',
      icon: <Star className="text-blue-500 fill-blue-500" />,
      features: [
        'Tudo do plano Bronze',
        'Selo de Empresa Verificada',
        'Links para Redes Sociais',
        'Galeria com até 3 fotos',
        'Prioridade média nas buscas',
      ],
      buttonText: 'Assinar Prata',
      highlight: true
    },
    {
      name: 'Ouro',
      price: 'R$ 89,90',
      period: '/mês',
      description: 'A força total para dominar o mercado local.',
      icon: <Crown className="text-yellow-500 fill-yellow-500" />,
      features: [
        'Tudo do plano Prata',
        'Destaque na Página Inicial',
        'Galeria ilimitada de fotos',
        'Suporte prioritário 24h',
        'Topo absoluto das buscas',
        'Relatório mensal de acessos',
      ],
      buttonText: 'Assinar Ouro',
      highlight: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-gray-900 tracking-tight"
          >
            Planos e Preços
          </motion.h2>
          <p className="text-gray-500 text-lg">Escolha o plano ideal para o crescimento do seu negócio.</p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold hover:underline">
          <ArrowLeft size={20} />
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${
              plan.highlight 
                ? 'border-blue-600 shadow-2xl scale-105 z-10 bg-white' 
                : 'border-gray-100 shadow-sm hover:shadow-xl bg-white'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                Mais Popular
              </div>
            )}

            <div className="mb-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                {plan.icon}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{plan.description}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                {plan.period && <span className="text-gray-400 font-bold">{plan.period}</span>}
              </div>
            </div>

            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-0.5 rounded-full text-green-600">
                    <Check size={14} />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectPlan(plan.name)}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 ${
                plan.highlight
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:bg-blue-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {plan.buttonText}
              <ArrowRight size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 p-8 rounded-[2.5rem] text-center space-y-4 border border-blue-100"
      >
        <h4 className="text-xl font-black text-blue-900 uppercase tracking-widest">Dúvidas sobre os planos?</h4>
        <p className="text-blue-700 font-medium max-w-2xl mx-auto">
          Nossa equipe está pronta para ajudar você a escolher a melhor estratégia para sua empresa em Itupeva. 
          Entre em contato pelo WhatsApp para um atendimento personalizado.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95">
          Falar com Consultor
        </button>
      </motion.div>
    </div>
  );
};

export default Pricing;
