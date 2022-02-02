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

const sumKey = (data, key, deci = false) => {
  let sum = 0;
  for (const dat of data) {
    sum += dat[key];
  }
  return deci === false ? sum : sum.toFixed(deci);
};

const avgKey = (data, key, deci = false) => {
  const sum = sumKey(data, key);
  const len = data.length;
  const avg = sum / len;
  return deci === false ? avg : avg.toFixed(deci);
};

const kN = (number) => {
  return number / 1000;
};

const k = (number) => {
  return kN(number).toFixed(2);
};

const kW = (number) => {
  return k(number) + " kW";
};

const kWh = (number) => {
  return kW(number) + "/h";
};

const sum = (data) => {
  let s = 0;
  for (const d of data) {
    s += d;
  }
  return s;
};

const gem = (data) => {
  const s = sum(data);
  const l = data.length;
  return s / l;
};

const rngPair = (data) => {
  const k = Object.keys(data);
  const l = k.length;
  const r = Math.round(Math.random() * (l - 1));
  return {
    key: k[r],
    value: data[k[r]],
  };
};

const compare = (num, times = 0) => {
  if (comparisons.length == 0) {
    return `1 ding`;
  }
  const pair = rngPair(comparisons);
  const amt = Math.round(num / 1000 / pair.value);
  if (times >= 10) {
    return `${amt} ${pair.key}`;
  }
  if (amt == 0) {
    return compare(num, times + 1);
  }
  return `${amt} ${pair.key}`;
};

const swap = (array, index, index2) => {
  if (index >= 0 && index < array.length && index2 >= 0 && index2 < array.length) {
    const a = array[index];
    array[index] = array[index2];
    array[index2] = a;
  }

  return array;
};
