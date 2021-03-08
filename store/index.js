import _isEmpty from 'lodash/isEmpty'

export const state = () => ({
  user: {}
})

export const getters = {
  isLoggedIn: (state) => {
    return !_isEmpty(state.user)
  }
}

export const mutations = {
  set_user(state, user) {
    state.user = user
  }
}
