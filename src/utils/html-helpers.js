/**
 * Parse element attributes from string to object
 * @param {string} elementAttrs
 * @param {Array} [approvedAttrs=undefined]
 * @returns {Object}
 */
function parseElementAttrs(elementAttrs, approvedAttrs) {
  let pattern = new RegExp(/([\S]+)=[\'\"]([^\'\"]+)[\'\"]/g);
  let attrs = {};
  let result;

  while (result = pattern.exec(elementAttrs)) {
    let [, attrName, attrValue] = result;
    if (!approvedAttrs || approvedAttrs.indexOf(attrName) !== -1) {
      attrs[attrName] = attrValue;
    }
  }

  return (attrs);
}

/**
 * Get elements body by class name in given html
 * @param {string} html
 * @param {string} className
 * @param {string} tagName
 * @returns {Array}
 */
function getElementsBodyByClassName(html, className, tagName = '.*?') {
  let pattern = new RegExp(`<${tagName}.*?class=.*?${className}.*?>(.*)<\/${tagName}>`, 'g');
  let bodies = [];
  let result;

  while (result = pattern.exec(html)) {
    let [, body] = result;
    bodies.push(body);
  }

  return bodies;
}

/**
 * Get forms in given html
 * @param {string} html
 * @returns {Array} Return a list of objects with form attributes and body
 */
function getForms(html) {
  let pattern = new RegExp(/<form([^>]+)>([\s\S]*?)<\/form>/g);
  let forms = [];
  let result;

  while (result = pattern.exec(html)) {
    let [, attrs, body] = result;
    forms.push({ attrs, body });
  }

  return forms;
}

/**
 * @param {string} html
 * @returns {Object}
 */
function getFormFields(html) {
  let pattern = /<input ([^>]+)>/g;
  let fields = {};
  let result;

  while (result = pattern.exec(html)) {
    let [, attrs] = result;
    attrs = parseElementAttrs(attrs, ['name', 'value']) || {};
    fields[attrs['name']] = attrs['value'];
  }

  return fields;
}

/**
 * Complex method to get form body and attributes from given html
 * @param {string} html
 * @returns {Promise<Object>}
 */
function extractAuthForm(html) {
  return new Promise(resolve => {
    let forms = getForms(html);
    let attrs = parseElementAttrs(forms[0].attrs);
    let fields = getFormFields(forms[0].body);
    return resolve({ fields, attrs });
  })
}

module.exports = {
  parseElementAttrs,
  getElementsBodyByClassName,
  getForms,
  getFormFields,
  extractAuthForm
};
