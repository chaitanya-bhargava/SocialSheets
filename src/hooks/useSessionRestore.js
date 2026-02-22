import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { getUser } from '../services/authService';

const useSessionRestore = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { user } } = await getUser();
        if (user) {
          dispatch(loginSuccess(user));
        }
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  return loading;
};

export default useSessionRestore;
