<style>

    table {
        width: 200mm;
        border-collapse: collapse;
    }
    table.main tr:nth-child(even) td {
        background-color: #efefef;
    }
    table tr.type-section-name td {
        font-weight: bold;
        text-align: center;
        background: #fff;
        border-bottom: 2px solid #000000;
        border-top: 2px solid #000000;
    }

    table tr.total-section td {
        border-bottom: 2px solid #000000;
        border-top: 2px solid #000000;
        font-weight: bold;
        background-color: #fff;
    }

    table tr.object-work td{
        background-color: #cacaca;
        font-weight: bold;
    }

    th,
    td {
        border: 1px solid #000;
        padding: 4pt;
        font-size: 10pt;
    }

    th {
        background: #FFD020;
    }

    table.footer td{
        text-align: right;
        padding: 0 0;
        border: none;
        background: none;
    }

    .info-object {
        border-spacing: 0px;
        border-collapse: separate;
    }
    .info-object .name-document {
        background-color: #FFD020;
    }
    .info-object .name-document td {
        font-size: 14px;
        font-weight: bold;
        padding: 12px;
    }
    .info-object .info-document {
        background-color: #B5BCC0;
        font-size: 12pt;
    }
    .info-object .info-document  td {
        font-size: 14px;
        padding: 12px;
    }
    .info-object td {
        padding: 4px;
        font-family: Arial, Helvetica, sans-serif;
    }

    .info-object {
        border-right: 1px solid #000000;
        border-top: 1px solid #000000;
    }
    .info-object td {
        border-left: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }
    .info-object th {
        border-left: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    .h-name-doc {
        font-size: 18pt;
        font-weight: normal;
        text-align: center;
    }

    @page {
        header: page-header;
        footer: page-footer;
    }

    @page :first {
        header: none;
    }


</style>
