import React, { useState, useRef, useEffect } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  ArrowUturnLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SimpleRichTextEditor = ({ 
  content, 
  onChange, 
  placeholder = "Write your answer here...",
  className = "",
  onSubmit,
  submitText = "Submit Answer"
}) => {
  const editorRef = useRef(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && content && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          setShowLinkDialog(true);
          break;
        case 'z':
          e.preventDefault();
          executeCommand('undo');
          break;
        case 'y':
          e.preventDefault();
          executeCommand('redo');
          break;
        default:
          break;
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsToolbarVisible(true);
  };

  const handleBlur = (e) => {
    // Only hide toolbar if clicking outside the editor container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsFocused(false);
      setTimeout(() => {
        if (!isFocused) {
          setIsToolbarVisible(false);
        }
      }, 150);
    }
  };

  const insertBlockQuote = () => {
    executeCommand('formatBlock', 'blockquote');
  };

  const insertCodeBlock = () => {
    const codeHtml = '<pre><code>// Your code here</code></pre>';
    executeCommand('insertHTML', codeHtml);
  };

  const changeTextColor = (color) => {
    executeCommand('foreColor', color);
  };

  const changeBackgroundColor = (color) => {
    executeCommand('hiliteColor', color);
  };

  const insertHorizontalRule = () => {
    executeCommand('insertHorizontalRule');
  };

  const handleLinkInsert = () => {
    if (linkUrl && linkText) {
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${linkText}</a>`;
      executeCommand('insertHTML', linkHtml);
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageHtml = `<img src="${e.target.result}" alt="Uploaded image" class="max-w-full h-auto rounded-lg my-2" />`;
        executeCommand('insertHTML', imageHtml);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar - appears with animation */}
      <div 
        className={`border-b border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
          isToolbarVisible ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="p-3">
          <div className="flex items-center space-x-1 flex-wrap gap-1">
            {/* Text Formatting */}
            <button
              type="button"
              onClick={() => executeCommand('bold')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Bold (Ctrl+B)"
            >
              <BoldIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('italic')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Italic (Ctrl+I)"
            >
              <ItalicIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('underline')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => executeCommand('strikeThrough')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Strikethrough"
            >
              <span className="text-sm font-medium">S̶</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Text Alignment */}
            <button
              type="button"
              onClick={() => executeCommand('justifyLeft')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Align Left"
            >
              <span className="text-sm font-medium">⬅</span>
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('justifyCenter')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Align Center"
            >
              <span className="text-sm font-medium">⬌</span>
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('justifyRight')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Align Right"
            >
              <span className="text-sm font-medium">➡</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Lists */}
            <button
              type="button"
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Bullet List"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('insertOrderedList')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Numbered List"
            >
              <NumberedListIcon className="h-4 w-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Special Elements */}
            <button
              type="button"
              onClick={insertBlockQuote}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Quote"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={insertCodeBlock}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Code Block"
            >
              <CodeBracketIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={insertHorizontalRule}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Horizontal Line"
            >
              <span className="text-sm font-medium">—</span>
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Text Colors */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => changeTextColor('#ef4444')}
                className="w-6 h-6 rounded bg-red-500 border border-gray-300 hover:scale-110 transition-transform"
                title="Red Text"
              />
              <button
                type="button"
                onClick={() => changeTextColor('#3b82f6')}
                className="w-6 h-6 rounded bg-blue-500 border border-gray-300 hover:scale-110 transition-transform"
                title="Blue Text"
              />
              <button
                type="button"
                onClick={() => changeTextColor('#10b981')}
                className="w-6 h-6 rounded bg-green-500 border border-gray-300 hover:scale-110 transition-transform"
                title="Green Text"
              />
              <button
                type="button"
                onClick={() => changeTextColor('#000000')}
                className="w-6 h-6 rounded bg-black border border-gray-300 hover:scale-110 transition-transform"
                title="Black Text"
              />
            </div>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Link and Image */}
            <button
              type="button"
              onClick={() => setShowLinkDialog(true)}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insert Link (Ctrl+K)"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            
            <label className="p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer" title="Upload Image">
              <PhotoIcon className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            
            {/* Undo/Redo */}
            <button
              type="button"
              onClick={() => executeCommand('undo')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={() => executeCommand('redo')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
            
            {/* Clear Formatting */}
            <button
              type="button"
              onClick={() => executeCommand('removeFormat')}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Clear Formatting"
            >
              <span className="text-sm font-medium">Tx</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateContent}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`p-4 min-h-[300px] focus:outline-none transition-all duration-200 ${
          isFocused ? 'bg-white ring-2 ring-blue-500 ring-opacity-20' : 'bg-white'
        }`}
        style={{ whiteSpace: 'pre-wrap' }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />

      {/* Submit Button */}
      <div className={`border-t border-gray-200 bg-gray-50 transition-all duration-300 ease-in-out ${
        isToolbarVisible ? 'p-3' : 'p-3'
      }`}>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            {submitText}
          </button>
        </div>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter link text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleLinkInsert}
                disabled={!linkUrl || !linkText}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Insert Link
              </button>
              <button
                onClick={() => {
                  setShowLinkDialog(false);
                  setLinkUrl('');
                  setLinkText('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS for placeholder */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default SimpleRichTextEditor;
