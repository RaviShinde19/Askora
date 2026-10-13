import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import EmojiPicker from 'emoji-picker-react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile,
  ImageIcon,
  X,
  Save,
  Maximize2,
  Minimize2
} from 'lucide-react';

const FloatingTextEditor = ({ 
  isOpen, 
  onClose, 
  position = { x: 100, y: 100 },
  onSave,
  initialContent = '',
  placeholder = "Start typing...",
}) => {
  const [content, setContent] = useState(initialContent);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const editorRef = useRef(null);
  const headerRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Strike,
      ListItem,
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Dropcursor,
      Gapcursor,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    onFocus: () => {
      if (!isExpanded) {
        setIsExpanded(true);
      }
    },
    onDrop: (view, event, slice, moved) => {
      if (moved) return false;
      
      const files = Array.from(event.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      if (imageFiles.length > 0) {
        event.preventDefault();
        handleImageUpload(imageFiles[0]);
        return true;
      }
      
      return false;
    },
    onPaste: (view, event, slice) => {
      const items = Array.from(event.clipboardData.items);
      const imageItem = items.find(item => item.type.startsWith('image/'));
      
      if (imageItem) {
        event.preventDefault();
        const file = imageItem.getAsFile();
        handleImageUpload(file);
        return true;
      }
      
      return false;
    },
  });

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setCurrentPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && editor) {
      setTimeout(() => {
        editor.commands.focus();
      }, 100);
    }
  }, [isOpen, editor]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handle image upload
  const handleImageUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target.result;
      editor?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const insertEmoji = (emojiObject) => {
    editor?.chain().focus().insertContent(emojiObject.emoji).run();
    setShowEmojiPicker(false);
  };

  const handleMouseDown = (e) => {
    if (headerRef.current && headerRef.current.contains(e.target)) {
      setIsDragging(true);
      const rect = editorRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
    onClose();
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const ToolbarButton = ({ onClick, isActive, title, children, className = '' }) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-all duration-200 hover:bg-gray-100 hover:scale-105 ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      } ${className}`}
      title={title}
    >
      {children}
    </button>
  );

  const BubbleMenuContent = () => (
    <div className="flex items-center space-x-1 bg-gray-900 text-white p-2 rounded-lg shadow-lg border border-gray-700">
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        isActive={editor?.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <UnderlineIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={editor?.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-600 mx-1" />
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive('orderedList')}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-600 mx-1" />
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        isActive={editor?.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        isActive={editor?.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        isActive={editor?.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <AlignRight size={16} />
      </ToolbarButton>
      <div className="w-px h-4 bg-gray-600 mx-1" />
      <ToolbarButton
        onClick={addLink}
        isActive={editor?.isActive('link')}
        title="Add Link"
      >
        <LinkIcon size={16} />
      </ToolbarButton>
    </div>
  );

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={editorRef}
        className={`floating-editor fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ${
          isExpanded ? 'w-96 h-80' : 'w-80 h-48'
        }`}
        style={{
          left: `${currentPosition.x}px`,
          top: `${currentPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-lg cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
            <span className="text-sm font-medium text-gray-700 ml-2">Quick Note</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-200 rounded transition-colors"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Main Toolbar */}
        <div className="flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200 overflow-x-auto">
          <div className="flex items-center space-x-1 min-w-0">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              isActive={editor?.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold size={14} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              isActive={editor?.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic size={14} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              isActive={editor?.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon size={14} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              isActive={editor?.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough size={14} />
            </ToolbarButton>
            <div className="w-px h-3 bg-gray-300 mx-1" />
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              isActive={editor?.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={14} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              isActive={editor?.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={14} />
            </ToolbarButton>
            <div className="w-px h-3 bg-gray-300 mx-1" />
            <ToolbarButton
              onClick={addLink}
              isActive={editor?.isActive('link')}
              title="Add Link"
            >
              <LinkIcon size={14} />
            </ToolbarButton>
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                isActive={showEmojiPicker}
                title="Add Emoji"
              >
                <Smile size={14} />
              </ToolbarButton>
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="absolute top-full right-0 mt-2 z-50"
                >
                  <EmojiPicker
                    onEmojiClick={insertEmoji}
                    width={280}
                    height={350}
                    theme="light"
                  />
                </div>
              )}
            </div>
            <ToolbarButton
              onClick={() => fileInputRef.current?.click()}
              isActive={false}
              title="Insert Image"
            >
              <ImageIcon size={14} />
            </ToolbarButton>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-sm ml-2"
            title="Save (Ctrl+S)"
          >
            <Save size={12} />
            <span>Save</span>
          </button>
        </div>

        {/* Editor Content */}
        <div className="p-4 flex-1 overflow-y-auto bg-white">
          <EditorContent 
            editor={editor} 
            className="prose prose-sm max-w-none focus:outline-none min-h-full"
          />
          
          {/* Bubble Menu - appears when text is selected */}
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ 
                duration: 100,
                animation: 'shift-toward-subtle',
                placement: 'top',
                offset: [0, 8],
              }}
              className="bubble-menu"
            >
              <BubbleMenuContent />
            </BubbleMenu>
          )}
        </div>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        .floating-editor .ProseMirror {
          outline: none;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: #374151;
          height: 100%;
          min-height: 100px;
          padding: 0;
          border-radius: 0;
        }
        
        .floating-editor .ProseMirror:focus {
          box-shadow: none;
        }
        
        .floating-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: "${placeholder}";
          float: left;
          height: 0;
          pointer-events: none;
          font-style: italic;
        }
        
        .floating-editor .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        
        .floating-editor .ProseMirror a:hover {
          color: #1d4ed8;
        }
        
        .floating-editor .ProseMirror ul.bullet-list,
        .floating-editor .ProseMirror ol.ordered-list {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .floating-editor .ProseMirror li {
          margin: 0.25rem 0;
        }
        
        .floating-editor .ProseMirror li p {
          margin: 0;
        }
        
        .floating-editor .ProseMirror p {
          margin: 0.5rem 0;
        }
        
        .floating-editor .ProseMirror p:first-child {
          margin-top: 0;
        }
        
        .floating-editor .ProseMirror p:last-child {
          margin-bottom: 0;
        }
        
        .floating-editor .ProseMirror strong {
          font-weight: 600;
        }
        
        .floating-editor .ProseMirror em {
          font-style: italic;
        }
        
        .floating-editor .ProseMirror s {
          text-decoration: line-through;
        }
        
        .floating-editor .ProseMirror .editor-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin: 12px 0;
        }
        
        .floating-editor .ProseMirror [data-text-align="left"] {
          text-align: left;
        }
        
        .floating-editor .ProseMirror [data-text-align="center"] {
          text-align: center;
        }
        
        .floating-editor .ProseMirror [data-text-align="right"] {
          text-align: right;
        }
        
        .floating-editor .ProseMirror .ProseMirror-drop-cursor {
          background: #3b82f6;
          width: 2px;
          margin: 0 -1px;
        }
        
        .bubble-menu {
          animation: bubbleMenuFadeIn 0.2s ease-out;
        }
        
        @keyframes bubbleMenuFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .floating-editor {
            width: calc(100vw - 32px) !important;
            max-width: 400px;
            left: 16px !important;
            right: 16px !important;
          }
          
          .floating-editor .ProseMirror {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingTextEditor;
