export const productType: { value: string; label: string }[] = [
  {
    value: 'CHEEZE_TEA',
    label: 'Cheeze Tea',
  },
  {
    value: 'MILK_TEA',
    label: 'Milk Tea',
  },
  {
    value: 'SERRADURA',
    label: 'Serradura',
  },
  {
    value: 'GREEN_TEA_AND_LEMONADE',
    label: 'Green Tea and Lemonade',
  },
];

export const mapProductType = (type: string) => {
  return productType.find((item) => item.value.match(type))?.label;
};
