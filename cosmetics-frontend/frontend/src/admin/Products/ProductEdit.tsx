import React, { useEffect, useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/shared/api/api";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import "./ProductEdit.css";

type Product = {
  _id: string;
  title: string;
  price: number;
  imageUrl: string;
};

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get<Product>(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !product) return;

    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    setUploading(true);
    try {
      const res = await api.post<{ url: string }>(
        "/api/upload/products",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProduct({ ...product, imageUrl: res.data.url });
    } finally {
      setUploading(false);
    }
  };

  const onSave = async () => {
    if (!product) return;

    setSaving(true);
    try {
      await api.put(`/api/products/${product._id}`, product);
      navigate("/admin/products");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Завантаження…</div>;
  if (!product) return <div>Товар не знайдено</div>;

  return (
    <div className="product-edit">
      <h2>Редагування товару</h2>

      <Input
        placeholder="Назва товару"
        value={product.title}
        onChange={(e) =>
          setProduct({ ...product, title: e.target.value })
        }
      />

      <Input
        type="number"
        placeholder="Ціна"
        value={product.price}
        onChange={(e) =>
          setProduct({ ...product, price: Number(e.target.value) })
        }
      />

      <input
        type="file"
        title="Завантажити фото"
        onChange={onImageChange}
      />

      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt="product"
          className="product-edit__image"
        />
      )}

      <Button onClick={onSave} disabled={saving || uploading}>
        {saving ? "Збереження..." : "Зберегти"}
      </Button>
    </div>
  );
};

export default ProductEdit;
