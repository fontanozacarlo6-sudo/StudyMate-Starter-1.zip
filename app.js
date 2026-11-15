const $ = (id) => document.getElementById(id);
let tasks = JSON.parse(localStorage.getItem('studymate-tasks') || '[]');
let notes = JSON.parse(localStorage.getItem('studymate-notes') || '[]');

function save() {
  localStorage.setItem('studymate-tasks', JSON.stringify(tasks));
  localStorage.setItem('studymate-notes', JSON.stringify(notes));
  render();
}
function render() {
  $('taskCount').textContent = tasks.filter(t => !t.done).length;
  $('noteCount').textContent = notes.length;
  $('taskList').innerHTML = tasks.length ? '' : '<li class="empty">No tasks yet. Add your first task above.</li>';
  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    if (task.done) li.className = 'done';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done; check.setAttribute('aria-label','Mark task complete');
    check.addEventListener('change', () => { tasks[i].done = check.checked; save(); });
    const span = document.createElement('span'); span.textContent = task.text;
    const del = document.createElement('button'); del.textContent = 'Delete'; del.addEventListener('click', () => { tasks.splice(i,1); save(); });
    li.append(check, span, del); $('taskList').append(li);
  });
  $('notesList').innerHTML = '';
  notes.forEach((note, i) => {
    const item = document.createElement('div'); item.className = 'note';
    const content = document.createElement('span'); content.textContent = note;
    const del = document.createElement('button'); del.textContent = 'Delete'; del.addEventListener('click', () => { notes.splice(i,1); save(); });
    item.append(content, del); $('notesList').append(item);
  });
}
$('taskForm').addEventListener('submit', e => { e.preventDefault(); const value = $('taskInput').value.trim(); if (!value) return; tasks.push({text:value,done:false}); $('taskInput').value=''; save(); });
$('saveNote').addEventListener('click', () => { const value = $('noteInput').value.trim(); if (!value) return; notes.unshift(value); $('noteInput').value=''; save(); });
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
