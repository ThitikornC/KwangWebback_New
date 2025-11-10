import { PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

// Service functions
export const getAllProductsCCTV = async () => {
  return await prisma.products_cctv.findMany();
};

export const createProduct = async (data: any) => {
  return await prisma.products_cctv.create({
    data,
  });
};

export const updateProduct = async (productId: string, data: any) => {
  return await prisma.products_cctv.update({
    where: {
      Products_id: productId,
    },
    data,
  });
};

export const deleteProduct = async (productId: string) => {
  return await prisma.products_cctv.delete({
    where: {
      Products_id: productId,
    },
  });
};


// get all
export const getProductService = async () => {
  try {
    const payload = {
      Products_id: true,
      ProductBrand: true,
      ProductCode: true,
      price: true,
      type: true,
      image: true,
      Color:true,
      // len:true,
      images: true,
      DataSheetLink: true,
      Keyfeature: true,
      tag: true,
      dateSell: true,
    };
    const products_solarcell = await prisma.products_solarcell.findMany({ select: payload });
    const products_cctv = await prisma.products_cctv.findMany({ select: payload });
    const products_recorder = await prisma.products_recorder.findMany({ select: payload });
    const products_networkswitch = await prisma.products_networkswitch.findMany({ select: payload });
    const products_ledwall = await prisma.products_ledwall.findMany({ select: payload });
    const products_inverter = await prisma.products_inverter.findMany({ select: payload });
    const products_interactive = await prisma.products_interactive.findMany({ select: payload });
    const products_airsolarcell = await prisma.products_airsolarcell.findMany({ select: payload });
    const products_accesscontrol = await prisma.products_accesscontrol.findMany({ select: payload });
    const allProducts = [
      ...products_solarcell,
      ...products_cctv,
      ...products_recorder,
      ...products_networkswitch,
      ...products_ledwall,
      ...products_inverter,
      ...products_interactive,
      ...products_airsolarcell,
      ...products_accesscontrol,
    ];
    // 
  
    // Map dateSell to Date object and sort by dateSell in descending order
    const sortedProducts = allProducts
      .map((product) => ({
        ...product,
        dateSell: product.dateSell ? new Date(product.dateSell) : null,
      }))
      .sort((a, b) => {
        const dateA = a.dateSell ? a.dateSell.getTime() : 0;
        const dateB = b.dateSell ? b.dateSell.getTime() : 0;
        return dateB - dateA;
      });

    return sortedProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Internal server error');
  }
};

// สำหรับสร้างข้อมูลใหม่


// สำหรับการค้นหาสินค้า
type CollectionTypeForSearch = {
  findMany: (args: {
    select: {
      Products_id: boolean;
      ProductBrand: boolean;
      ProductCode: boolean;
      type: boolean;
      image: boolean;
    };
    where: {
      OR: [
        { ProductBrand: { contains: string, mode: 'insensitive' } },
        { ProductCode: { contains: string, mode: 'insensitive' } },
      ],
    },
  }) => Promise<any[]>;
};

export const getProductParamsForSearch = async (search: string) => {
  const collections: CollectionTypeForSearch[] = [
    prisma.products_accesscontrol,
    prisma.products_airsolarcell,
    prisma.products_cctv,
    prisma.products_interactive,
    prisma.products_inverter,
    prisma.products_ledwall,
    prisma.products_networkswitch,
    prisma.products_recorder,
    prisma.products_solarcell,
  ];

  try {
    const promises = collections.map(collection =>
      collection.findMany({
        select: {
          Products_id: true,
          ProductBrand: true,
          ProductCode: true,
          type: true,
          image: true
        },
        where: {
          OR: [
            { ProductBrand: { contains: search, mode: 'insensitive' } },
            { ProductCode: { contains: search, mode: 'insensitive' } },
          ],
        },
      })
    );

    const results = await Promise.all(promises);
    const allProducts = results.flat();
    return allProducts.length > 0 ? allProducts : []; // Return an empty array if no products are found
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};




// Service Product on Page function Data
const modelMapping: { [key: string]: any } = {
  Solarcell: prisma.products_solarcell,
  Recorder: prisma.products_recorder,
  Networkswitch: prisma.products_networkswitch,
  Ledwall: prisma.products_ledwall,
  Inverter: prisma.products_inverter,
  InterActive: prisma.products_interactive,
  CCTV: prisma.products_cctv,
  Airsolarcell: prisma.products_airsolarcell,
  Accesscontrol: prisma.products_accesscontrol,
};

export const getProductByBrandAndCode = async (type: string, brand: string, productCode: string) => {
  const model = modelMapping[type];

  if (!model) {
    throw new Error('Product Out Type');
  }

  const product = await model.findFirst({
    where: {
      ProductBrand: brand,
      ProductCode: productCode,
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};


// Service สำหรับดึงข้อมูล product ผ่าน id ไว้ดึงข้อมูลสินค้า
type CollectionType = {
  findUnique: (args: { where: { Products_id: string } }) => Promise<any>;
};

export const getProductById = async (productId: string) => {
  const collections: CollectionType[] = [
    prisma.products_accesscontrol,
    prisma.products_airsolarcell,
    prisma.products_cctv,
    prisma.products_interactive,
    prisma.products_inverter,
    prisma.products_ledwall,
    prisma.products_networkswitch,
    prisma.products_recorder,
    prisma.products_solarcell,
  ];
  for (const collection of collections) {
    const product = await collection.findUnique({
      where: { Products_id: productId },
    });
    if (product) {
      return product;
    }
  }
  return null; // Return null if no product is found
};