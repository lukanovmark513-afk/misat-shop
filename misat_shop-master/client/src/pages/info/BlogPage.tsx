import React, { useState } from 'react';

const BlogPage = () => {
  const [posts] = useState([
    {
      id: 1,
      title: 'Новая коллекция осень-зима 2025',
      date: '15 января 2025',
      image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600',
      excerpt: 'Представляем новую коллекцию премиальной одежды и аксессуаров. Минимализм, качество, стиль.',
      category: 'Новости',
      content: 'Полный текст статьи о новой коллекции осень-зима 2025. Мы подготовили для вас самые стильные модели, которые будут актуальны в этом сезоне. Тренды, качественные материалы и безупречный крой — всё это в новой коллекции MISAT.'
    },
    {
      id: 2,
      title: 'Как ухаживать за одеждой',
      date: '10 января 2025',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600',
      excerpt: 'Советы по уходу за одеждой, чтобы она служила долго.',
      category: 'Советы',
      content: 'Полный текст статьи о правильном уходе за одеждой. Как стирать, сушить и хранить вещи, чтобы они сохраняли свой вид долгие годы. Полезные советы для каждого.'
    },
    {
      id: 3,
      title: 'Скидка 20% на первый заказ',
      date: '5 января 2025',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
      excerpt: 'Промокод: WELCOME20 на первый заказ',
      category: 'Акции',
      content: 'Полный текст статьи о акции. При первом заказе вы получаете скидку 20% по промокоду WELCOME20. Не упустите возможность приобрести стильные вещи со скидкой.'
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Фон
  const renderBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
      <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
    </div>
  );

  // Hero
  const renderHero = () => (
    <div className="relative overflow-hidden rounded-3xl border border-white/20 mb-12">
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
      <div className="relative py-16 px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-10 h-px bg-white/30" />
          <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">Статьи</span>
          <span className="w-10 h-px bg-white/30" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
          Блог
        </h1>
        <p className="text-zinc-500 text-base mt-4 max-w-2xl mx-auto">
          Новости, советы и акции от MISAT
        </p>
      </div>
    </div>
  );

  // Список статей
  const renderPosts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {posts.map(post => (
        <article
          key={post.id}
          className="
            group
            bg-[#111111]
            border border-white/20
            rounded-3xl
            overflow-hidden
            cursor-pointer
            transition-all
            duration-300
            hover:border-white/40
            hover:-translate-y-1
          "
          onClick={() => setSelectedPost(post)}
        >
          <div className="relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="
                w-full
                h-72
                object-cover
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60 text-xs">
                {post.category}
              </span>
              <span className="text-xs">{post.date}</span>
            </div>
            <h2 className="text-white font-black text-xl mb-3 group-hover:text-gray-300 transition line-clamp-2">
              {post.title}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center gap-2 text-white/40 group-hover:text-white transition">
              <span className="text-sm">Читать</span>
              <i className="fas fa-arrow-right text-xs" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  // Детальная статья
  const renderPostDetail = () => (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => setSelectedPost(null)}
        className="
          inline-flex
          items-center
          gap-2
          text-zinc-400
          hover:text-white
          transition
          mb-8
          text-sm
        "
      >
        <i className="fas fa-arrow-left text-xs" />
        Назад к списку
      </button>

      <article className="bg-[#111111] border border-white/20 rounded-3xl overflow-hidden">
        <img
          src={selectedPost.image}
          alt={selectedPost.title}
          className="w-full h-[500px] object-cover"
        />
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-3 text-sm text-zinc-500 mb-6">
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60 text-xs">
              {selectedPost.category}
            </span>
            <span className="text-xs">{selectedPost.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            {selectedPost.title}
          </h1>
          <div className="space-y-4 text-zinc-300 text-base leading-8">
            <p>{selectedPost.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </div>
      </article>
    </div>
  );

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {renderBackground()}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 pb-32">
        {renderHero()}
        {!selectedPost ? renderPosts() : renderPostDetail()}
      </div>
    </main>
  );
};

export default BlogPage;