### Frontend

event.kuksaEvent === true: Event coming from Kuksa. To be shown on the "Kuksa" page. Not a synced event.

event.synced === true: Event is stored in both tosu database and in Kuksa, and is synced.

### Backend

event.kuksaEventId: Column in the table "Event". If null, it's a local event. If not, it's a synced event.
