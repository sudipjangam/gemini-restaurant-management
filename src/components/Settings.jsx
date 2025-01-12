import React, { useContext } from 'react';
    import { SupabaseContext } from '../context/SupabaseContext';

    function Settings() {
      const { supabase, session } = useContext(SupabaseContext);

      const handleLogout = async () => {
        await supabase.auth.signOut();
      };

      return (
        <div>
          <h2>Settings</h2>
          <p>Manage your profile and settings here.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }

    export default Settings;
