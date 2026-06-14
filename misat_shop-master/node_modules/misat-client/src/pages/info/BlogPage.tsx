import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts] = useState([
    { id: 1, title: 'Новая коллекция осень-зима 2025', date: '2025-01-15', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600', excerpt: 'Представляем новую коллекцию премиальной одежды и аксессуаров. Минимализм, качество, стиль.', category: 'Новости' },
    { id: 2, title: 'Как ухаживать за одеждой', date: '2025-01-10', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600', excerpt: 'Советы по уходу за одеждой, чтобы она служила долго.', category: 'Советы' },
    { id: 3, title: 'Скидка 20% на первый заказ', date: '2025-01-05', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', excerpt: 'Промокод: WELCOME20 на первый заказ', category: 'Акции' },
  ]);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Блог</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Blog"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">СТАТЬИ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              БЛОГ
            </h1>
            <p className="text-gray-400 text-sm mt-3">Новости, советы и акции</p>
          </div>
        </div>

        {!selectedPost ? (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(post => (
              <article
                key={post.id}
                className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-white/30 hover:-translate-y-1 transition-all duration-300"
                onClick={() => setSelectedPost(post)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/60">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-white font-black text-lg mb-2 group-hover:text-gray-300 transition line-clamp-1">{post.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-white/40 group-hover:text-white/70 transition">
                    <span className="text-xs">Читать</span>
                    <i className="fas fa-arrow-right text-[10px]"></i>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 text-sm"
            >
              <i className="fas fa-arrow-left text-xs"></i> Назад к списку
            </button>
            <article className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-8">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <span className="bg-white/10 px-2 py-0.5 rounded-full text-white/60">{selectedPost.category}</span>
                  <span>{selectedPost.date}</span>
                </div>
                <h1 className="text-white font-black text-3xl mb-4">{selectedPost.title}</h1>
                <p className="text-gray-300 text-base leading-relaxed">{selectedPost.excerpt}</p>
                <p className="text-gray-400 text-sm mt-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;