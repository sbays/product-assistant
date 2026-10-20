import { searchProducts } from '../app/lib/products';

console.log(await searchProducts({ category: 'smartphones', sortBy: 'rating', limit: 2 }));
console.log(await searchProducts({ query: 'phone' }));
console.log(await searchProducts({ query: 'smartphone unlocked' }));