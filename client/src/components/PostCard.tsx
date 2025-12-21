import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { getImageUrl } from '@/utils/imageHelper';
import ImageModal from './ImageModal';

// ... (existing imports)

interface PostProps {
  post: {
    _id: string;
    content: string;
    image?: string;
    author: {
      _id: string;
      name: string;
      role: string;
      profilePicture?: string;
    };
    likes: string[];
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export function PostCard({ post, onDelete }: PostProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLiked = user && likes.includes(user._id);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    // Optimistic UI update
    const previousLikes = [...likes];
    if (isLiked) {
      setLikes(likes.filter((id) => id !== user._id));
    } else {
      setLikes([...likes, user._id]);
    }

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        }/api/posts/${post._id}/like`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        // Revert on error
        setLikes(previousLikes);
      } else {
        const updatedLikes = await res.json();
        setLikes(updatedLikes);
      }
    } catch {
      setLikes(previousLikes);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const profileImageUrl = getImageUrl(post.author.profilePicture);
  const postImageUrl = getImageUrl(post.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full bg-blue-50 overflow-hidden border border-gray-100">
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={post.author.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-600 font-bold text-sm">
                {(post.author.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight">
              {post.author.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="capitalize px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                {post.author.role}
              </span>
              <span>•</span>
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {user?._id === post.author._id && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"
            title="Delete Post"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-gray-800 whitespace-pre-line mb-4 leading-relaxed">
        {post.content}
      </p>

      {postImageUrl && (
        <>
          <div
            className="mb-4 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={postImageUrl}
              alt="Post content"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto', maxHeight: '600px' }}
              className="object-contain bg-black/5 hover:opacity-95 transition-opacity"
              unoptimized
            />
          </div>

          <ImageModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            imageUrl={postImageUrl}
            alt={`Image by ${post.author.name}`}
          />
        </>
      )}

      <div className="flex items-center gap-4 text-sm font-medium border-t border-gray-50 pt-3">
        <button
          onClick={handleLike}
          disabled={!user}
          className={`flex items-center gap-1.5 transition ${
            isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{likes.length}</span>
        </button>
      </div>
    </motion.div>
  );
}
