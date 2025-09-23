export const Datatab = [    
        {
          type: 'textfield',
          input: true,
          key: 'label',
          label: 'Label',
          tooltip: 'The label for this field.',
          value: 'Data Source',
          weight: 0,
          validate: {
            required: true
          }
        },
        {
          key: 'multiple',
          ignore: true
        },
        {
          key:"defaultValue",
          ignore: true
        },
        {
          key:"dbIndex",
          ignore: true
        },
        {
          key:"redrawOn",
          ignore: true
        },
        {
          key:"customDefaultValuePanel",
          ignore: true
        },
        {
          key:"calculateValuePanel",
          ignore: true
        },
        {
          key:"allowCalculateOverride",
          ignore: true
        },
        {
          defaultValue: false,
          input: true,
          key: "calculateServer",
          label: "Calculate Value on server",
          tooltip: "Checking this will run the calculation on server. This is useful if you wish to overrides the values submitted with the calculation performed on the server.",
          type: "checkbox",
          weight: 700
        }
]