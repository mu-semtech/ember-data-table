export default function attributeToSortParams(attribute) {
  const attr = attribute.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  return { asc: attr, desc: `-${attr}` };
}
