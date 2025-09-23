// data
import {
  ResourceModel,
  EventStore,
  Scheduler,
  EventModel,
  DateHelper
} from '@snovasys/snova-timeline-viewer';


ResourceModel.childrenField = 'developers';


let resources = [],
  events = [];
//end of data
let startDate = new Date();
let endDate = new Date(startDate.setDate(startDate.getDate() + 7));
export default {
 minHeight: 'calc(100vh - 168px)',
 startDate : new Date(),
 endDate: endDate,
  viewPreset: {
    base: 'minuteAndHour',

    // tickHeight: 40,
    // tickWidth: 15,
    // columnLinesFor: 0,
    // mainHeaderLevel: 1,
    // displayDateFormat: 'H:mm',
    // autoHeight: true,
    // shiftIncrement: 1,
    // shiftUnit: 'day',
    timeResolution: {
      unit: 'minute',
      increment: 30
    },
    headers: [
      {
        unit: 'd',
        increment: 1,
        align: 'center',
        dateFormat: 'ddd DD MMM'
      },
      {
        unit: 'h',
        increment: 1,
        align: 'center',
        dateFormat: 'H:mm'
      }
    ]
  },
  multiEventSelect: false,
  stripeFeature: true,
  treeFeature: false,
  adopt: 'container',
  // zoomLevel: 14,

  columns: [
    {
      type: 'resourceInfo',
      text: 'Name',
      width: '13em',
      field: 'name',
      showEventCount: false,
      showRole: false
    }
  ],
  resources: resources,
  events: events,
  eventContextMenuFeature: {
    processItems({
      eventRecord,
      items
    }) {
      if (eventRecord.data) {
        eventRecord.data.isOverlay = false;
        let plan = eventRecord.data.plan;

        if (plan && plan.isOverlay) {
          items.showSessionItem = {
            text: 'Approve',
            icon: 'b-fa b-fa-fw b-fa-thumbs-up',
            // onItem({
            //   eventRecord
            // }) {
            //   if (eventRecord.data) {
            //     eventRecord.data.isOverlay = false;
            //     let plan = eventRecord.data.plan;

            //     if (plan) {
            //       plan.isOverlay = false;
            //     }
            //   }
            // }
          };
        }
      }
    }
  },
  eventTooltipFeature: {
    template: data => {
      const task = data.eventRecord;
      return `
          ${data.startClockHtml}
          ${data.endClockHtml}
        `;
    }
  },
};
