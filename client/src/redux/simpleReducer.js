export default (
    state = {
      result: "buffy",
      todos:[]
    },
    action
  ) => {
    switch (action.type) {
      case "SIMPLE_ACTION":
        return {
          ...state,
          result: state.result==="the slayer" ? "buffy" :"the slayer"
        };
      case "CHANGE_TODOS":
        return {
          ...state,
          todos: action.payload
        }
      default:
        return state;
    }
  };