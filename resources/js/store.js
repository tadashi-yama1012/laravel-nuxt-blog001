import Vuex from 'vuex';
import axios from 'axios';

const store = new Vuex.Store({
    state: {
        user: null,
        entries: [],
        entry: null
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        unsetUser(state) {
            state.user = null;
        },
        setEntries(state, entries) {
            state.entries = entries;
        },
        setEntry(state, entry) {
            state.entry = entry;
        }
    },
    actions: {
        async registration({}, payload) {
            const {data} = await axios.post('/api/registration', payload);
            console.log(data);
        },
        async login({commit}, payload) {
            const {data} = await axios.post('/api/login', payload);
            const token = data.access_token;
            if (token) {
                const {data} = await axios.get('/api/me?token=' + token);
                commit('setUser', {token, ...data});
                console.log(this.state.user);
            }
        },
        async logout({commit, state}) {
            await axios.post('/api/logout?token=' + state.user.token);
            commit('unsetUser');
        },
        async fetchEntries({commit}) {
            const {data} = await axios.get('/api/blog');
            commit('setEntries', data);
        },
        async fetchEntry({commit}, payload) {
            const {data} = await axios.get('/api/blog/' + payload);
            commit('setEntry', data);
        },
        async postEntry({state, dispatch}, payload) {
            const {data} = await axios.post('/api/blog?token=' + state.user.token, payload);
            console.log(data);
            await dispatch('fetchEntries');
        }
    },
    getters: {
        logged: (state) => {
            return state.user !== null;
        },
        userId: (state) => {
            if (state.user) {
                return state.user.id;
            } else {
                return -1;
            }
        },
        entries: (state) => {
            return [...state.entries].reverse();
        },
        recentEntries: (state) => {
            return [...state.entries].reverse().filter((_, i) => i < 5);
        },
        entry: (state) => {
            return Object.assign({}, state.entry);
        }
    }
});

export {
    store
};