'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  status: string;
  isFeatured: boolean;
  isActive: boolean;
  category?: { id: number; name: string };
  series?: { id: number; name: string };
  manufacturer?: { id: number; name: string };
  images: { id: number; imageUrl: string }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: 1,
    price: '',
    originalPrice: '',
    stockQuantity: '10',
    scale: '1/7',
    material: 'PVC, ABS',
    status: 'IN_STOCK',
    isFeatured: false,
    imageUrl: '',
    description: '',
  });

  const loadCategories = async () => {
    try {
      const res = await api.get('/catalog/categories');
      setCategories(res.data.data || []);
      if (res.data.data?.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: res.data.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;

      const res = await api.get('/admin/products', { params });
      setProducts(res.data.data.products || []);
      setTotalPages(res.data.data.pagination.totalPages || 1);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      await api.post('/admin/products', {
        name: formData.name,
        sku: formData.sku,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        scale: formData.scale,
        material: formData.material,
        status: formData.status,
        isFeatured: formData.isFeatured,
        description: formData.description,
        imageUrls: formData.imageUrl ? [formData.imageUrl] : [],
      });

      setFormSuccess('Thêm sản phẩm mới thành công!');
      setTimeout(() => {
        setShowModal(false);
        setFormSuccess('');
        setFormData({
          name: '',
          sku: '',
          categoryId: categories[0]?.id || 1,
          price: '',
          originalPrice: '',
          stockQuantity: '10',
          scale: '1/7',
          material: 'PVC, ABS',
          status: 'IN_STOCK',
          isFeatured: false,
          imageUrl: '',
          description: '',
        });
        loadProducts();
      }, 1000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setFormError(error.response?.data?.message || 'Không thể thêm sản phẩm');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      loadProducts();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || 'Xóa sản phẩm thất bại');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-red-500" />
            Quản Lý Sản Phẩm
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Danh sách tất cả Figure, Manga, Standee, Gunpla và Thời trang
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm mới
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Sản phẩm</th>
                <th className="py-3.5 px-3">Mã SKU</th>
                <th className="py-3.5 px-3">Danh mục</th>
                <th className="py-3.5 px-3">Giá bán</th>
                <th className="py-3.5 px-3">Kho hàng</th>
                <th className="py-3.5 px-3">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Đang tải dữ liệu sản phẩm...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào phù hợp
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative flex-shrink-0">
                          {p.images?.[0]?.imageUrl ? (
                            <Image
                              src={p.images[0].imageUrl}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-bold text-white hover:text-red-400 line-clamp-1 flex items-center gap-1"
                          >
                            {p.name}
                            <ExternalLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
                          </a>
                          <span className="text-[10px] text-slate-500">
                            {p.series?.name || 'Sưu tầm chính hãng'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300 font-semibold">{p.sku}</td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {p.category?.name || 'Chưa phân loại'}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-red-400">
                      {Number(p.price).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-semibold ${
                          p.stockQuantity > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {p.stockQuantity} món
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'PRE_ORDER'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : p.status === 'IN_STOCK'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {p.status === 'PRE_ORDER'
                          ? 'Pre-order'
                          : p.status === 'IN_STOCK'
                          ? 'Có sẵn'
                          : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-white"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create Product */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-xs shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-base font-black text-white">Thêm Sản Phẩm Mới</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {formSuccess}
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Tên sản phẩm *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Mô hình Figure Gojo Satoru 1/7 Shibuya Incident"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    placeholder="VD: FIG-GJS-001"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white uppercase font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="VD: 3500000"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Giá gốc / Niêm yết (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="VD: 4000000 (để hiển thị % giảm giá)"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Số lượng trong kho *</label>
                  <input
                    type="number"
                    required
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Trạng thái bán *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="IN_STOCK">Có sẵn trong kho (IN_STOCK)</option>
                    <option value="PRE_ORDER">Đặt trước (PRE_ORDER)</option>
                    <option value="OUT_OF_STOCK">Tạm hết hàng (OUT_OF_STOCK)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Tỷ lệ / Scale</label>
                  <input
                    type="text"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    placeholder="VD: 1/7, Nendoroid, RG 1/144"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Chất liệu</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="VD: PVC, ABS, Acrylic"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">URL Hình ảnh sản phẩm</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="VD: https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Mô tả sản phẩm</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Chi tiết sản phẩm, xuất xứ, phụ kiện đi kèm..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-red-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-slate-300 font-medium cursor-pointer">
                    Đánh dấu là Sản phẩm nổi bật (Hiển thị trang chủ)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-800 hover:bg-slate-800 rounded-xl text-slate-300 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md shadow-red-600/20 disabled:opacity-50"
                >
                  {formLoading ? 'Đang tạo...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

