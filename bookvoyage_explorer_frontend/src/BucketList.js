import React from "react";

/**
 * BucketList Component
 *
 * PUBLIC_INTERFACE
 *
 * Shows the user's saved places ("bucket list").
 * Accepts: places (array), bucketList (ids), onRemoveFromBucket (handler).
 */
function BucketList({ places = [], bucketList = [], onRemoveFromBucket }) {
  // Look up full place info for bucketed places
  const bucketItems = bucketList
    .map((id) => places.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <aside className="bucket-list">
      <h2>Bucket List</h2>
      <div className="bucket-list-content">
        {bucketItems.length === 0 ? (
          <ul>
            <li>[No items yet. Add places from the map!]</li>
          </ul>
        ) : (
          <ul>
            {bucketItems.map((p) => (
              <li key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{p.name}</span>
                {onRemoveFromBucket && (
                  <button
                    className="btn"
                    style={{ marginLeft: 10, fontSize: '0.86em', padding: '3px 10px' }}
                    onClick={() => onRemoveFromBucket(p.id)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default BucketList;
