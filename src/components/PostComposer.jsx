import React, { useState } from 'react';
import MediaUploader from './MediaUploader';
import { Smile, Image } from 'lucide-react';
import { PLATFORMS } from '../App';

// Popular social emojis for our lightweight emoji picker
const EMOJIS = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '👋', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
  '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏',
  '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '🔥', '✨', '🌟', '💥', '💯', '🎉', '🚀', '💡', '📌', '👀'
];

function PostComposer({
  content,
  setContent,
  selectedPlatforms,
  togglePlatform,
  mediaFiles,
  setMediaFiles,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Appends chosen emoji at current cursor position or end of text
  const appendEmoji = (emoji) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Determine the most restrictive limit among selected channels
  const activeLimit = Math.min(
    ...selectedPlatforms.map((p) => PLATFORMS[p].charLimit)
  );

  const percentage = Math.min((content.length / activeLimit) * 100, 100);

  // Circular progress dimensions
  const radius = 16;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine circle color depending on remaining allowance
  const remaining = activeLimit - content.length;
  let circleColor = 'var(--color-primary)';
  if (remaining < 0) {
    circleColor = 'var(--color-error)';
  } else if (remaining <= activeLimit * 0.15) {
    circleColor = 'var(--color-warning)';
  }

  return (
    <div className="composer-container fade-in">
      {/* Platform Chips Section */}
      <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        Publish to:
      </div>
      <div className="platform-selector">
        {Object.values(PLATFORMS).map((p) => {
          const isSelected = selectedPlatforms.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              className={`platform-chip ${isSelected ? `selected-${p.id}` : ''}`}
            >
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Main Canvas */}
      <div className="editor-container">
        <textarea
          className="composer-textarea"
          placeholder="What's happening? Type your post content, hashtags, and links here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {showEmojiPicker && (
          <div className="emoji-drawer-popover">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              <span>Insert Emoji</span>
              <button 
                onClick={() => setShowEmojiPicker(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            <div className="emoji-grid">
              {EMOJIS.map((emoji, idx) => (
                <button
                  key={idx}
                  onClick={() => appendEmoji(emoji)}
                  className="emoji-btn"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Textarea Helpers and Count Ring */}
      <div className="editor-footer">
        <div className="editor-helpers">
          <button
            className="helper-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={16} />
            Add Emoji
          </button>
          
          <button
            className="helper-btn"
            onClick={() => {
              // Programmatically click uploader element
              document.getElementById('hidden-file-input')?.click();
            }}
          >
            <Image size={16} />
            Add Media
          </button>
        </div>

        {/* Dynamic circular SVG and label counters */}
        <div className="char-counter-wrapper">
          <span 
            className={`char-text ${remaining < 0 ? 'error' : remaining <= activeLimit * 0.15 ? 'warning' : ''}`}
          >
            {content.length} / {activeLimit}
          </span>

          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="rgba(255,255,255,0.05)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className="progress-ring-circle"
              stroke={circleColor}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
        </div>
      </div>

      {/* Media file uploader & list */}
      <MediaUploader mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
    </div>
  );
}

export default PostComposer;
