import { mapProductType } from '@/constants/productType';
import { Box, Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrderSnapshot } from '@prisma/client';
import {
  Document,
  Font,
  Line,
  Image as PDFImage,
  Text as PDFText,
  PDFViewer,
  Page,
  StyleSheet,
  Svg,
  View,
} from '@react-pdf/renderer';
import { IconReceipt } from '@tabler/icons-react';
import { format } from 'date-fns';
import { OrderCart } from '../CreateOrderPage/CreateOrderContextProvider';

type OrderSnapShotReceiptProps = {
  orderSnapShot: OrderSnapshot;
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 600,
    fontSize: 14,
    paddingTop: 5,
    paddingHorizontal: 20,
  },
  body: {
    paddingHorizontal: 20,
  },

  headerLogo: {
    width: 70,
    height: 70,
    padding: 0,
    margin: 0,
  },
  groupRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  textBold: {
    fontWeight: 700,
  },
  textSmall: {
    fontSize: 11,
    fontFamily: 'Poppins',
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 18,
  },
  textCenter: {
    textAlign: 'center',
  },
  firstDetailsSection: {
    rowGap: 5,
  },
  itemListContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Courier',
    marginVertical: 6,
  },
  itemBox: {
    width: '70%',
  },
  itemTxtSmall: {
    fontSize: 11,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const OrderSnapShotReceipt = ({ orderSnapShot }: OrderSnapShotReceiptProps) => {
  const [opened, { close, open }] = useDisclosure();

  Font.register({
    family: 'Poppins',
    fonts: [
      {
        src: '/Poppins-Light.ttf',
      },
      {
        src: '/Poppins-Bold.ttf',
        fontWeight: 'bold',
      },
    ],
  });

  const parseOrderSnapshot = JSON.parse(
    orderSnapShot?.snapshot_record
  ) as OrderCart[];

  const parsePrice = (price: number) =>
    new Intl.NumberFormat('fil-PH', {
      style: 'currency',
      currency: 'PHP',
    })
      .format(price)
      .toString()
      .replace('₱', 'PHP ');

  const renderGroupRow = (label: string, value: string) => (
    <View style={styles.groupRow}>
      <PDFText style={{ ...styles.textSmall }}>{label}:&nbsp;</PDFText>
      <PDFText style={{ ...styles.textSmall, ...styles.textBold }}>
        {value}
      </PDFText>
    </View>
  );

  const renderOrderedItem = () => {
    return (
      <View style={{ width: '100%' }}>
        <View style={styles.itemListContainer}>
          <View style={{ width: '50%' }}>
            <PDFText style={styles.itemTxtSmall}>Prod. img</PDFText>
          </View>
          <View style={styles.itemBox}>
            <PDFText style={styles.itemTxtSmall}>Prod. name</PDFText>
          </View>
          <View style={styles.itemBox}>
            <PDFText style={{ ...styles.itemTxtSmall, marginLeft: 10 }}>
              Prod. type
            </PDFText>
          </View>
          <View
            style={{ ...styles.itemBox, marginLeft: 10, textAlign: 'right' }}
          >
            <PDFText style={styles.itemTxtSmall}>Prod. qty/Base amount</PDFText>
          </View>
        </View>
        {parseOrderSnapshot.map((item, idx) => {
          const regularSizeCount = `${item?.regularSizeQuantity} Regular`;
          const largeSizeCount = `${item?.largeSizeQuantity} Large`;
          const fixedSizeCount = `${item?.fixedPriceQuantity} Standard`;

          return (
            <View style={styles.itemListContainer} key={idx}>
              <View style={{ width: '50%' }}>
                <PDFImage
                  style={{ width: 50, height: 50, objectFit: 'contain' }}
                  src={
                    item.orderProduct.photo?.toString() ||
                    'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png'
                  }
                />
              </View>
              <View style={styles.itemBox}>
                <PDFText style={{ ...styles.itemTxtSmall }}>
                  {item.orderProduct.name}
                </PDFText>
              </View>
              <View style={styles.itemBox}>
                <PDFText style={{ ...styles.itemTxtSmall, marginLeft: 10 }}>
                  {mapProductType(item.orderProduct.type)}
                </PDFText>
              </View>
              <View
                style={{
                  ...styles.itemBox,
                  marginLeft: 10,
                  textAlign: 'right',
                }}
              >
                {item.regularSizeQuantity && (
                  <PDFText style={styles.itemTxtSmall}>
                    {regularSizeCount}(
                    {parsePrice(item.orderProduct.regular_size_amount ?? 0)})
                  </PDFText>
                )}
                {item.largeSizeQuantity && (
                  <PDFText style={styles.itemTxtSmall}>
                    {largeSizeCount}(
                    {parsePrice(item.orderProduct.large_size_amount ?? 0)})
                  </PDFText>
                )}
                {item.fixedPriceQuantity && (
                  <PDFText style={styles.itemTxtSmall}>
                    {fixedSizeCount}(
                    {parsePrice(item.orderProduct.fixed_amount ?? 0)})
                  </PDFText>
                )}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Box
        w="100%"
        pos="sticky"
        bottom={0}
        right={0}
        left={0}
        p="sm"
        className="mt-auto bg-white z-10"
      >
        <Button fullWidth leftIcon={<IconReceipt />} onClick={open}>
          See Receipt
        </Button>
      </Box>
      <Modal
        size={900}
        opened={opened}
        onClose={close}
        fullScreen
        zIndex={999}
        title={
          <Text size="xl" weight={600}>
            Official Receipt
          </Text>
        }
        classNames={{
          content: '!h-[100vh]',
        }}
      >
        <PDFViewer height={800} width="100%" showToolbar>
          <Document
            title={`OR-MFCHEEZE-TEA-${
              orderSnapShot.customer_name || orderSnapShot.id
            }-${new Date(orderSnapShot.order_date).toLocaleDateString()}`}
            author="MF Cheeze Tea"
          >
            <Page size="A4" style={styles.page}>
              <View style={styles.headerContainer}>
                <PDFImage src="/logo.png" style={styles.headerLogo} />
                <PDFText
                  style={{
                    ...styles.textBold,
                    ...styles.textLg,
                    fontFamily: 'Poppins',
                  }}
                >
                  Official Receipt
                </PDFText>
              </View>
              <View style={styles.body}>
                <Svg height="5" width="100%" style={{ paddingBottom: 15 }}>
                  <Line
                    x1="0"
                    y1="5"
                    x2="100000"
                    y2="5"
                    strokeWidth={1}
                    stroke="rgb(0,0,0)"
                  />
                </Svg>
                <View style={styles.firstDetailsSection}>
                  <PDFText
                    style={{
                      ...styles.textMd,
                      ...styles.textBold,
                      fontFamily: 'Poppins',
                    }}
                  >
                    Invoice Details
                  </PDFText>
                  {renderGroupRow(
                    'Order Date',
                    format(
                      new Date(orderSnapShot.order_date),
                      'MMMM dd, yyyy hh:mm:ss aa'
                    )
                  )}
                  {renderGroupRow('Order Id/No', orderSnapShot.id)}
                  {renderGroupRow(
                    'Bill To',
                    orderSnapShot.customer_name || '-----'
                  )}
                  {renderGroupRow(
                    'Total Amount',
                    parsePrice(orderSnapShot.total_amount)
                  )}
                  {renderGroupRow(
                    'Cash/Bill',
                    parsePrice(orderSnapShot.payment)
                  )}
                  {renderGroupRow('Change', parsePrice(orderSnapShot.change))}
                  <Svg height="5" width="100%" style={{ paddingBottom: 15 }}>
                    <Line
                      x1="0"
                      y1="5"
                      x2="100000"
                      y2="5"
                      strokeWidth={1}
                      stroke="rgb(0,0,0)"
                    />
                  </Svg>
                  <PDFText
                    style={{
                      ...styles.textMd,
                      ...styles.textBold,
                      fontFamily: 'Poppins',
                    }}
                  >
                    Ordered Items
                  </PDFText>
                  {renderOrderedItem()}
                  <Svg height="5" width="100%" style={{ paddingBottom: 15 }}>
                    <Line
                      x1="0"
                      y1="5"
                      x2="100000"
                      y2="5"
                      strokeWidth={1}
                      stroke="rgb(0,0,0)"
                    />
                  </Svg>
                  <View style={styles.center}>
                    <PDFImage
                      src="/logo.png"
                      style={{ width: 90, height: 90 }}
                    />
                    <PDFText
                      style={{
                        ...styles.textSmall,
                        fontFamily: 'Poppins',
                      }}
                    >
                      Thank you, come again
                    </PDFText>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </Modal>
    </>
  );
};

export default OrderSnapShotReceipt;
