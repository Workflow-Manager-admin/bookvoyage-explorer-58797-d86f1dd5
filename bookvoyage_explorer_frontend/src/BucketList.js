import React from "react";

/**
 * BucketList Component (STUB)
 * 
 * PUBLIC_INTERFACE
 * 
 * Shows the user's saved places ("bucket list") in BookVoyage Explorer.
 * Intended for display alongside the map.
 * 
 * For now, displays a static placeholder layout and description.
 */
function BucketList() {
  return (
    <aside className="bucket-list">
      <h2>Bucket List</h2>
      <div className="bucket-list-content">
        <ul>
          <li>[BucketList - Saved places will appear here!]</li>
        </ul>
      </div>
    </aside>
  );
}

export default BucketList;
