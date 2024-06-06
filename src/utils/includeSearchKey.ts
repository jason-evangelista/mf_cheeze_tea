const includeSearchKey = (searchKey: string) => {
  return {
    product: {
      name: {
        search: searchKey,
      },
    },
  };
};

export default includeSearchKey;
