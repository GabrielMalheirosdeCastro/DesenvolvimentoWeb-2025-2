import React from 'react';
import { LocalhostLink, Localhost3000Link, useLocalhostStatus } from './localhost-link';

export const LocalhostDemo: React.FC = () => {
  const { isRunning, lastChecked } = useLocalhostStatus(3000);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🌐 Demonstração Links Localhost</h1>
        <p className="text-gray-600">
          Diferentes estilos de links para http://localhost:3000
        </p>
      </div>

      {/* Status do servidor */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">📊 Status do Servidor</h2>
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isRunning === null ? 'bg-yellow-100 text-yellow-800' :
            isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isRunning === null ? '⏳ Verificando...' :
             isRunning ? '🟢 Servidor Online' : '🔴 Servidor Offline'}
          </span>
          {lastChecked && (
            <span className="text-xs text-gray-500">
              Última verificação: {lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Estilos de botão */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🎨 Estilo Botão</h2>
        <div className="flex flex-wrap gap-4">
          <Localhost3000Link style="button">
            localhost:3000
          </Localhost3000Link>
          
          <LocalhostLink port={3000} style="button" showProtocol={true}>
            Servidor de Desenvolvimento
          </LocalhostLink>
        </div>
      </div>

      {/* Estilos de badge */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🏷️ Estilo Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Localhost3000Link style="badge" />
          <LocalhostLink port={3000} style="badge" showProtocol={false}>
            Dev Server
          </LocalhostLink>
        </div>
      </div>

      {/* Estilos inline */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">📝 Estilo Inline</h2>
        <p className="text-gray-700">
          Para acessar o servidor de desenvolvimento, clique em {' '}
          <Localhost3000Link style="inline" showProtocol={false} />
          {' '} e a aplicação será aberta no seu navegador.
        </p>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-3">
          💡 Como usar este componente
        </h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p><strong>Básico:</strong> <code>&lt;Localhost3000Link /&gt;</code></p>
          <p><strong>Customizado:</strong> <code>&lt;LocalhostLink port=&quot;8080&quot; style=&quot;button&quot; /&gt;</code></p>
          <p><strong>Com texto:</strong> <code>&lt;Localhost3000Link&gt;Meu Servidor&lt;/Localhost3000Link&gt;</code></p>
        </div>
      </div>

      {/* Resolução de problemas */}
      <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
        <h2 className="text-lg font-semibold text-yellow-800 mb-3">
          🔧 Por que o link não funciona?
        </h2>
        <div className="space-y-2 text-sm text-yellow-700">
          <p>✅ <strong>Servidor rodando?</strong> Execute <code>npm run dev</code></p>
          <p>✅ <strong>Porta correta?</strong> Verifique se é realmente a porta 3000</p>
          <p>✅ <strong>Protocolo http://:</strong> Localhost não usa HTTPS</p>
          <p>✅ <strong>Firewall:</strong> Pode estar bloqueando conexões locais</p>
          <p>✅ <strong>Browser:</strong> Teste em modo incógnito</p>
        </div>
      </div>
    </div>
  );
};

export default LocalhostDemo;