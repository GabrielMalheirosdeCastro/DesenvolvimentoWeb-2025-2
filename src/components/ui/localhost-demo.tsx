import React from 'react';
import Localhost3000Link from './localhost-link';

export const LocalhostDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🌐 Demonstração Links Localhost</h1>
        <p className="text-gray-600">
          Componente inteligente que detecta automaticamente o ambiente atual
        </p>
      </div>

      {/* Status do servidor */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          📊 Status Atual do Ambiente
        </h2>
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            🟢 Sistema Online
          </div>
        </div>
      </div>

      {/* Demonstração Estilos do Componente */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Estilos Disponíveis</h2>
        
        {/* Estilo Button */}
        <div className="space-y-2">
          <h3 className="font-medium">Button Style (Padrão)</h3>
          <Localhost3000Link variant="button" />
        </div>
        
        {/* Estilo Badge */}
        <div className="space-y-2">
          <h3 className="font-medium">Badge Style</h3>
          <Localhost3000Link variant="badge" />
        </div>
        
        {/* Estilo Inline */}
        <div className="space-y-2">
          <h3 className="font-medium">Inline Style</h3>
          <p>Acesse: <Localhost3000Link variant="inline" /></p>
        </div>
      </div>

      {/* Como usar */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          💡 Como usar este componente
        </h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>Básico:</strong> <code>&lt;Localhost3000Link /&gt;</code></p>
          <p><strong>Badge:</strong> <code>&lt;Localhost3000Link variant="badge" /&gt;</code></p>
          <p><strong>Inline:</strong> <code>&lt;Localhost3000Link variant="inline" /&gt;</code></p>
        </div>
      </div>

      {/* Resolução de problemas */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-semibold text-yellow-800 mb-3">
          🔧 Resolução de Problemas
        </h2>
        <div className="space-y-3 text-sm text-yellow-700">
          <div>
            <strong>Servidor offline?</strong>
            <p>Execute: <code className="bg-yellow-100 px-2 py-1 rounded">npm run dev</code></p>
          </div>
          <div>
            <strong>Porta ocupada?</strong>
            <p>O Vite automaticamente encontrará uma porta disponível</p>
          </div>
          <div>
            <strong>Erro de CORS?</strong>
            <p>Verifique se o servidor está executando na mesma origem</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalhostDemo;