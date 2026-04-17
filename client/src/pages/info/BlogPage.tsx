import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts] = useState([
    { id: 1, title: 'Новая коллекция осень-зима 2025', date: '2025-01-15', image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600', excerpt: 'Представляем новую коллекцию.', category: 'Новости' },
    { id: 2, title: 'Как ухаживать за одеждой', date: '2025-01-10', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600', excerpt: 'Советы по уходу за одеждой.', category: 'Советы' },
    { id: 3, title: 'Скидка 20% на первый заказ', date: '2025-01-05', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', excerpt: 'Промокод: WELCOME20', category: 'Акции' },
  ]);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Блог</span>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">БЛОГ</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>
        {!selectedPost ? (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <article key={post.id} className="border-2 border-black cursor-pointer" onClick={() => setSelectedPost(post)}>
                <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                <div className="p-5">
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-black mb-3">{post.title}</h2>
                  <p className="text-gray-600">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedPost(null)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-6">← Назад</button>
            <article className="border-2 border-black p-8">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-96 object-cover mb-6" />
              <h1 className="text-3xl font-black mb-4">{selectedPost.title}</h1>
              <p className="text-gray-600">{selectedPost.excerpt}</p>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;