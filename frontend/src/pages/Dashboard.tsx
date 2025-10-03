import React from 'react';
import Logo from '../components/atoms/Logo';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="small" />
            <div className="text-sm text-gray-600">
              Bem-vindo ao Dashboard!
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dashboard da Embarka
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Login realizado com sucesso! Você está no dashboard.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Dados de teste:</h2>
            <div className="text-left space-y-2">
              <p><strong>Email:</strong> admin@embarka.com</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;