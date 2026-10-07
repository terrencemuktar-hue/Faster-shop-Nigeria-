import React, { useState } from 'react';
import { X, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export default function StoryReels({ vendors = [] }) {
  const [activeStory, setActiveStory] = useState(null);

  // Default mock stories if vendors don't have custom stories yet
  const stories = vendors.map((vendor, idx) => ({
    id: vendor.id || `story_${idx}`,
    name: vendor.name,
    avatar: vendor.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    tagline: vendor.category || 'Featured Collection',
    media: vendor.image || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2',
    timestamp: '2h ago'
  }));

  if (stories.length === 0) return null;

  return (
    <div className="w-full py-4 bg-zinc-950/60 border-b border-zinc-900 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-4 px-4 max-w-7xl mx-auto">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-emerald-500 to-pink-500 group-hover:scale-105 transition duration-300 shadow-lg shadow-emerald-950/40">
              <img 
                src={story.avatar} 
                alt={story.name} 
                className="w-full h-full object-cover rounded-full border-2 border-zinc-950 bg-zinc-900"
              />
            </div>
            <span className="text-xs font-medium text-zinc-300 max-w-[64px] truncate">{story.name}</span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm h-[80vh] bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col justify-between">
            
            {/* Top Bar Progress & Header */}
            <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent space-y-3">
              <div className="flex gap-1">
                <div className="h-1 flex-1 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-full animate-[pulse_2s_infinite]"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={activeStory.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-emerald-500/50" />
                  <div>
                    <h4 className="text-white font-semibold text-sm">{activeStory.name}</h4>
                    <p className="text-zinc-400 text-xs">{activeStory.timestamp}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveStory(null)}
                  className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Story Media */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950">
              <img src={activeStory.media} alt="" className="w-full h-full object-cover" />
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 inset-x-0 z-20 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {activeStory.tagline}
              </div>
              <p className="text-white text-sm font-medium">Tap into the latest collection drop and order directly via WhatsApp!</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
