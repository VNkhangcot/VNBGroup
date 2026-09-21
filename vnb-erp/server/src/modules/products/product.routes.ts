import { Router, Request, Response } from 'express';
import { ProductModel } from './product.model.js';
import { isDbConnected } from '../../config/db.js';
import { memoryStore, ProductRecord } from '../../config/memoryStore.js';

const router = Router();

// GET /api/products - List products with optional search query & category
router.get('/', async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string || '').toLowerCase().trim();
    const category = req.query.category as string;

    if (isDbConnected) {
      const filter: any = { isActive: true };
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { barcode: { $regex: search, $options: 'i' } },
        ];
      }
      const products = await ProductModel.find(filter).sort({ createdAt: -1 });
      return res.json({ success: true, data: products });
    }

    // Memory store fallback
    let filtered = memoryStore.products.filter((p) => p.isActive);
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(search) || p.barcode.includes(search)
      );
    }

    return res.json({ success: true, data: filtered });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/barcode/:barcode - Fast barcode scanner lookup
router.get('/barcode/:barcode', async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;

    if (isDbConnected) {
      const product = await ProductModel.findOne({ barcode, isActive: true });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với mã vạch này' });
      }
      return res.json({ success: true, data: product });
    }

    const product = memoryStore.products.find((p) => p.barcode === barcode && p.isActive);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm với mã vạch này' });
    }
    return res.json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products - Create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      barcode,
      category,
      unit,
      costPrice,
      sellingPrice,
      wholesalePrice,
      stock,
      minStockAlert,
      quickSaleHotKey,
      imageUrl,
    } = req.body;

    if (!name || !barcode) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập tên và mã vạch' });
    }

    if (isDbConnected) {
      const existing = await ProductModel.findOne({ barcode });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Mã vạch này đã tồn tại trong hệ thống' });
      }
      const newProduct = await ProductModel.create({
        name,
        barcode,
        category: category || 'Hàng tạp hóa',
        unit: unit || 'Cái',
        costPrice: Number(costPrice) || 0,
        sellingPrice: Number(sellingPrice) || 0,
        wholesalePrice: Number(wholesalePrice) || 0,
        stock: Number(stock) || 0,
        minStockAlert: Number(minStockAlert) || 5,
        quickSaleHotKey,
        imageUrl,
      });
      return res.status(201).json({ success: true, data: newProduct });
    }

    // Memory fallback
    const newProduct: ProductRecord = {
      _id: `prod_${Date.now()}`,
      name,
      barcode,
      category: category || 'Hàng tạp hóa',
      unit: unit || 'Cái',
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      wholesalePrice: Number(wholesalePrice) || 0,
      stock: Number(stock) || 0,
      minStockAlert: Number(minStockAlert) || 5,
      quickSaleHotKey,
      imageUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    memoryStore.products.unshift(newProduct);

    return res.status(201).json({ success: true, data: newProduct });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      const updated = await ProductModel.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
      }
      return res.json({ success: true, data: updated });
    }

    const index = memoryStore.products.findIndex((p) => p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    memoryStore.products[index] = { ...memoryStore.products[index], ...req.body };
    return res.json({ success: true, data: memoryStore.products[index] });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id - Soft delete product
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (isDbConnected) {
      await ProductModel.findByIdAndUpdate(id, { isActive: false });
      return res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
    }

    const index = memoryStore.products.findIndex((p) => p._id === id);
    if (index !== -1) {
      memoryStore.products[index].isActive = false;
    }
    return res.json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
