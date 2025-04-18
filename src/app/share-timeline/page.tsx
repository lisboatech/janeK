'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TimelineFuturistic from '@/components/timeline/timeline';
import { BackButton } from '@/components/ui/back-button';
import Loader from '@/components/ui/loader';

// Componente interno que usa useSearchParams
function SharedTimelineContent() {
  const searchParams = useSearchParams();
  const [timelineData, setTimelineData] = useState(null);
  const [error, setError] = useState('');
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    try {
      // Obter dados da URL
      const data = searchParams.get('data');

      if (!data) {
        setError('Nenhum dado encontrado na URL.');
        return;
      }

      // Decodificar e converter para objeto
      const decodedData = JSON.parse(decodeURIComponent(data));
      setTimelineData(decodedData);

      // Converter os dados para o formato esperado pelo TimelineThreeStats
      const mealTypes = Object.keys(decodedData.mealStats);
      const convertedMeals = mealTypes.flatMap(type => {
        const calories = decodedData.mealStats[type];
        // Se não houver calorias para este tipo, não criar refeição
        if (calories <= 0) return [];

        // Usar a data atual para cada refeição compartilhada
        const now = new Date();

        return [{
          type,
          calories,
          name: `${type} compartilhado`,
          description: 'Refeição compartilhada via link',
          dateTime: now.toISOString() // Usar o horário real que o usuário adicionou
        }];
      });

      setMeals(convertedMeals);
    } catch (err) {
      console.error('Erro ao processar dados compartilhados:', err);
      setError('Erro ao processar os dados compartilhados. O formato pode estar inválido.');
    }
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4 w-full overflow-hidden">
        <div className="bg-black/30 backdrop-blur-xl p-5 sm:p-8 rounded-xl border border-white/10 max-w-md w-full">
          <h1 className="text-xl sm:text-2xl font-light mb-3 sm:mb-4">Erro ao carregar cronologia</h1>
          <p className="text-white/70 text-sm sm:text-base mb-4 sm:mb-6">{error}</p>
          <BackButton href="/dashboard" />
        </div>
      </div>
    );
  }

  if (!timelineData || meals.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center w-full overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 relative">
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/20 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white/60 animate-spin" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-white text-base sm:text-xl font-light tracking-wide text-center px-4" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>Carregando cronologia compartilhada...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black w-full overflow-hidden">
      {/* Visualização da cronologia */}
      <TimelineFuturistic meals={meals} isSharedView={true} />
    </div>
  );
}

// Componente principal com Suspense boundary
export default function SharedTimelinePage() {
  return (
    <Suspense fallback={<Loader message="Carregando cronologia compartilhada..." />}>
      <SharedTimelineContent />
    </Suspense>
  );
}
