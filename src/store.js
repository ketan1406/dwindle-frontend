import { createStore } from 'vuex';
import { supabase } from './supabase';

const store = createStore({
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
  },
  actions: {
    async login({ commit }, { email, password }) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        commit('SET_USER', data.user); // Commit user to Vuex state
      } catch (error) {
        console.error('Login failed:', error.message);
        throw error; // Bubble up error for UI handling
      }
    },
    async loginWithGoogle({ commit }) {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });
        if (error) throw error;
        commit('SET_USER', data.user);  // Commit the user to Vuex state
      } catch (error) {
        console.error('Google login error:', error.message);
        throw error;  // Let the component handle the error
      }
    },
    async signUp({ commit }, { email, password, username }) {
      try {
        const { data, error } = await supabase.auth.signUp(
          {
            email: email,
            password: password,
            options: {
              data: {
                username: username, // Pass username as metadata
              },
            },
          },
          {
            emailRedirectTo: window.location.origin, // Redirect after verification
          }
        );
        if (error) throw error;
        
        // Commit the user data to the store (optional, if needed immediately)
        commit('SET_USER', data.user);
      } catch (error) {
        console.error('Sign-up error:', error.message);
        throw error;
      }
    },
    logout({ commit }) {
      try {
        supabase.auth.signOut();
        commit('SET_USER', null); // Clear user state on logout
      } catch (error) {
        console.error('Logout failed:', error.message);
        throw error;
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
  },
});

export default store;
