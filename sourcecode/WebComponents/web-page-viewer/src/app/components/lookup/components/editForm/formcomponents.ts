
export const FormComponents = [
    {
        type: 'select',
        input: true,
        key: 'displayAs',
        label: 'Display As',
        defaultValue: 'dropdown_single_select',
        weight: 0,
        tooltip: 'The form control for this field that will display in the form.',
        data: {
            values: [
                {label: "Dropdown(Single Select)",value: "dropdown_single_select"},
                {label: "Dropdown(Multi Select)",value: "dropdown_multi_select"},
                {label: "Checkbox",value: "checkbox"},
                {label: "Radio Button",value: "radio"},
            ]
        },
    },
    {
        type: 'radio',
        input: true,
        inline: true,
        defaultValue: 'form',
        key: 'importDataType',
        label: 'Import Data From',
        weight: 10,
        tooltip: 'The option for import data.',
        values: [
            {label: "Form",value: "form"},
            {label: "Masters",value: "master"}
        ]
    },
    {
        type: 'htmlelement',
        key: 'masterName',
        tag: 'div',
        className: 'alert alert-info',
        content: 'Coming Soon',
        conditional: {
            json: { '===': [{ var: 'data.importDataType' }, 'master'] },
        }
    },
    {
        type: 'radio',
        input: true,
        inline: true,
        defaultValue: 'latest',
        key: 'valueSelection',
        label: 'How many related field values want to display on form?',
        weight: 60,
        tooltip: 'The option for selection of related fields values limit.',
        values: [
            {label: "Latest One",value: "latest"},
            {label: "More",value: "more"}
        ],
        conditional: {
            json: { '===': [{ var: 'data.importDataType' }, 'form'] },
        }
    },
    {
        type: 'number',
        input: true,
        key: 'valueSelectionLimit',
        label: 'Enter Limit',
        weight: 80,
        tooltip: 'The entered limit values are fetched and displyed on form.',
        mask: false,
        tableView: false,
        delimiter: false,
        requireDecimal: false,
        inputFormat: 'plain',
        conditional: {
            json: {
                and: [
                    { '===': [{ var: 'data.valueSelection' }, 'more'] },
                    { '===': [{ var: 'data.importDataType' }, 'form'] }
                ]
            }
        },
        validate: {
            required: true
        }
    },
    
];
