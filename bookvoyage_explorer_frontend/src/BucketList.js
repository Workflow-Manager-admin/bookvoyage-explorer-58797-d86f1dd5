import React, { useState, useRef } from "react";

/**
 * BucketList Component (Enhanced)
 *
 * PUBLIC_INTERFACE
 *
 * Displays user's saved places as an interactive reorderable list.
 * Features:
 *  - Remove items from the bucket list
 *  - Add/view/edit an optional note per saved place
 *  - Drag-and-drop & button-based reordering support
 *
 * Accepts:
 *  - places: array of all place objects
 *  - bucketList: array of {placeId, note} objects (or fallback: array of ids)
 *  - onRemoveFromBucket(placeId)
 *  - onUpdateBucketListReorder(newBucketListArray)
 *  - onUpdateNote(placeId, note)
 *
 * If onUpdateNote or onUpdateBucketListReorder are missing, uses internal local state to manage notes/order.
 */

// Helper: Normalize incoming bucketList to [{id, note}] if needed
function normalizeBucketList(bucketList) {
  if (bucketList.length === 0) return [];
  // If already in the new object format, return as is
  if (typeof bucketList[0] === "object" && bucketList[0] !== null && "id" in bucketList[0])
    return bucketList;
  // If legacy array of ids, convert
  return bucketList.map((id) => ({ id, note: "" }));
}

// PUBLIC_INTERFACE
function BucketList({
  places = [],
  bucketList = [],
  onRemoveFromBucket,
  onUpdateBucketListReorder,
  onUpdateNote
}) {
  // Internal state: only needed if parent does NOT manage notes/order (legacy prop interface fallback)
  const [localBucketList, setLocalBucketList] = useState(normalizeBucketList(bucketList));
  // for drag n drop
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Sync up legacy usage (array of ids) to local state
  React.useEffect(() => {
    // If parent is not managing notes or ordering, derive local state from prop
    if (!onUpdateBucketListReorder && (!bucketList[0] || typeof bucketList[0] !== "object"))
      setLocalBucketList(normalizeBucketList(bucketList));
  }, [bucketList, onUpdateBucketListReorder]);

  // source of truth: use parent if provided; else fall back to local state
  const items =
    (bucketList[0] && typeof bucketList[0] === "object" && "id" in bucketList[0])
      ? bucketList
      : localBucketList;

  // Helper: get place obj by id
  const getPlaceById = (id) => places.find((p) => p.id === id);

  // Handlers for note change
  function handleNoteChange(id, val) {
    if (onUpdateNote) {
      onUpdateNote(id, val);
    } else {
      setLocalBucketList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, note: val } : item
        )
      );
    }
  }

  // Handler for drag start
  const handleDragStart = (index) => {
    dragItem.current = index;
  };
  // Handler for drag enter
  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };
  // Handler for drop (reorder)
  const handleDrop = () => {
    const listCopy = [...items];
    const dragIdx = dragItem.current;
    const hoverIdx = dragOverItem.current;
    if (dragIdx === undefined || hoverIdx === undefined || dragIdx === hoverIdx) return;
    const [draggedItem] = listCopy.splice(dragIdx, 1);
    listCopy.splice(hoverIdx, 0, draggedItem);
    dragItem.current = undefined;
    dragOverItem.current = undefined;
    if (onUpdateBucketListReorder) {
      onUpdateBucketListReorder(listCopy);
    } else {
      setLocalBucketList(listCopy);
    }
  };

  // Handler for button-based move up/down
  const moveItem = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= items.length) return;
    const listCopy = [...items];
    const temp = listCopy[index];
    listCopy[index] = listCopy[newIdx];
    listCopy[newIdx] = temp;
    if (onUpdateBucketListReorder) {
      onUpdateBucketListReorder(listCopy);
    } else {
      setLocalBucketList(listCopy);
    }
  };

  return (
    <aside className="bucket-list" aria-label="Bucket List">
      <h2>Bucket List</h2>
      <div className="bucket-list-content" style={{ width: "100%" }}>
        {items.length === 0 ? (
          <ul>
            <li>[No items yet. Add places from the map!]</li>
          </ul>
        ) : (
          <ul
            style={{
              listStyle: "none",
              paddingLeft: 0,
              margin: 0
            }}
          >
            {items.map((item, idx) => {
              const p = getPlaceById(item.id);
              if (!p) return null;
              return (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "7px 2px",
                    background: "#FFF8E1",
                    borderRadius: 8,
                    marginBottom: 8,
                    gap: 8,
                    border: "1px solid #FBBF24",
                    boxShadow: "0 1px 4px #E87A4144",
                    cursor: "move"
                  }}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragEnter={() => handleDragEnter(idx)}
                  onDragEnd={handleDrop}
                  tabIndex={0}
                  aria-label={`Saved: ${p.name}`}
                >
                  {/* Place name and note column */}
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "#4B5563" }}>
                      {p.name}
                    </div>
                    <textarea
                      rows={2}
                      value={item.note || ""}
                      onChange={e => handleNoteChange(item.id, e.target.value)}
                      placeholder="Add a note (why do you want to visit, special plans...)"
                      style={{
                        width: "100%",
                        fontSize: "0.95em",
                        marginTop: 3,
                        borderRadius: 6,
                        padding: "6px 8px",
                        border: "1px solid #e5e7eb",
                        resize: "vertical",
                        background: "#FFFFFA"
                      }}
                    />
                  </div>
                  {/* Move up/down controls */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <button
                      className="btn"
                      title="Move up"
                      style={{ padding: "3px 8px", fontSize: "0.86em", marginBottom: 2 }}
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, -1)}
                      aria-label="Move up"
                    >
                      ▲
                    </button>
                    <button
                      className="btn"
                      title="Move down"
                      style={{ padding: "3px 8px", fontSize: "0.86em" }}
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 1)}
                      aria-label="Move down"
                    >
                      ▼
                    </button>
                  </div>
                  {/* Remove */}
                  {onRemoveFromBucket && (
                    <button
                      className="btn"
                      style={{
                        marginLeft: 6,
                        marginTop: 1,
                        fontSize: "0.85em",
                        padding: "4px 11px",
                        background: "#FF7262",
                        color: "#fff"
                      }}
                      onClick={() => onRemoveFromBucket(item.id)}
                      aria-label="Remove from bucket"
                    >
                      Remove
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <div style={{ fontSize: "0.93em", color: "#9CA3AF", marginTop: 10 }}>
          Drag to reorder your list. Add a personal note for future plans!
        </div>
      </div>
    </aside>
  );
}

export default BucketList;
