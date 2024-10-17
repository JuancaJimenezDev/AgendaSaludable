"use client"
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin,{Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

export default function Home() {
  return (
      <>
      
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
      <h1 className="font-bold text-2x1 text-gray-700">Calendario</h1>
      </nav>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <div className="grid grid-cols-10">
        <div className="col-span-8">
            <FullCalendar
             plugins={[
              dayGridPlugin,
              interactionPlugin,
              timeGridPlugin
             ]}
             headerToolbar={{
              left: 'prev,next today',
              center: 'tittle',
              right: 'resourceTimelineWook, dayGridMonth,timeGridWeek'
            }}
            events={{}}
              nowIndicator={true} 
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              //dateClick={{}} 
              //drop={}
              //eventClick={}           
              />
        </div>
      </div>
      </main>
      </>
  )
}
