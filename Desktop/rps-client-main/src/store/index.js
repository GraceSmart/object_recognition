import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import createPersistedState from "vuex-persistedstate"

import {
    LOGIN_PLAYER,
    LOGOUT_PLAYER,
    PLAYER_EXISTS,
    UPDATE_PLAYERS,
    START_MATCH,
    MAKE_TURN,
    END_MATCH,
    NEW_MATCH,
    MATCH_REQUESTED,
    SET_MODE
} from './mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        user: null,
        users: [],
        screen: 'login',
        invalidUser: false,
        inMatchWith: null,
        winner: null,
        matchRequest: null,
        turn: null,
        mode: 'buttons',
        result: null
    },
    mutations: {
        [LOGIN_PLAYER](state, payload) {
            state.user = payload
            state.screen = 'idle'
            state.invalidUser = false
            state.inMatchWith = null
            state.matchRequest = null
            state.turn = null
        },
        [LOGOUT_PLAYER](state) {
            state.user = null
        },
        [PLAYER_EXISTS](state) {
            state.invalidUser = true
        },
        [UPDATE_PLAYERS](state, users) {
            state.users = users
        },
        [START_MATCH](state, player) {
            state.inMatchWith = player
            state.matchRequest = null
            state.screen = 'match'
        },
        [MAKE_TURN](state, payload) {
            state.turn = payload.turn
        },
        [END_MATCH](state, payload) {
            state.result = payload
            state.screen = 'result'
        },
        [NEW_MATCH](state) {
            state.winner = null
            state.turn = null
            state.result = null
            state.screen = 'idle'
        },
        [MATCH_REQUESTED](state, payload) {
            state.matchRequest = payload
        },
        [SET_MODE](state, payload) {
            state.mode = payload
        }
    },
    actions: {
        login(_, username) {
            this.socket.emit('login', username)
        },
        logout({state}) {
            this.socket.emit('logout', state.user.username)
        },
        requestMatch({ commit }, opponent) {
            commit(MATCH_REQUESTED, opponent)
            this.socket.emit('requestMatch', {
                opponent
            })
        },
        makeTurn({ commit }, turn) {
            commit(MAKE_TURN, turn)
            this.socket.emit('makeTurn', {
                turn
            })
        },
        newMatch({ commit }) {
            commit(NEW_MATCH)
            this.socket.emit('newMatch')
        },
        setMode({commit}, mode) {
            commit(SET_MODE, mode)
        },
        socket_userLoggedIn({ commit }, user) {
            commit(LOGIN_PLAYER, user)
            router.push({
                name: 'game'
            }).catch(() => {})
        },
        socket_userExists({ commit }) {
            commit(PLAYER_EXISTS)
        },
        socket_userLoggedOut({ commit }, user) {
            commit(LOGOUT_PLAYER, user)
            router.push({
                name: 'login'
            }).catch(() => {})
        },
        socket_players({ commit }, players) {
            commit(UPDATE_PLAYERS, players)
        },
        socket_startMatch({ commit }, opponent) {
            commit(START_MATCH, opponent)
        },
        socket_matchResult({ commit }, winner) {
            commit(END_MATCH, winner)
        }
    },
    getters: {
        loggedIn: state => {
            return state.user !== null
        },
        username: state => {
            return state.user.username
        }
    }
})

export default store