let resources = [], events = [];
let startDate = new Date();
let endDate = new Date(startDate.setDate(startDate.getDate() + 7));
export default {

  minHeight: 'calc(100vh - 168px)',
  startDate: new Date().setHours(0,0,0,0),
  endDate: endDate,
  viewPreset: {
    base: 'hourAndDay',
    tickWidth: 25,
    columnLinesFor: 1,
    mainHeaderLevel: 1,
    headers: [{
        unit: 'd',
        align: 'center',
        dateFormat: 'ddd DD MMM'
      },
      {
        unit: 'h',
        align: 'center',
        dateFormat: 'HH'
      }
    ]
  },
  multiEventSelect: false,
  stripeFeature: true,
  treeFeature: false,
  adopt: 'container',
  // zoomLevel: 14,

  columns: [{
    text: 'Department',
    width: 100,
    field: 'department',
    hidden: true
  },
  {
    type: 'resourceInfo',
    text: 'Name',
    width: '13em',
    field: 'name',
    showEventCount: false,
    showRole: true
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
  // pdfExportFeature: {
  //   exportServer: 'https://dev.bryntum.com:8082' // Required
  //   // translateURLsToAbsolute: 'http://localhost:4200',
  //   // keepPathName: false
  // },
  // excelExporter: {
  //   // Choose the date format for date fields
  //   dateFormat: 'YYYY-MM-DD HH:mm'
  // }
  // eventStore: {
  //   modelClass: SchedulerEventModel,
  //   data: events,

  // },
};
