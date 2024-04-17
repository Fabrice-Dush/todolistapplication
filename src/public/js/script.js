const todosEl = document.querySelector(".todos");

todosEl.addEventListener("change", async function (event) {
  const path = location.href;
  const id = event.target.id;
  if (!id) return;
  event.target.parentElement
    .querySelector(".todos__text")
    .querySelector("span")
    .classList.toggle("completed");

  const res = await fetch(`/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted: true }),
  });
  const data = await res.json();
  location.assign(path);
});

// /todos/<%=todo.id%>?_method=PATCH
