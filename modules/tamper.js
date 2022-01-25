module.exports = {
  type: (obj) => {
    if (Array.isArray(obj)) {
      return "array";
    } else if (typeof obj == "string") {
      return "string";
    } else if (typeof obj == "object") {
      return "object";
    } else if (typeof obj == "function") {
      return "function";
    } else if (typeof obj == "boolean") {
      return "boolean";
    } else if (obj == null) {
      return "null";
    } else if (obj == undefined) {
      return "undefined";
    } else if (isNaN(obj)) {
      return "nan";
    } else if (typeof obj == "number") {
      return "number";
    }
  },
  structure: (template, input) => {
    if (!module.exports.type(template)) {
      return false;
    }
    if (module.exports.type(template) == "object" || module.exports.type(template) == "array") {
      const type = module.exports.type(template);

      let keys = [];
      if (type == "object") {
        keys = Object.keys(template);
      } else if (type == "array") {
        for (let i in template) {
          keys.push(i);
        }
      }

      for (let i of keys) {
        const equals = module.exports.structure(template[i], input[i]);
        if (!equals) {
          return false;
        }
      }
    }
    return true;
  },
};
