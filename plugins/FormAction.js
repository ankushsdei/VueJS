export const setCreating = path => {
  const items = getItems();
  if (items[path] === undefined) items[path] = "";
  items[path] = true;
  localStorage.setItem("form-add", JSON.stringify(items));
};

export const setCreated = path => {
  const items = getItems();
  if (items[path] === undefined) items[path] = "";
  items[path] = false;
  localStorage.setItem("form-add", JSON.stringify(items));
};

export const shouldLeave = path => {
  const items = getItems();
  console.log("items", items, path, typeof items[path]);
  if (items[path] !== undefined && items[path] === true) {
    if (confirm("are you sure you want to leave ?")) {
      items[path] = false;
      localStorage.setItem("form-add", JSON.stringify(items));
      return true;
    } else {
      return false;
    }
  }
  return true;
};

const getItems = () => {
  return localStorage.getItem("form-add") ? JSON.parse(localStorage.getItem("form-add")) : {};
};
