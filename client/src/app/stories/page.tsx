'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface IStory {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image?: string;
  linkedinProfile?: string;
  user: {
    name: string;
    profilePicture?: string;
  };
}

export default function StoriesPage() {
  const [stories, setStories] = useState<IStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          }/api/stories`
        );
        const data = await res.json();
        setStories(data);
      } catch (error) {
        console.error('Failed to fetch stories', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Alumni Success Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Inspiring journeys from our distinguished alumni.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Link
              href="/stories/create"
              className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
            >
              Share Your Journey
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading stories...</div>
        ) : stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {stories.map((story, index) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      {story.image ? (
                        <Image
                          src={`http://localhost:5000${story.image}`}
                          alt={story.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-900 font-bold text-xl">
                          {story.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {story.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {story.role} @ {story.company}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-50 opacity-50" />
                    <p className="text-gray-600 leading-relaxed relative z-10 pl-4 border-l-4 border-blue-100">
                      {story.content}
                    </p>
                  </div>

                  {story.linkedinProfile && (
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <a
                        href={story.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-blue-700 transition flex items-center gap-1"
                      >
                        Connect on LinkedIn &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Be the first to share your journey and inspire the next generation
              of students!
            </p>
            <Link
              href="/stories/create"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Share Your Story
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
