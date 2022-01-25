let dataElements = [];
const dataElement = class {
  get data() {
    return this._data;
  }
  set data(value) {
    this._data = value;
    this.update();
  }
  constructor(query, initialData, override) {
    dataElements.push(this);
    this.query = query;
    this.data = initialData;
    if (!override) {
      return;
    }
    const keys = Object.keys(override);
    for (const key of keys) {
      this[key] = override[key];
    }
  }
  init() {}
  render() {}
  unrender() {}
  update() {}
  onInit(cb) {
    this.init = cb;
  }
  onRender(cb) {
    this.render = cb;
  }
  onUnRender(cb) {
    this.unrender = cb;
  }
  onUpdate(cb) {
    this.update = cb;
  }
  updateData(data) {
    this.data = data;
  }
};

const elementDefaultsText = {
  init: function () {
    this.element = document.querySelector(this.query);
  },
  render: function () {
    if (!this.element) {
      return;
    }
    this.element.textContent = this.data;
  },
  update: function () {
    if (!this.element) {
      return;
    }
    this.element.textContent = this.data;
  },
};

const elementDefaultsInnerHTML = {
  init: function () {
    this.element = document.querySelector(this.query);
  },
  render: function () {
    if (!this.element) {
      return;
    }
    this.element.innerHTML = this.data;
  },
  update: function () {
    if (!this.element) {
      return;
    }
    this.element.innerHTML = this.data;
  },
};

const elementDefaultsChart = {
  render: async function () {
    if (!this.element) {
      return;
    }
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
    if (!this.element) {
      return;
    }
    if (!this.element.graph) {
      return;
    }
    this.element.graph.data.datasets[0].data = this.data;
    this.element.graph.update();
  },
};
