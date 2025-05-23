
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      // Get the current session
      const { data } = await supabase.auth.getSession();
      
      if (!isLoading) {
        if (currentUser) {
          navigate('/overview');
        } else {
          navigate('/login');
        }
      }
    };
    
    checkSession();
  }, [currentUser, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t('common.appName')}</h1>
        <p className="text-xl text-gray-600">{t('common.loading')}</p>
      </div>
    </div>
  );
};

export default Index;
