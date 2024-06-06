import { SalesTargetBody } from '@/types/SalesTarget';
import { prismaClient } from '@/utils/prismaClient';
import { NextApiRequest, NextApiResponse } from 'next';

const salesTargetApi = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const body = req.body as Partial<SalesTargetBody>;

    if (req.method === 'POST' && body.type === 'Month') {
      const upsertMonthSalesTarget = await prismaClient.salesTarget.upsert({
        where: {
          month_year: {
            month: body?.month ?? '',
            year: body?.year ?? 0,
          },
        },
        create: {
          target: body?.sales_target ?? 0,
          type: 'MONTH',
          month: body?.month ?? '',
          year: body?.year ?? 0,
        },
        update: {
          target: body?.sales_target ?? 0,
        },
      });

      if (upsertMonthSalesTarget)
        return res
          .status(200)
          .json({ message: 'Successfully Added/Update Month Sales Target' });
    }

    if (req.method === 'POST' && body.type === 'Year') {
      const findSalesTargetYear = await prismaClient.salesTarget.findFirst({
        where: {
          type: 'YEAR',
          AND: {
            year: body?.year,
          },
        },
      });

      const upsertMonthSalesTarget = await prismaClient.salesTarget.upsert({
        where: {
          id: findSalesTargetYear?.id,
          month_year: {
            month: '',
            year: findSalesTargetYear?.year || body?.year!,
          },
        },
        create: {
          target: body?.sales_target ?? 0,
          type: 'YEAR',
          year: body?.year ?? 0,
        },
        update: {
          target: body?.sales_target ?? 0,
        },
      });

      if (upsertMonthSalesTarget)
        return res
          .status(200)
          .json({ message: 'Successfully Added/Update Year Sales Target' });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(400)
      .json({ message: 'Something went wrong please try again' });
  }
};

export default salesTargetApi;
