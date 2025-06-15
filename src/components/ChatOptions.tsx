
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Removed unused Lucide imports

interface ChatOptionsProps {
  onQuickMessage: (message: string) => void;
  onEmoji: (emoji: string) => void;
}

const ChatOptions = ({ onQuickMessage, onEmoji }: ChatOptionsProps) => {
  const quickMessages = [
    "Hello! 👋",
    "Great stream! 🔥",
    "Love this content ❤️",
    "Amazing! 🌟",
    "Keep going! 💪",
    "So cool! 😎"
  ];

  const emojis = [
    { icon: "👋", name: "wave" },
    { icon: "❤️", name: "heart" },
    { icon: "🔥", name: "fire" },
    { icon: "🌟", name: "star" },
    { icon: "😎", name: "cool" },
    { icon: "💪", name: "strong" },
    { icon: "🎉", name: "party" },
    { icon: "👏", name: "clap" }
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Quick Messages</p>
            <div className="flex flex-wrap gap-1">
              {quickMessages.map((message, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => onQuickMessage(message)}
                >
                  {message}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Reactions</p>
            <div className="flex flex-wrap gap-1">
              {emojis.map((emoji, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="ghost"
                  className="text-lg h-8 w-8 p-0"
                  onClick={() => onEmoji(emoji.icon)}
                >
                  {emoji.icon}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatOptions;
