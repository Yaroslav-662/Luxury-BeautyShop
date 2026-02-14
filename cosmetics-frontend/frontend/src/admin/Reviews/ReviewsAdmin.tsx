import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import { AdminShell } from "@/admin/_ui/AdminShell";
import { adminDeleteReview, adminGetProducts, adminGetReviews, ProductDTO, ReviewDTO } from "@/admin/api/admin.api";

export default function ReviewsAdmin() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ReviewDTO[]>([]);

  async function load() {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        adminGetProducts({ page: 1, q: "" }),
        adminGetReviews(product ? { product } : undefined),
      ]);
      setProducts(p.products);
      setItems(r);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const productsMap = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((x) => m.set(x._id, x.name));
    return m;
  }, [products]);

  async function onDelete(id: string) {
    if (!confirm("Видалити відгук?")) return;
    await adminDeleteReview(id);
    await load();
  }

  function authorLabel(r: ReviewDTO) {
    if (typeof r.user === "string") return r.user.slice(-6);
    return r.user?.email || r.user?.id || r.user?._id?.slice?.(-6) || "—";
  }

  function productLabel(r: ReviewDTO) {
    if (typeof r.product === "string") return productsMap.get(r.product) || r.product;
    return r.product?.name || r.product?.id || "—";
  }

  return (
    <>
      <MetaTags title="Admin — Reviews" />
      <AdminShell title="Reviews" subtitle="GET /api/reviews (+product filter) + DELETE /api/reviews/:id">
        <div className="flex flex-col md:flex-row gap-3 md:items-end mb-4">
          <div className="w-full md:w-96">
            <Select value={product} onChange={(e) => setProduct(e.target.value)} aria-label="Product">
              <option value="">All products</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="text-sm text-neutral-400">
            Count: <span className="text-white font-semibold">{items.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3">Product</th>
                  <th className="text-left py-3">Author</th>
                  <th className="text-left py-3">Rating</th>
                  <th className="text-left py-3">Comment</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r._id} className="border-b border-neutral-900">
                    <td className="py-3 text-white font-medium">{productLabel(r)}</td>
                    <td className="py-3 text-neutral-300">{authorLabel(r)}</td>
                    <td className="py-3 text-neutral-200">{r.rating}</td>
                    <td className="py-3 text-neutral-200">{r.comment || "—"}</td>
                    <td className="py-3">
                      <div className="flex justify-end">
                        <Button variant="danger" onClick={() => onDelete(r._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-neutral-400">
                      Немає відгуків.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}
