import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [isActiveButtonTurned, setActiveButton] = useState(true);
  useEffect(() => {
    axios
      .get("https://api.todoist.com/rest/v1/tasks", {
        headers: {
          Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
        },
      })
      .then((response) => {
        setItems(response.data);
      });
  }, [searchValue]);
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };
  const handleAddItem = () => {
    axios
      .post(
        "https://api.todoist.com/rest/v1/tasks",
        { content: itemToAdd },
        {
          headers: {
            Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
          },
        }
      )
      .then((response) => {
        setItems([...items, response.data]);
        setItemToAdd("");
      })
      .catch((err) => console.log(err));
  };

  const handleItemDelete = (item) => {
    console.log(item.id, item);
    axios
      .delete(`https://api.todoist.com/rest/v1/tasks${item.id}`, {
        headers: {
          Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
        },
      })
      .then((response) => {
        console.log(response);
        /*const deletedItem = response.data;
        const newItems = items.filter((item) => {
          return deletedItem.id !== item.id;
        });
        setItems(newItems);*/
      })
      .catch((err) => {console.log(err)});
  };
  const getCompletedItems = () => {
    axios
      .get("https://api.todoist.com/sync/v8/completed/get_all", {
        headers: {
          Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
        },
      })
      .then((response) => {
        setActiveButton(false);
        setItems(response.data.items);
      });
  };
  const getActiveItems = () => {
    axios
      .get("https://api.todoist.com/rest/v1/tasks", {
        headers: {
          Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
        },
      })
      .then((response) => {
        setActiveButton(true);
        setItems(response.data);
      });
  };
  const toggleItemDone = ({ id, done }) => {
    axios
      .post(
        `https://api.todoist.com/rest/v1/tasks/${id}/close`,
        { done: !done },
        {
          headers: {
            Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
          },
        }
      )
      .then((res) => {
        setItems(
          items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                done: !done,
              };
            }
            return item;
          })
        );
      });
  };
  const toggleItemReopen = (item) => {
    const { id, done } = item;
    axios
      .post(
        `https://api.todoist.com/rest/v1/tasks/${item.task_id}/reopen`,
        { done: !done },
        {
          headers: {
            Authorization: "Bearer f3369809dd943cbb49a938a221b0fb311a9af68c",
          },
        }
      )
      .then((res) => {
        setItems(
          items.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                done: !done,
              };
            }
            return item;
          })
        );
      })
      .catch((err) => console.log("Error goy brat"));
  };
  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>
      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>
      {/* Item-status-filter */}
      <div className="btn-group">
        <button
          onClick={getActiveItems}
          key="active"
          type="button"
          className={`btn btn${isActiveButtonTurned ? "" : "-outline"}-info`}
        >
          Active
        </button>

        <button
          onClick={getCompletedItems}
          key="done"
          type="button"
          className={`btn btn${!isActiveButtonTurned ? "" : "-outline"}-info`}
        >
          Completed
        </button>
      </div>
      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span
                className={`todo-list-item${
                  !isActiveButtonTurned || item.done ? " done" : ""
                }`}
              >
                <span
                  className="todo-list-item-label"
                  onClick={() => {
                    isActiveButtonTurned
                      ? toggleItemDone(item)
                      : toggleItemReopen(item);
                  }}
                >
                  {item.content}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>
      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
