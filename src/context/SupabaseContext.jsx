import React, { createContext, useState, useEffect } from 'react';
    import { createClient } from '@supabase/supabase-js';

    const SupabaseContext = createContext();

    const SupabaseProvider = ({ children }) => {
      const [supabase] = useState(() =>
        createClient(
          'https://wmfxigarzhyvkahoqmzy.supabase.co',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZnhpZ2Fyemh5dmthaG9xbXp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2NTY0ODcsImV4cCI6MjA1MjIzMjQ4N30.qT27aFaUU-jniQ9NEQYx64APjrbisN59fPl22joBMgo'
        )
      );
      const [session, setSession] = useState(null);
      const [user, setUser] = useState(null);
      const [isAdmin, setIsAdmin] = useState(false);

      useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          if (session) {
            fetchUser(session.user.id);
          }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            if (session) {
              fetchUser(session.user.id);
            } else {
              setUser(null);
              setIsAdmin(false);
            }
          }
        );

        return () => subscription.unsubscribe();
      }, [supabase]);

      const fetchUser = async (userId) => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching user:', error);
          } else {
            setUser(data);
            setIsAdmin(data?.role === 'admin');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      const createAdminUser = async () => {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', 'jangamsudip@gmail.com')
            .single();

          if (!existingUser) {
            const { data, error } = await supabase.from('users').insert([
              {
                id: session.user.id,
                name: 'sudip Jangam',
                email: 'jangamsudip@gmail.com',
                mobile: '8308903224',
                role: 'admin',
                restaurant_id: null,
              },
            ]);

            if (error) {
              console.error('Error creating admin user:', error);
            } else {
              fetchUser(session.user.id);
            }
          }
        } catch (error) {
          console.error('Error creating admin user:', error);
        }
      };

      return (
        <SupabaseContext.Provider
          value={{ supabase, session, user, isAdmin, createAdminUser }}
        >
          {children}
        </SupabaseContext.Provider>
      );
    };

    export { SupabaseContext, SupabaseProvider };
