import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

(async () => {
  await prisma.product.createMany({
    data: [
      {
        name: 'Green Tea Cheeze',
        large_size_amount: 100,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Cocoa Cheeze',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Matcha Cheeze',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Taro Cheeze Tea',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'House Blend Milk Tea',
        large_size_amount: 80,
        regular_size_amount: 70,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: 'Okiniwa Milk Tea',
        large_size_amount: 85,
        regular_size_amount: 75,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: 'Green Tea',
        large_size_amount: 75,
        regular_size_amount: 60,
        fixed_amount: 0,
        type: 'GREEN_TEA_AND_LEMONADE',
      },
      {
        name: 'Lemonade Yakult',
        large_size_amount: 85,
        regular_size_amount: 75,
        fixed_amount: 0,
        type: 'GREEN_TEA_AND_LEMONADE',
      },
      {
        name: 'Winter Melon Serradura',
        large_size_amount: 0,
        regular_size_amount: 0,
        fixed_amount: 100,
        type: 'SERRADURA',
      },
      {
        name: 'Mango Serradura',
        large_size_amount: 0,
        regular_size_amount: 0,
        fixed_amount: 129,
        type: 'SERRADURA',
      },
      {
        name: 'Almond Milk Tea',
        large_size_amount: 90,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: 'Taro Milk Tea',
        large_size_amount: 85,
        regular_size_amount: 75,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: 'Hokkaido Serradura',
        large_size_amount: 0,
        regular_size_amount: 0,
        fixed_amount: 100,
        type: 'SERRADURA',
      },
      {
        name: 'Super Macee Float',
        large_size_amount: 100,
        regular_size_amount: 90,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'House Blend Milk',
        large_size_amount: 80,
        regular_size_amount: 70,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Almond Cheeze Tea',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Okiniwa Cheeze Tea',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
      {
        name: 'Oreo Milk Tea',
        large_size_amount: 95,
        regular_size_amount: 85,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: "2 P'S (Milk Tea w/ Pearl)",
        large_size_amount: 90,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'MILK_TEA',
      },
      {
        name: 'Lemon Yakult Tea',
        large_size_amount: 90,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'GREEN_TEA_AND_LEMONADE',
      },
      {
        name: 'Lemonade Calamsi Tea',
        large_size_amount: 90,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'GREEN_TEA_AND_LEMONADE',
      },
      {
        name: 'Serradura',
        large_size_amount: 0,
        regular_size_amount: 0,
        fixed_amount: 95,
        type: 'SERRADURA',
      },
      {
        name: 'Matcha Serradura',
        large_size_amount: 0,
        regular_size_amount: 0,
        fixed_amount: 105,
        type: 'SERRADURA',
      },
      {
        name: 'Honey Lemon Dew',
        large_size_amount: 90,
        regular_size_amount: 80,
        fixed_amount: 0,
        type: 'CHEEZE_TEA',
      },
    ],
  });

  await prisma.productCategory.createMany({
    data: [
      {
        name: 'Cheeze Tea',
        code: 'CHEEZE_TEA',
      },
      {
        name: 'Milk Tea',
        code: 'MILK_TEA',
      },
      {
        name: 'Green Tea and Lemonade',
        code: 'GREEN_TEA_AND_LEMONADE',
      },
      {
        name: 'Serradura',
        code: 'SERRADURA',
      },
    ],
  });
})();
