import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/'); // redirect to login/dashboard
      } else {
        setChecking(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (checking) return <div>Checking authentication...</div>;

  return children;
}
