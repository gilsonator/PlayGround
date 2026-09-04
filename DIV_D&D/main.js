function load() {
  const draggables = document.querySelectorAll('.draggable');
  const columns = document.querySelectorAll('.column');
  let isDuplicating = false;
  let clone = null;
  let longPressTimer = null;
  let touchColumn = null;

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', handleDragStart, false);
    draggable.addEventListener('dragend', handleDragEnd, false);
    draggable.addEventListener('touchstart', handleTouchStart, false);
    draggable.addEventListener('touchend', handleTouchEnd, false);
    draggable.addEventListener('touchcancel', handleTouchEnd, false);
    draggable.addEventListener('touchmove', handleTouchMove, false);
  });

  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver, false);
    column.addEventListener('drop', handleDrop, false);
  });

  function handleDragStart(event) {
    event.target.classList.add('dragging');
    if (isDuplicating) {
      clone = event.target.cloneNode(true);
      addEventListenersToClone(clone);
    }
  }

  function handleDragEnd(event) {
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      dragging.classList.remove('dragging');
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
    // event.target.classList.add ('drag-over')
  }

  function handleDrop(event) {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(event.currentTarget, event.clientY);
    if (isDuplicating && clone) {
      if (afterElement == null) {
        event.currentTarget.appendChild(clone);
      } else {
        event.currentTarget.insertBefore(clone, afterElement);
      }
      clone = null; // Reset clone after drop
    } else {
      if (afterElement == null) {
        event.currentTarget.appendChild(dragging);
      } else {
        event.currentTarget.insertBefore(dragging, afterElement);
      }
    }
    isDuplicating = false; // Reset duplication flag
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];
    const draggable = event.target;
    draggable.classList.add('dragging');
    touchColumn = draggable.closest('.column');
    longPressTimer = setTimeout(() => {
      isDuplicating = true;
      clone = draggable.cloneNode(true);
      clone.innerHTML = clone.innerHTML + " Duplicate";
      addEventListenersToClone(clone);
    }, 500); // Long press duration (500ms)
  }

  function handleTouchMove(event) {
    event.preventDefault();
    clearTimeout(longPressTimer);
    const touch = event.touches[0];
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
      const targetColumn = elementUnderTouch && elementUnderTouch.closest('.column');
      if (targetColumn) {
        touchColumn = targetColumn;
        const afterElement = getDragAfterElement(targetColumn, touch.clientY);
        if (afterElement == null) {
          targetColumn.appendChild(dragging);
        } else if (afterElement !== dragging) {
          targetColumn.insertBefore(dragging, afterElement);
        }
      }
    }
  }

  function handleTouchEnd(event) {
    clearTimeout(longPressTimer);
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      if (isDuplicating && clone && touchColumn) {
        touchColumn.insertBefore(clone, dragging.nextSibling);
        clone = null;
      }
      dragging.classList.remove('dragging');
    }
    isDuplicating = false;
    touchColumn = null;
  }

  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function addEventListenersToClone(clone) {
    clone.addEventListener('dragstart', handleDragStart, false);
    clone.addEventListener('dragend', handleDragEnd, false);
    clone.addEventListener('touchstart', handleTouchStart, false);
    clone.addEventListener('touchend', handleTouchEnd, false);
    clone.addEventListener('touchcancel', handleTouchEnd, false);
    clone.addEventListener('touchmove', handleTouchMove, false);
  }
}

window.onload = load;
