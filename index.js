const input = document.querySelector("input");
const ul = document.querySelector(".todos");
const store = Redux.createStore(reducer);

function reducer(state = [], action) {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "delete":
      return [
        ...state.slice(0, action.index),
        ...state.slice(action.index + 1),
      ];
    case "isDone":
      state[action.index].isDone = !state[action.index].isDone;
      return state;
    default:
      return state;
  }
}

store.subscribe(() => {
  const todos = store.getState();
  createUI(todos);
});

function createUI(todos) {
  ul.innerHTML = todos
    .map((todo, index) => {
      return `<li class="flex justify-between items-center py-2 border-b">
        <div class="flex justify-between items-center space-x-4">
          <input class="checkbox" data-index=${index} type="checkbox" ${
        todo.isDone ? "checked" : ""
      } />
          <p>${todo.todo}</p>
        </div>
        <button data-index=${index} class="btn">❌</button>
      </li>`;
    })
    .join("");
}

input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && e.target.value !== "") {
    let todo = {
      todo: e.target.value,
      isDone: false,
    };
    store.dispatch({ type: "add", payload: todo });
    e.target.value = "";
  } else {
    let todos = store.getState();
    todos = todos.filter((todo) =>
      todo.todo.toLowerCase().includes(e.target.value.toLowerCase())
    );
    createUI(todos);
  }
});

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn")) {
    store.dispatch({ type: "delete", index: parseInt(e.target.dataset.index) });
  }

  if (e.target.classList.contains("checkbox")) {
    store.dispatch({ type: "isDone", index: parseInt(e.target.dataset.index) });
  }
});
