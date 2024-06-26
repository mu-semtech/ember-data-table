import { upperFirst } from "lodash";

/**
 * Splits a string of defitinions by space.
 */
export function splitDefinitions(string) {
  return (string || "")
    .split(" ")
    .filter((x) => x !== "");
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
 * may contain the following key/values:
 *
 * - raw: label : Store the raw value as label, do not process further.
 * - default: label : Use the previously parsed value for label as the *
 *   default value if no value was supplied or if an empty value was
 *   supplied, must also supply name as key.
 *
 * toComponentSpecifications( "number:Nr. location:Gemeente_en_straat land", [{raw: "attribute"},{name: "label", default: "attribute"}])
 * -> [{attribute:"number", label: "Nr."},{attribute:"location",label:"Gemeente en straat",rawLabel:"Gemeente_en_straat"},{attribute:"land",label:"land"}]
 */
export function toComponentSpecifications(string, configuration) {
  return splitDefinitions(string)
    .map( (specification) => {
      let obj = {};
      let components = specification.split(":");
      for ( let i = 0; i < configuration.length; i++ ) {
        const spec = configuration[i];
        const component = components[i];
        if ( typeof spec === "string" ) {
          obj[`raw${upperFirst(spec)}`] = component;
          obj[spec] = deUnderscoreString(component || "");
        } else {
          // object specification
          if (spec.raw) {
            obj[spec.raw] = component;
          }
          if (spec.name) {
            if (spec.default && !component) {
              obj[spec.name] = obj[spec.default];
            } else {
              obj[`raw${upperFirst(spec.name)}`] = component;
              obj[spec.name] = deUnderscoreString(component || "");
            }
          }
          if (!spec.raw && !spec.default) {
            throw `Specification ${JSON.stringify(spec)} not understood`;
          }
        }
      }
      return obj;
    } );
}
