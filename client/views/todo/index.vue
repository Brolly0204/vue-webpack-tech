<template>
  <section id="real-app">
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么？"
      @keyup.enter="addTodo"
    >
    <Item
      v-for="todo in filterTodos"
      :todo="todo"
      :key="todo.id"
      @del="deleteTodo"
    />
    <Tabs
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    />
  </section>
</template>

<script>
import Item from './item'
import Tabs from './tabs'

export default {
  components: {
    Item,
    Tabs
  },
  computed: {
    filterTodos() {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => todo.completed === completed)
    }
  },
  data() {
    return {
      todos: [],
      filter: 'all'
    }
  },
  methods: {
    addTodo(e) {
      const value = e.target.value.trim()
      if (/^\s*$/.test(value)) return
      this.todos.unshift({
        id: this.todos.length,
        content: value,
        completed: false
      })
      this.filter = 'all'
      e.target.value = ''
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id)
    },
    toggleFilter(state) {
      this.filter = state
    },
    clearAllCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    }
  }
}
</script>

<style lang="stylus" scoped>
#real-app
  width 600px
  margin 0 auto
  box-shadow 0 0 5px #666

  .add-input
    position relative
    margin 0
    width 100%
    line-height 1.4rem
    font-size 24px
    font-family inherit
    font-weight inherit
    outline none
    box-sizing border-box
    font-smoothing antialiased
    padding 16px 16px 16px 60px
    border none
    box-shadow inset 0 -2px 1px rgba(0, 0, 0, 0.03)
</style>
