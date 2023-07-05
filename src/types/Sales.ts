export type GraphDataAttr = {
  actual_sales: number;
  label: string;
};

export type SalesMonth = {
  Jan: GraphDataAttr;
  Feb: GraphDataAttr;
  Mar: GraphDataAttr;
  Apr: GraphDataAttr;
  May: GraphDataAttr;
  June: GraphDataAttr;
  July: GraphDataAttr;
  Aug: GraphDataAttr;
  Sep: GraphDataAttr;
  Oct: GraphDataAttr;
  Nov: GraphDataAttr;
  Dev: GraphDataAttr;
};

export type SalesYear = {
  [key: string]: GraphDataAttr;
};
