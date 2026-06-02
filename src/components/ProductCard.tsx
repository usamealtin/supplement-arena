import { useState } from 'react';
import { User, EnrichedProduct } from '../types';
import { StarRating } from './StarRating';
import { formatTRY, getContentNameByCategory } from '../utils/helpers';
import { ProductEditModal } from './ProductEditModal';

interface ProductCardProps {
  ranked: EnrichedProduct;
  user: User | null;
  categoryList: string[];
  brandList: string[];
  onAddComment: (productId: string, text: string, taste: number) => void;
  onUpdateProduct: (product: any) => void;
  onDeleteProduct: (productId: string) => void;
}

export const ProductCard = ({
  ranked,
  user,
  categoryList,
  brandList,
  onAddComment,
  onUpdateProduct,
  onDeleteProduct,
}: ProductCardProps) => {
  const { product, metrics, rank, tasteAvg, comments } = ranked;
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentTaste, setCommentTaste] = useState(0);
  const [editOpen, setEditOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const contentName = product.contentName || getContentNameByCategory(product.category);
  const contentGrams = product.contentGrams || 0;

  const handleComment = () => {
    if (!commentText && commentTaste === 0) return;
    onAddComment(product.id, commentText || 'Sadece Puan Verildi', commentTaste);
    setCommentText('');
    setCommentTaste(0);
  };

  const handleDelete = () => {
    if (window.confirm(`"${product.brand} - ${product.name}" ürününü silmek istediğinizden emin misiniz?`)) {
      onDeleteProduct(product.id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 mb-4 shadow-sm flex flex-col rounded overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Section - Product Info */}
        <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="border border-gray-300 px-2 py-0.5 text-sm font-bold bg-gray-50 rounded">
              #{rank}
            </span>
            <span className="text-xs uppercase text-gray-400 font-bold">{product.category}</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{product.brand}</h3>
          <p className="text-sm text-gray-500">{product.name}</p>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {product.code && (
              <span className="bg-gray-900 text-white text-xs px-2 py-1 uppercase font-bold rounded">
                🎟️ {product.code}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded">
              <StarRating value={Math.round(tasteAvg)} editable={false} onChange={() => {}} size={16} />
              <span className="ml-1 text-brand">
                {tasteAvg > 0 ? tasteAvg.toFixed(1) : 'Yeni'}
              </span>
            </div>
            {contentGrams > 0 && (
              <div className="text-xs font-bold text-gray-700 bg-red-50 px-2 py-1 rounded">
                {contentName}: {formatTRY(contentGrams, contentGrams % 1 === 0 ? 0 : 2)}g / servis
              </div>
            )}
          </div>
        </div>

        {/* Middle Section - Pricing */}
        <div className="w-full md:w-64 p-4 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col justify-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {formatTRY(product.price)} ₺
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-gray-400 uppercase font-bold">1 Servis:</span>
              <br />
              <b className="text-base">{formatTRY(metrics.costPerServing)} ₺</b>
            </div>
            {contentGrams > 0 && (
              <div className="border-t pt-2">
                <span className="text-gray-400 uppercase font-bold">
                  1 {contentName} Gramı:
                </span>
                <br />
                <b className="text-brand text-base">
                  {formatTRY(metrics.costPerContentGram, 4)} ₺
                </b>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="w-full md:w-40 p-4 flex flex-col gap-2 justify-center">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-brand text-white text-center py-2 text-xs font-bold uppercase hover:bg-red-700 rounded transition-colors"
          >
            🔍 İncele
          </a>
          <button
            onClick={() => setShowComments(!showComments)}
            className="w-full border border-gray-300 bg-white py-2 text-xs font-bold uppercase text-gray-700 hover:bg-gray-50 rounded transition-colors"
          >
            💬 Yorum ({comments.length})
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => setEditOpen(true)}
                className="w-full border border-blue-500 bg-blue-50 text-blue-700 py-2 text-xs font-bold uppercase hover:bg-blue-100 rounded transition-colors"
              >
                ✏️ Düzenle
              </button>
              <button
                onClick={handleDelete}
                className="w-full border border-red-500 bg-red-50 text-red-700 py-2 text-xs font-bold uppercase hover:bg-red-100 rounded transition-colors"
              >
                🗑️ Sil
              </button>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isAdmin && (
        <ProductEditModal
          isOpen={editOpen}
          product={product}
          categoryList={categoryList}
          brandList={brandList}
          onClose={() => setEditOpen(false)}
          onSave={onUpdateProduct}
        />
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b">
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500 font-bold uppercase">
                Henüz değerlendirme yok. İlk puanı sen ver!
              </p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-white p-3 border border-gray-200 text-sm rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-800">{c.author}</span>
                    {c.taste > 0 && <StarRating value={c.taste} editable={false} onChange={() => {}} size={14} />}
                  </div>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {user ? (
            <div className="flex flex-col gap-3 bg-white p-4 border border-brand shadow-sm mt-4 rounded">
              <h4 className="font-bold text-sm uppercase text-gray-900">Değerlendir</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-gray-600">Kullanıcı Puanı Ver:</span>
                <StarRating
                  value={commentTaste}
                  editable
                  onChange={(val) => setCommentTaste(val)}
                  size={22}
                />
              </div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Yorumunu yaz..."
                className="w-full border p-2 text-sm outline-none focus:border-brand rounded"
                rows={2}
              ></textarea>
              <button
                onClick={handleComment}
                className="self-end bg-brand text-white px-6 py-2 text-xs font-bold uppercase hover:opacity-90 rounded transition-colors"
              >
                Puanla & Gönder
              </button>
            </div>
          ) : (
            <div className="text-xs text-brand font-bold uppercase border border-brand bg-white p-3 text-center mt-4 shadow-sm rounded">
              🔒 Puan vermek için sağ üstten giriş yapmalısınız.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
