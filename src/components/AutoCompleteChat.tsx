
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface AutoCompleteChatProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const AutoCompleteChat = ({ 
  value, 
  onChange, 
  onSend, 
  disabled, 
  placeholder = "Type a message..." 
}: AutoCompleteChatProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const commonPhrases = [
    "Hello everyone!",
    "Great stream!",
    "Thanks for the content",
    "Love this!",
    "Amazing work",
    "Keep it up!",
    "So entertaining",
    "This is awesome",
    "Great job!",
    "Really enjoying this"
  ];

  useEffect(() => {
    if (value.length > 1) {
      const filtered = commonPhrases.filter(phrase => 
        phrase.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === 'Tab' && selectedIndex >= 0) {
        e.preventDefault();
        onChange(suggestions[selectedIndex]);
        setShowSuggestions(false);
      }
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedIndex >= 0 && showSuggestions) {
        onChange(suggestions[selectedIndex]);
        setShowSuggestions(false);
      } else {
        onSend();
      }
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="flex-1"
          autoComplete="off"
        />
        <Button onClick={onSend} size="sm" disabled={disabled || !value.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 ${
                index === selectedIndex ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteChat;
