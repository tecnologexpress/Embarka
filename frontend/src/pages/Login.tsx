import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoginTemplate from '../components/templates/LoginTemplate';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulação de autenticação
      console.log('Tentativa de login:', { email, password });
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulação de sucesso (em produção, aqui seria a chamada real para a API)
      if (email === 'admin@embarka.com' && password === '123456') {
        toast.success('Login realizado com sucesso!');
        // Redirecionar para dashboard ou página principal
        navigate('/dashboard');
      } else {
        toast.error('Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro interno do servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return <LoginTemplate onLogin={handleLogin} loading={loading} />;
};

export default Login;