const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

async function addProducts() {
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  const products = [
    {
      name: "Кроссовки Nike Air Max",
      price: 8990,
      old_price: 12990,
      image: "https://via.placeholder.com/300x300?text=Nike+Air+Max",
      description: "Комфортные кроссовки для бега и повседневной носки",
      category: "Кроссовки",
      sizes: "39,40,41,42,43",
      colors: "Черный,Белый",
      stock: 25,
      rating: 4.5
    },
    {
      name: "Футболка Adidas Originals",
      price: 2490,
      old_price: 3990,
      image: "https://via.placeholder.com/300x300?text=Adidas+T-Shirt",
      description: "Хлопковая футболка с логотипом",
      category: "Футболки",
      sizes: "S,M,L,XL",
      colors: "Красный,Синий,Черный",
      stock: 50,
      rating: 4.2
    },
    {
      name: "Джинсы Levi's 501",
      price: 4990,
      old_price: 7990,
      image: "https://via.placeholder.com/300x300?text=Levis+Jeans",
      description: "Классические джинсы прямого кроя",
      category: "Джинсы",
      sizes: "30,32,34,36",
      colors: "Синий,Черный",
      stock: 30,
      rating: 4.8
    },
    {
      name: "Пальто осеннее",
      price: 12990,
      old_price: 19990,
      image: "https://via.placeholder.com/300x300?text=Coat",
      description: "Тёплое осеннее пальто",
      category: "Верхняя одежда",
      sizes: "S,M,L,XL",
      colors: "Бежевый,Черный",
      stock: 15,
      rating: 4.7
    },
    {
      name: "Рюкзак городской",
      price: 3490,
      old_price: 4990,
      image: "https://via.placeholder.com/300x300?text=Backpack",
      description: "Вместительный городской рюкзак",
      category: "Аксессуары",
      sizes: "One size",
      colors: "Черный,Синий",
      stock: 40,
      rating: 4.3
    },
    {
      name: "Часы наручные",
      price: 5990,
      old_price: 8990,
      image: "https://via.placeholder.com/300x300?text=Watch",
      description: "Стильные наручные часы",
      category: "Аксессуары",
      sizes: "One size",
      colors: "Серебро,Золото",
      stock: 20,
      rating: 4.6
    }
  ];

  for (const product of products) {
    await db.run(`
      INSERT INTO products (
        name, price, old_price, image, description,
        category, sizes, colors, stock, rating, is_new, is_sale
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product.name, product.price, product.old_price, product.image, 
      product.description, product.category, product.sizes, product.colors,
      product.stock, product.rating, 1, 1
    ]);
    console.log(`✅ Добавлен товар: ${product.name}`);
  }

  await db.close();
  console.log("✅ Все товары добавлены!");
}

addProducts();
