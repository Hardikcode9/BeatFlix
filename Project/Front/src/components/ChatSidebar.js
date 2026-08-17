import { useState, useEffect, useRef } from "react";
import {
  FaPlus,
  FaComments,
  FaFire,
  FaLaugh,
  FaHeart,
  FaGhost,
  FaTrash,
  FaRobot,
  FaEllipsisV,
  FaEdit,
} from "react-icons/fa";
import "../styles/ChatSidebar.css";

function ChatSidebar({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const sidebarRef = useRef(null);

  // Close menu if clicking anywhere outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getChatIcon = (title) => {
    const text = title.toLowerCase();
    if (text.includes("action")) return <FaFire />;
    if (text.includes("comedy")) return <FaLaugh />;
    if (text.includes("romance")) return <FaHeart />;
    if (text.includes("horror")) return <FaGhost />;
    if (text.includes("scan")) return <FaRobot />;
    return <FaComments />;
  };

  const today = [];
  const yesterday = [];
  const older = [];
  const now = new Date();

  chats.forEach((chat) => {
    const created = new Date(chat.createdAt);
    const diff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    if (diff === 0) {
      today.push(chat);
    } else if (diff === 1) {
      yesterday.push(chat);
    } else {
      older.push(chat);
    }
  });

  const renderSection = (title, items) => {
    if (items.length === 0) return null;

    return (
      <>
        <div className="chat-group-title">{title}</div>
        {items.map((chat) => (
          <div
            key={chat._id}
            className={`history-item ${activeChatId === chat._id ? "active" : ""}`}
            onClick={() => {
              onSelectChat(chat._id);
              setMenuOpenId(null);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelectChat(chat._id);
              }
            }}
          >
            <div className="chat-icon">{getChatIcon(chat.title)}</div>

            <>
              {editingId === chat._id ? (
                <input
                  className="rename-input"
                  value={editingText}
                  autoFocus
                  onChange={(e) => setEditingText(e.target.value)}
                  onBlur={() => {
                    if (editingText.trim() !== "") {
                      onRenameChat(chat._id, editingText);
                    }
                    setEditingId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (editingText.trim() !== "") {
                        onRenameChat(chat._id, editingText);
                      }
                      setEditingId(null);
                    }
                  }}
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setEditingId(chat._id);
                    setEditingText(chat.title);
                  }}
                >
                  {chat.title}
                </span>
              )}
            </>

            <div
              className="chat-menu-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={`menu-btn ${menuOpenId === chat._id ? "menu-open" : ""}`}
                onClick={() =>
                  setMenuOpenId(menuOpenId === chat._id ? null : chat._id)
                }
              >
                <FaEllipsisV />
              </button>

              {menuOpenId === chat._id && (
                <div className="chat-menu">
                  <button
                    onClick={() => {
                      setEditingId(chat._id);
                      setEditingText(chat.title);
                      setMenuOpenId(null);
                    }}
                  >
                    <FaEdit />
                    Rename
                  </button>

                  <button
                    className="delete-action"
                    onClick={() => {
                      onDeleteChat(chat._id);
                      setMenuOpenId(null);
                    }}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <aside className="chat-sidebar" ref={sidebarRef}>
      <button className="new-chat-btn" onClick={onNewChat}>
        <FaPlus />
        <span>New Chat</span>
      </button>

      <div className="sidebar-heading">Recent Chats</div>

      <div className="chat-history">
        {chats.length === 0 && (
          <div className="empty-history">No chats yet</div>
        )}
        {renderSection("Today", today)}
        {renderSection("Yesterday", yesterday)}
        {renderSection("Older", older)}
      </div>
    </aside>
  );
}

export default ChatSidebar;