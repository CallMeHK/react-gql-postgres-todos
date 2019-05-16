import React, { Component } from "react";
import { connect } from "react-redux";

import { simpleAction, getTodos } from "../redux/simpleAction";

const mapDispatchToProps = dispatch => ({
  simpleAction: () => dispatch(simpleAction()),
  getTodos: () => dispatch(getTodos())
});

const mapStateToProps = state => ({
  ...state
});

class App extends Component {
  state = {
    loading: true
  };
  simpleAction = event => {
    this.props.simpleAction();
  };

  componentDidMount() {
    this.props.getTodos().then(res => {
      this.setState({ loading: false });
    });
  }
  render() {
    if (!this.state.loading) {
      var todos = this.props.simpleReducer.todos.map(todo => {
        return (
          <div
            key={`todo__${todo.id}`}
            style={{ display: "flex", justifyContent: "space-between", width:"50%" }}
          >
            <div>{todo.id}</div>
            <div>{todo.todo}</div>
          </div>
        );
      });
    }
    return (
      <div>
        <div>Store test value: {this.props.simpleReducer.result}</div>
        <br />
        <div>
          <button onClick={this.simpleAction}>Test store</button>
        </div>
        <br />
        {!this.state.loading && <div>{todos}</div>}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
