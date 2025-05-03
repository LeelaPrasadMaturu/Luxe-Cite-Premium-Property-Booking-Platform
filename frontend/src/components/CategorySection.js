'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'luxury',
    name: 'Luxury Hotels',
    image: '/images/luxury.jpg',
    description: 'Experience ultimate luxury and comfort',
  },
  {
    id: 'beachfront',
    name: 'Beachfront Resorts',
    image: '/images/beachfront.jpg',
    description: 'Wake up to stunning ocean views',
  },
  {
    id: 'mountain',
    name: 'Mountain Retreats',
    image: '/images/mountain.jpg',
    description: 'Escape to serene mountain landscapes',
  },
  {
    id: 'city',
    name: 'City Center',
    image: '/images/city.jpg',
    description: 'Stay in the heart of the action',
  },
];

export default function CategorySection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/search?category=${category.id}`}
              className="group"
            >
              <div className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
} 