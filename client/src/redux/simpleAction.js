import { request } from "graphql-request";

const url = `http://localhost:3000/graphql`;

const simpleAction = () => dispatch => {
  dispatch({
    type: "SIMPLE_ACTION",
    payload: "result_of_simple_action"
  });
};

const getTodos = () => dispatch => {
  const query = `{
      todos {
        id
        todo
        done
      }
    }`;
  return request(url, query).then(res => {
    console.log(res);
    dispatch({
      type: "CHANGE_TODOS",
      payload: res.todos
    });
  });
};

// const increaseCount = () => dispatch => {
//   dispatch({
//     type:"INCREASE_COUNT",
//   })
// }

// const updateForm = (form) => dispatch => {
//   dispatch({
//     type:"UPDATE_FORM",
//     payload:form
//   })
// }

export { simpleAction, getTodos };
