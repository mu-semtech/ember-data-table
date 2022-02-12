import Component from '@glimmer/component';

function splitDefinitions(string) {
  return (string || "")
    .split(" ")
    .filter((x) => x !== "");
}

/**
 * Transforms __ to _ and _ to space.
 */
function deUnderscoreString(string) {
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

function convertDefinition(string) {
  const parts = string.split(":");
  return {
    route: parts[0],
    label: (parts[1] || null) && deUnderscoreString(parts[1]),
    icon: (parts[2] || null) && deUnderscoreString(parts[2]),
    rawLabel: parts[1] || null,
    rawIcon: parts[2] || null
  };
}


export default class DataTableContentComponent extends Component {
  get hasLinks() {
    return this.linkedRoutes.length > 0;
  }

  /**
   * Accepts and transforms definitions for linked routes.
   *
   * Implementations may transform this at will.  The default
   * transformation splits on `:` assuming the first part is the route
   * and the second part is the label.  If no label is given, it is
   * passed as null.  If a label is given, all underscores are
   * transformed to spaces and double underscores are left as a single
   * _.  We split again on a third `:`, transforming in the same way for
   * the suggested icon.
   *
   * Behaviour for `___` is undefined.
   *
   * Yields an array of objects to represent the linked routes.
   * [ { route: "products.show", label: "Show product", icon: "show-icon" } ]
   */
  get linkedRoutes() {
    return splitDefinitions(this.args.links || "")
      .map( convertDefinition );
  }
}

// exposed for testing
export { deUnderscoreString, splitDefinitions, convertDefinition };
