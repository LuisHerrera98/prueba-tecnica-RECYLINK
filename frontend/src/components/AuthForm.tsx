import { useState, FormEvent } from 'react';
import type { AuthResponse } from '../types/auth';
import { login, register, setToken } from '../services/api';

interface Props {
  onAuth: (user: AuthResponse['user']) => void;
}

export default function AuthForm({ onAuth }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      let result: AuthResponse;

      if (isLogin) {
        result = await login({
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        });
      } else {
        result = await register({
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          password: formData.get('password') as string,
        });
      }

      setToken(result.access_token);
      onAuth(result.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>

      {error && <p className="auth-form__error">{error}</p>}

      {!isLogin && (
        <div className="event-form__field">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" type="text" required />
        </div>
      )}

      <div className="event-form__field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className="event-form__field">
        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" minLength={6} required />
      </div>

      <div className="auth-form__actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </div>

      <p className="auth-form__toggle">
        {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? 'Registrate' : 'Iniciá sesión'}
        </button>
      </p>
    </form>
  );
}
