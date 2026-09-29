import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { signIn as signInAction, signOut as signOutAction } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const signIn = async (email?: string, password?: string) => {
    // Implement your sign in logic
    dispatch(signInAction({ email: email || 'user@example.com' }));
  };

  const signUp = async (email?: string, password?: string) => {
    // Implement your sign up logic
    dispatch(signInAction({ email: email || 'user@example.com' }));
  };

  const signOut = () => {
    dispatch(signOutAction());
  };

  return {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
}
