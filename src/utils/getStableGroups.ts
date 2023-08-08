/**
 * Accesses a nested property of an object based on a path (e.g. `hierarchy.lvl0`)
 * @param obj Object to access.
 * @param path Path to the property.
 * @returns Value of the property.
 */
function getProperty(obj: any, path: string) {
    const parts = path.split('.');
    let value = obj;
  
    for (const part of parts) {
      value = value[part];
  
      if (value === undefined) {
        break;
      }
    }
  
    return value;
  }
  
  /**
   * Groups elements in a collection by a `property`, but keeps the original order of elements with the same value.
   * Also, the order of the groups is based on the first occurence of the value in the collection.
   * @param collection Collection to group.
   * @param property Property to group by. Can be a nested property, e.g. `hierarchy.lvl0`.
   * @returns Sorted collection.
   */
  export function getStableGroups(collection: any[], property: string) {
    const groups = new Map();
    const result = [];
  
    for (const item of collection) {
      const value = getProperty(item, property);
      const group = groups.get(value);
  
      if (group === undefined) {
        const newGroup = [item];
        groups.set(value, newGroup);
        result.push(newGroup);
      } else {
        group.push(item);
      }
    }
  
    return result;
  }