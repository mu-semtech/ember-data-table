import { typeOf } from "@ember/utils";

import upperFirst from "lodash.upperfirst";

/**
 * Splits a string of definitions by space.
 */
export function splitDefinitions(string) {
  return (string || "")
    .split(" ")
    .filter((x) => x !== "");
}

/**
 * Splits a string of definitions by space, or returns the array directly.
 */
export function definitionsToArray(stringOrArray) {
  if(typeOf(stringOrArray) === "array") {
    return stringOrArray;
  } else {
    return splitDefinitions(stringOrArray);
  }
}

/**
 * Transforms __ to _ and _ to space.
 */
export function deUnderscoreString(string) {
  const arrString = [];

  // executing this with a regex turned out to be less clear
  let idx = 0;

  while( idx < string.length ) {
    let current = string[idx];
    let next = string[idx+1];

    if( current === "_" && next === "_") {
      arrString.push("_");
      idx = idx + 2;
    } else if( current === "_" ) {
      arrString.push(" ");
      idx = idx + 1;
    } else {
      arrString.push(current);
      idx = idx + 1;
    }
  }

  return arrString.join("");
}

/**
 * Unpacks the components of a series of name/label specifications split
 * by spaces (top-level) and : lower-level, including the unpacking of
 * _.
 *
 * configuration is an array of components to be recognized.  In case of
 * a simple string, the item is placed under that key in the returned
 * object and rawLabel is used to provide the unparsed value (without
 * clearing _).  An object may be supplied for further unpacking which
 * may contain a combination of the following key/values:
 * - `raw: "label"` : Store the unparsed value in `label`. Do not parse the value.
 * - `name: "label"`: store the parsed value in `label` and unparsed value in `rawLabel`.
 * - `default: "label"` : Use the previously stored value for label as the
 *   default value if no value was supplied or if an empty value was
 *   supplied. Must be used together with `raw` or `name`.
 *
 * Unspecified components will receive the value `null`.
 *
 * toComponentSpecifications( "number:Nr. location:Gemeente_en_straat land", [{raw: "attribute"},{name: "label", default: "attribute"}])
 * -> [{attribute:"number", label: "Nr.", rawLabel: "Nr."},{attribute:"location",label:"Gemeente en straat",rawLabel:"Gemeente_en_straat"},{attribute:"land",label:"land"}]
 */
export function toComponentSpecifications(spaceSeparatedSpecifications, configuration) {
  return definitionsToArray(spaceSeparatedSpecifications)
    .map( (specification) => toComponentSpecification(specification, configuration) );
}

/**
 * see toComponentSpecifications. This also handles objects with already unpacked specifications.
 */
export function toComponentSpecification(specification, configuration) {
  let obj = {};
  const component = (i, key, parser = (str) => str) => {
    if(typeOf(specification) === 'string') {
      const spec = specification.split(':')[i] || null;

      return spec && parser(spec)
    }else {
      return specification[key] || null;
    }
  }

  for (let i = 0; i < configuration.length; i++) {
    let spec = configuration[i];

    if (typeOf(spec) === 'string') {
      spec = { name: spec };
    }

    if (!spec.name && !spec.raw && !spec.default) {
      throw `Specification ${JSON.stringify(spec)} not understood`;
    }

    if (spec.raw) {
      obj[spec.raw] = component(i, spec.raw);
    }
    else if (spec.name) {
      obj[spec.name] = component(i, spec.name, deUnderscoreString);
      obj[`raw${upperFirst(spec.name)}`] = component(i, spec.name);
    }

    if (spec.default && spec.raw && !obj[spec.raw]) {
      obj[spec.raw] = obj[spec.default];
    }
    else if (spec.default && spec.name && !obj[spec.name]) {
      obj[spec.name] = obj[spec.default];
    }
  }

  return obj;
}
