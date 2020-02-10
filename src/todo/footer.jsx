import '../assets/styles/footer.styl'

export default {
  data() {
    return {
      auth: 'Brolly'
    }
  },
  render() {
    return (
      <div id="footer">
        <span>Written by {this.auth}</span>
      </div>
    )
  }
}
