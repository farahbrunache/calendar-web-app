import {
  getEventsLocal, deleteEventLocal, getEventById, updateStorage, getShowedMonday, setShowedMonday,
} from './localStorageData';
import { showEvents } from './showEvents';

const baseUrl = 'https://crudcrud.com/api/78a4633615894bbf8650ebe297d65c93/listEvents';

function mapEvents(tasks) {
  return tasks.map(({ _id, ...rest }) => ({ ...rest, id: _id }));
}

function getEventsList() {
  return fetch(baseUrl)
    .then((response) => response.json())
    .then((tasks) => mapEvents(tasks));
}

function addEvent(event) {
  return fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(event),
  })
    .then((response) => response.json())
    .then((resEvent) => {
      addEventToLocalStorage(event, resEvent._id);
      showEvents();
    })
    .catch((err) => {
      console.log(err);
      addEventToLocalStorage(event);
      showEvents();
    });
}

function addEventToLocalStorage(event, idEvent) {
  const listEvents = getEventsLocal();
  listEvents.push({
    ...event,
    id: idEvent || Date.now().toString(),
    createDate: new Date(),
  });
  updateStorage('listEvents', listEvents);
}

function updateEvent(eventId, updatedEvenytData) {
  deleteEventLocal(eventId);
  const listEvents = getEventsLocal();
  listEvents.push({
    ...updatedEvenytData,
    createDate: new Date(),
  });
  updateStorage('listEvents', listEvents);

  return fetch(`${baseUrl}/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(updatedEvenytData),
  })
    .catch((err) => console.log(err));
}

function deleteEvent(idEvent) {
  deleteEventLocal(idEvent);

  return fetch(`${baseUrl}/${idEvent}`, {
    method: 'DELETE',
  })
    .catch((err) => console.log(err));
}

export {
  getEventsLocal,
  getEventById,
  updateEvent,
  addEvent,
  deleteEvent,
  getShowedMonday,
  setShowedMonday,
  updateStorage,
  getEventsList,
};