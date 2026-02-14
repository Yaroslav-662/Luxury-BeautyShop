import React, { useEffect, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import { Link, useSearchParams } from "react-router-dom";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Pagination from "@/shared/ui/Pagination";
import { AdminShell } from "@/admin/_ui/AdminShell";
import { adminDeleteProduct, adminGetProducts, ProductDTO } from "@/admin/api/admin.api";

export default function ProductsList() {
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || "1");
  const q = sp.get("q") || "";

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ total: number; totalPages: number; products: ProductDTO[] }>({
    total: 0,
    totalPages: 1,
    products: [],
  });

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetProducts({ page, q });
      setData({ total: res.total, totalPages: res.totalPages, products: res.products });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, q]);

  async function onDelete(id: string) {
    if (!confirm("Видалити товар?")) return;
    await adminDeleteProduct(id);
    await load();
  }

  return (
    <>
      <MetaTags title="Admin — Products" />
      <AdminShell
        title="Products"
        subtitle="CRUD товарів: GET/POST/PUT/DELETE /api/products"
        right={
          <Link to="/admin/products/create">
            <Button>+ Add product</Button>
          </Link>
        }
      >
        <div className="flex flex-col md:flex-row gap-3 md:items-end mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search (q): name/description…"
              value={q}
              onChange={(e) => setSp({ page: "1", q: e.target.value })}
            />
          </div>
          <div className="text-sm text-neutral-400">
            Total: <span className="text-white font-semibold">{data.total}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3">Name</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Stock</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((p) => (
                  <tr key={p._id} className="border-b border-neutral-900">
                    <td className="py-3 text-white font-medium">
                      <div className="flex flex-col">
                        <span>{p.name}</span>
                        <span className="text-xs text-neutral-500">ID: {p._id}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-200">{p.price} ₴</td>
                    <td className="py-3 text-neutral-200">{p.stock ?? 0}</td>
                    <td className="py-3 text-neutral-200">
                      {typeof p.category === "string"
                        ? p.category
                        : p.category?.name || "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/products/${p._id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <Button variant="danger" onClick={() => onDelete(p._id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-neutral-400">
                      Немає товарів.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onChange={(p) => setSp({ page: String(p), q })}
            />
          </div>
        )}
      </AdminShell>
    </>
  );
}
