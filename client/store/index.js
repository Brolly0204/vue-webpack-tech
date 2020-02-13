import Vuex from 'vuex'

export default () => {
  const store = new Vuex.Store({
    state: {
      firstName: 'Brolly',
      lastName: 'Lee'
    },
    getters: {
      fullName(state) {
        return `${state.firstName} ${state.lastName}`
      }
    }
  })
  return store
}
