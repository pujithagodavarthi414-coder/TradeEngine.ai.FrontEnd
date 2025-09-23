export const Triggertab = [
    {
        input: false,
        key: "trigger.init",
        label: "Trigger on Form Init",
        tooltip: "When enabled the request will be made when the form is initialized.",
        type: "checkbox",
        weight: 0
    },
    {
        input: false,
        key: "trigger.server",
        label: "Trigger on Server",
        tooltip: "When enabled the request will be made on the server during validation.",
        type: "checkbox",
        weight: 100,
        description: 'Async requests on the server can slow down processing since the server must wait for a response before proceeding. Do not add too many server side requests or performance will suffer.'
    },
    {
        input: true,
        key: "refreshOn",
        label: "Trigger on Data Change",
        tooltip: "Refresh data when another field changes.",
        type: "select",
        weight: 300,
        dataSrc: 'custom',
        valueProperty: 'value',
        data: {
            custom(context) {
              var values = [];
              values.push({ label: 'Any Change', value: 'data' });
              context.utils.eachComponent(context.instance.options.editForm.components, function(component, path) {
                if (component.key !== context.data.key) {
                  values.push({
                    label: component.label || component.key,
                    value: path
                  });
                }
              });
              return values;
            }
        }
    },
    {
        input: true,
        key: "refreshOnBlur",
        label: "Trigger on Blur of Component",
        tooltip: "Refresh data when another field was blured.",
        type: "select",
        weight: 200,
        dataSrc: 'custom',
        valueProperty: 'value',
        data: {
            custom(context) {
              var values = [];
              values.push({ label: 'Any Change', value: 'data' });
              context.utils.eachComponent(context.instance.options.editForm.components, function(component, path) {
                if (component.key !== context.data.key) {
                  values.push({
                    label: component.label || component.key,
                    value: path
                  });
                }
              });
              return values;
            }
        }
    },
    {
        type: 'textfield',
        input: true,
        key: 'refreshOnEvent',
        label: 'Trigger on Event',
        weight: 300,
        tooltip: "Refresh data when this event is fired.",
    },
    {
        type: 'textfield',
        input: true,
        key: 'event',
        label: 'Triggered Event',
        weight: 400,
        tooltip: "The event to fire when triggered.",
        description: 'When in a datagrid or editgrid, { { rowIndex } } is available for interpolation to target a specific row.'
    }
]