import React from 'react'
import { connect } from 'react-redux'
import { getAllLanguagesThunk } from '../store/language/actions'

const Home = ({ langs }) => {
  return (
    <div>
      23
      <button type="button" onClick={() => langs()}>
        click
      </button>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    langs: () => dispatch(getAllLanguagesThunk())
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Home)
