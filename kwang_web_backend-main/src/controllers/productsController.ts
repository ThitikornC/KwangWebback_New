import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getProductService, getProductParamsForSearch, getProductByBrandAndCode, getProductById } from '../services/productsService';
const prisma = new PrismaClient();
// card data propuct
export const getAll = async (req: Request, res: Response) => {
  try {
    const allProducts = await getProductService();
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
// card data propuct
export const getAllProductsCCTV = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products_cctv.findMany({
      select: {
        Products_id: true,
        ProductBrand: true,
        ProductCode: true,
        price: true,
        type: true,
        image: true,
        DataSheetLink: true,
        Keyfeature: true,
        tag: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Create all product
export const createProduct = async (req: Request, res: Response) => {
  const {
    ProductBrand, ProductCode, type, price, salePercent, Keyfeature, DataSheetLink, Color, len, image, images, tag, dateSell, BTU,
    Size, MaximumPower, Pixel_Pitch, Port, Power
  } = req.body;
  const data: any = {
    ProductBrand,
    ProductCode,
    type,
    price,
    salePercent,
    Keyfeature,
    DataSheetLink,
    Color,
    image,
    images,
    tag,
    dateSell: new Date(dateSell), // Convert to Date object
  };
  switch (type) {
    case 'CCTV':
      data.len = len;
      break;
    case 'Accesscontrol':
      break;
    case 'Airsolarcell':
      data.BTU = BTU;
      break;
    case 'InterActive':
      data.Size = Size;
      break;
    case 'Inverter':
      data.MaximumPower = MaximumPower;
      break;
    case 'Ledwall':
      data.Pixel_Pitch = Pixel_Pitch;
      break;
    case 'Networkswitch':
    case 'Recorder':
      data.Port = Port;
      break;
    case 'Solarcell':
      data.Power = Power;
      break;
    default:
      return res.status(400).json({ error: 'Invalid product type' });
  }
  try {
    let newProduct;
    switch (type) {
      case 'CCTV':
        newProduct = await prisma.products_cctv.create({ data });
        break;
      case 'Accesscontrol':
        newProduct = await prisma.products_accesscontrol.create({ data });
        break;
      case 'Airsolarcell':
        newProduct = await prisma.products_airsolarcell.create({ data });
        break;
      case 'InterActive':
        newProduct = await prisma.products_interactive.create({ data });
        break;
      case 'Inverter':
        newProduct = await prisma.products_inverter.create({ data });
        break;
      case 'Ledwall':
        newProduct = await prisma.products_ledwall.create({ data });
        break;
      case 'Networkswitch':
        newProduct = await prisma.products_networkswitch.create({ data });
        break;
      case 'Recorder':
        newProduct = await prisma.products_recorder.create({ data });
        break;
      case 'Solarcell':
        newProduct = await prisma.products_solarcell.create({ data });
        break;
      default:
        return res.status(400).json({ error: 'Invalid product type' });
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Search all api
export const getDataForSearchAll = async (req: Request, res: Response) => {
  const { search } = req.params;
  try {
    const product = await getProductParamsForSearch(search);
    res.json(product);
  } catch (error) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message === 'Product Out Type' || error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      } else {
        errorMessage = error.message;
      }
    }
    console.error('Error fetching product:', error);
    res.status(500).json({ error: errorMessage });
  }
};
// Product For page one page
export const getDataOneProduct = async (req: Request, res: Response) => {
  const { type, brand, productCode } = req.params;
  try {
    const product = await getProductByBrandAndCode(type, brand, productCode);
    res.json(product);
  } catch (error) {
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      if (error.message === 'Product Out Type' || error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      } else {
        errorMessage = error.message;
      }
    }
    console.error('Error fetching product:', error);
    res.status(500).json({ error: errorMessage });
  }
};
// session cart get product id
export const getProductByUniqueID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


