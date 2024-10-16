import { createStore } from 'vuex';
import { supabase } from './supabase';

const store = createStore({
  state: {
    user: null,
    role: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
  },
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        commit('SET_USER', data.user); // Commit user to Vuex state
        await dispatch('fetchUserRole');
      } catch (error) {
        console.error('Login failed:', error.message);
        throw error; // Bubble up error for UI handling
      }
    },
    async loginWithGoogle() {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
        });
        if (error) throw error;
        // commit('SET_USER', data.user);
      } catch (error) {
        console.error('Google login error:', error.message);
        throw error;  // Let the component handle the error
      }
    },
    async signUp(_, { email, password, username }) {
      try {
        const { error } = await supabase.auth.signUp(
          {
            email: email,
            password: password,
            options: {
              user_metadata: {
                username: username, // Pass username as metadata
              },
              emailRedirectTo: window.location.origin, // Redirect after verification
            },
          },
        );
        if (error) throw error;
        
        // Commit the user data to the store (optional, if needed immediately)
        // commit('SET_USER', data.user);
      } catch (error) {
        console.error('Sign-up error:', error.message);
        throw error;
      }
    },
    logout({ commit }) {
      try {
        supabase.auth.signOut();
        commit('SET_USER', null); // Clear user state on logout
        commit('SET_ROLE', null); // Clear role on logout
      } catch (error) {
        console.error('Logout failed:', error.message);
        throw error;
      }
    },
    async fetchUserRole({ commit }) {
      try {
        const { data, error } = await supabase.rpc('get_user_role');
        if (error) {
          console.error('Error fetching user role:', error.message);
          commit('SET_ROLE', null);
          return;
        }
        console.log('Fetched user role data:', data); // Add this line

        const roleName = data;
        commit('SET_ROLE', roleName);
      } catch (error) {
        console.error('Unexpected error in fetchUserRole:', error.message);
        commit('SET_ROLE', null);
      }
    },
  },
  getters: {
    isAuthenticated(state) {
      return !!state.user;
    },
    isAdmin(state) {
      return state.role === 'Admin';
    },
  },
});

export default store;
