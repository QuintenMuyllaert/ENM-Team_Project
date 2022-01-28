let dataElements = [];
const dataElement = class {
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    console.log(value);
    this.update();
  }
  constructor(element, initialData, override) {
    if (!element.dataElementLinked) {
      element.dataElementLinked = true;
    }
    dataElements.push(this);
    this.element = element;
    this.data = initialData;
    if (!override) {
      return;
    }
    const keys = Object.keys(override);
    for (const key of keys) {
      this[`_${key}`] = override[key];
    }
    if (!element.hasInit) {
      element.hasInit = true;
      this.init();
    }
    this.tick();
  }
  init() {
    if (!this.element) {
      return;
    }
    if (!this._init) {
      return;
    }
    return this._init();
  }
  render() {
    if (!this.element) {
      return;
    }
    if (!this._render) {
      return;
    }
    return this._render();
  }
  unrender() {
    if (!this.element) {
      return;
    }
    if (!this._unrender) {
      return;
    }
    return this._unrender();
  }
  update() {
    if (!this.element) {
      return;
    }
    if (!this._update) {
      return;
    }
    return this._update();
  }
  tick(data) {
    if (!this.element) {
      return;
    }
    const value = this.element.getAttribute("dataValue");
    if (!value) {
      console.error("No value");
      return;
    }

    let newData = this.data;
    try {
      newData = eval(value);
    } catch (e) {
      console.error("Something went wrong.");
    }
    if (newData == this.data) {
      return;
    }
    this.data = newData;
  }
};

const elementDefaultsText = {
  init: function () {
    //this.element = document.querySelector(this.query);
  },
  render: function () {
    this.element.textContent = this.data;
  },
  update: function () {
    this.element.textContent = this.data;
  },
};

const elementDefaultsInnerHTML = {
  init: function () {
    //this.element = document.querySelector(this.query);
  },
  render: function () {
    this.element.innerHTML = this.data;
  },
  update: function () {
    this.element.innerHTML = this.data;
  },
};

const elementDefaultsChart = {
  render: async function () {
    if (!this.element.graph) {
      return;
    }

    this.element.graph.data.datasets[0].data = [];
    this.element.graph.update();
    await delay(500);
    this.element.graph.data.datasets[0].data = this.data;
    this.element.graph.update();
  },
  update: function () {
    if (!this.element.graph) {
      return;
    }
    this.element.graph.data.datasets[0].data = this.data;
    this.element.graph.update();
  },
};
