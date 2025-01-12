import React, { useState, useContext } from 'react';
    import { SupabaseContext } from '../context/SupabaseContext';
    import { useNavigate } from 'react-router-dom';

    function Login() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const { supabase } = useContext(SupabaseContext);
      const navigate = useNavigate();

      const handleLogin = async (e) => {
        e.preventDefault();
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            console.error('Login error:', error);
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Login error:', error);
        }
      };

      return (
        <div className="auth-container">
          <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      );
    }

    export default Login;
