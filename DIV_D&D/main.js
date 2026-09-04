function load() {
  const draggables = document.querySelectorAll('.draggable');
  let isDuplicating = false;
  let clone = null;
  let longPressTimer = null;
  let activeColumn = null;

  draggables.forEach(draggable => {
    draggable.addEventListener('pointerdown', handlePointerStart, false);
    draggable.addEventListener('pointermove', handlePointerMove, false);
    draggable.addEventListener('pointerup', handlePointerEnd, false);
    draggable.addEventListener('pointercancel', handlePointerEnd, false);
  });

  function handlePointerStart(event) {
    event.preventDefault();
    const draggable = event.currentTarget;
    const bounds = draggable.getBoundingClientRect();
    draggable.classList.add('dragging');
    draggable.classList.add(event.pointerType === 'mouse' ? 'mouse-dragging' : 'touch-dragging');
    document.body.classList.toggle('pointer-dragging', event.pointerType === 'mouse');
    draggable.style.width = `${bounds.width}px`;
    draggable.style.left = `${event.clientX - bounds.width / 2}px`;
    draggable.style.top = `${event.clientY - bounds.height / 2}px`;
    draggable.setPointerCapture(event.pointerId);
    activeColumn = draggable.closest('.column');
    longPressTimer = setTimeout(() => {
      isDuplicating = true;
      clone = draggable.cloneNode(true);
      clone.innerHTML += ' Duplicate';
    }, 500);
  }

  function handlePointerMove(event) {
    event.preventDefault();
    clearTimeout(longPressTimer);
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      dragging.style.left = `${event.clientX - dragging.offsetWidth / 2}px`;
      dragging.style.top = `${event.clientY - dragging.offsetHeight / 2}px`;
      const elementUnderTouch = document.elementFromPoint(event.clientX, event.clientY);
      const targetColumn = elementUnderTouch && elementUnderTouch.closest('.column');
      dragging.classList.toggle('cannot-drop', !targetColumn);
      document.body.classList.toggle('pointer-cannot-drop', event.pointerType === 'mouse' && !targetColumn);
      if (targetColumn) {
        activeColumn = targetColumn;
        const afterElement = getDragAfterElement(targetColumn, event.clientY);
        if (afterElement == null) {
          targetColumn.appendChild(dragging);
        } else if (afterElement !== dragging) {
          targetColumn.insertBefore(dragging, afterElement);
        }
      }
    }
  }

  function handlePointerEnd(event) {
    clearTimeout(longPressTimer);
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      if (isDuplicating && clone && activeColumn) {
        activeColumn.insertBefore(clone, dragging.nextSibling);
        clone = null;
      }
      dragging.classList.remove('dragging');
      dragging.classList.remove('mouse-dragging', 'touch-dragging');
      dragging.classList.remove('cannot-drop');
      dragging.style.width = '';
      dragging.style.left = '';
      dragging.style.top = '';
      document.body.classList.remove('pointer-dragging', 'pointer-cannot-drop');
      if (dragging.hasPointerCapture(event.pointerId)) {
        dragging.releasePointerCapture(event.pointerId);
      }
    }
    isDuplicating = false;
    activeColumn = null;
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

}

window.onload = load;
