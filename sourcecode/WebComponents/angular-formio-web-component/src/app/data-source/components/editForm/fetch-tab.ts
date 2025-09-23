export const fetchtab = [
    {
        type: 'select',
        input: true,
        key: 'dataSrc',
        label: 'Data Source Type',
        weight: 0,
        defaultValue: "url",
        tooltip: 'The source to get the data. You can fetch from a URL or use javascript to get the value.',
        data: {
            values: [
                {label: "URL",value: "url"},
                // {label: "Indexeddb",value: "indexeddb"}
            ]
        }
    },
    {
      input: true,
      key: "fetch.url",
      label: "Data Source URL",
      placeholder: "Data Source URL",
      tooltip: "A URL that returns data. You can interpolate form data using curly bracket notation.",
      type: "textfield",
      weight: 10,
      conditional: {
          json: {
            '===': [{ var: 'data.dataSrc' }, 'url']
          }
        }
    },
    {
      input: false,
      key: "fromExisting",
      label: "Choose From Existing Databases?",
      tooltip: "Check it if you want to select an existing database.",
      type: "checkbox",
      weight: 20,
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'indexeddb']
        }
      }
    },
    {
        type: 'textfield',
        input: true,
        key: 'indexeddb.database',
        label: 'Database Name',
        weight: 40,
        tooltip: "The name of the indexeddb database.",
        conditional: {
          json: {
            '===': [{ var: 'data.dataSrc' }, 'indexeddb']&&[{ var: 'data.fromExisting' }, false]
          }
        }
    },
    {
      type: 'textfield',
      input: true,
      key: 'indexeddb.table',
      label: 'Table Name',
      weight: 60,
      tooltip: "The name of table in the indexeddb database.",
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'indexeddb']&&[{ var: 'data.fromExisting' }, false]
        }
      }
    },
    {
      type: 'select',
      input: true,
      key: 'indexeddb.database',
      label: 'Existing Database Name',
      weight: 40,
      tooltip: "The name of the existing indexeddb database.",
      data: {
          values: [ ]
      },
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'indexeddb']&&[{ var: 'data.fromExisting' }, true]
        }
      }
    },
    {
      type: 'select',
      input: true,
      key: 'indexeddb.table',
      label: 'Existing Table Name',
      weight: 60,
      tooltip: "The name of an existing table in the indexeddb database.",
      data: {
          values: [ ]
      },
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'indexeddb']&&[{ var: 'data.fromExisting' }, true]
        }
      }
    },
    {
      type: 'select',
      input: true,
      key: 'fetch.method',
      label: 'Method',
      weight: 80,
      tooltip: "The HTTP Request method to use when making the request.",
      defaultValue: "get",
      data: {
          values: [
              {label: "GET",value: "get"},
              {label: "POST",value: "post"}
          ]
      },
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'url']
        }
      }
    },
    {
      key: "fetch.headers",
      label: "‌Request Header",
      tooltip: "Set any headers that should be sent along with the request to the url. This is useful for authentication.",
      type: "datagrid",
      weight: 100,
      components: [
        {
          label: 'Key',
          key: 'key',
          input: true,
          type: 'textfield',
        },
        {
          label: 'Value',
          key: 'value',
          input: true,
          type: 'textfield',
        },
      ],
      // valueComponent: [
      //   {
      //     input: true,
      //     key: "value",
      //     label: "Value",
      //     placeholder: "Value",
      //     type: "textfield"
      //   }
      // ],
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'url']
        }
      }
    },
    {
      input: false,
      key: "fetch.forwardHeaders",
      label: "Forward Headers",
      tooltip: "Check this if you would like to forward the headers passed to the server to the fetch endpoint.",
      type: "checkbox",
      weight: 700,
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'url']
        }
      }
    },
    {
      input: false,
      key: "fetch.authenticate",
      label: "​Form.io Authentication",
      tooltip: "Check this if you would like to pass Form.io Authentication headers with the request.",
      type: "checkbox",
      weight: 700,
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'url']
        }
      }
    },
    {
      input: true,
      key: "allowCaching",
      label: "​​Enable To Store Request Result in the Cache",
      tooltip: "When checked, the requests and its results will be stored in the cache and if the Select will try to make the request to the same URL with the same paremetrs, the cached data will be returned. It allows to increase performance, but if the remote source's data is changing quite often and you always need to keep it up-to-date, uncheck this option.",
      type: "checkbox",
      weight: 700,
      conditional: {
        json: {
          '===': [{ var: 'data.dataSrc' }, 'url']
        }
      }
    },
];