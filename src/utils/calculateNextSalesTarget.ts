const calculateNextSalesTarget = (currentSales: number, prevSales: number) => {
  console.log({ currentSales, prevSales });
  const growthRate = (currentSales - prevSales) / prevSales;

  const salesNextTarget = currentSales + growthRate * currentSales;

  return salesNextTarget.toFixed(0) === 'Infinity'
    ? 0
    : +salesNextTarget.toFixed(0);
};

export default calculateNextSalesTarget;
