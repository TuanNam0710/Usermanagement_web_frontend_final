import Vue from 'vue'
import Vuex from 'vuex'
import { getToken } from '../utils/auth'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: getToken(),
        id: "",
    },
    mutations: {
        SET_TOKEN(state, token) {
            this.state.token = token;
        },
        SET_ID(state, id) {
            this.state.id = id;
        },
    },
    getters: {
        isAuth(state) {
            return !!state.token;
        }
    },
})
