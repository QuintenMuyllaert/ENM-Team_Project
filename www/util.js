const delay = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const fetchString = async (url) => {
  const data = await fetch(url);
  return await data.text();
};

const fetchJSON = async (url) => {
  const data = await fetch(url);
  return await data.json();
};

const fetchTxt = async (url) => {
  const data = await fetchString(url);
  return data.split("\n");
};

const lookupList = (list, includes) => {
  const results = [];
  list = Object.keys(list);
  for (const item of list) {
    if (item.includes(includes)) {
      results.push(item);
    }
  }
  return results;
};

const addClassRemoveAfter = (element, className, time) => {
  element.classList.add(className);
  setTimeout(() => {
    element.classList.remove(className);
  }, time);
};

const removeClassAddAfter = (element, className, time) => {
  element.classList.remove(className);
  setTimeout(() => {
    element.classList.add(className);
  }, time);
};

const triggerClass = async (element, className) => {
  element.classList.remove(className);
  await delay(10);
  element.classList.add(className);
};
